<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Category;


use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryRepository
{
    /**
     * Get filtered categories and statistics.
     */
    public function getCategoryList(Request $request): array
    {
        $query = Category::query()
            ->select(['id', 'name', 'slug', 'image', 'status', 'parent_id', 'created_at'])
            ->with(['parent:id,name,parent_id'])
            ->withCount(['products']);

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
            });
        }

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status === 'active' ? 1 : 0);
        }

        // Hierarchy Filtering
        $this->applyHierarchyFilter($query, $request);

        $categories = $query->orderByDesc('id')
            ->cursorPaginate($request->per_page ?? 10)
            ->withQueryString();

        return [
            'categories' => $categories,
            'stats' => $this->getStats(),
            'lookups' => $request->has('want_lookups') ? $this->getLookups() : [
                'rootCategories' => [],
                'allSubCategories' => [],
                'allSubSubCategories' => [],
            ]
        ];
    }

    /**
     * Create a new category.
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update an existing category.
     */
    public function update(Category $category, array $data): bool
    {
        return $category->update($data);
    }

    /**
     * Delete a category.
     */
    public function delete(Category $category): bool
    {
        return $category->delete();
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(array $ids, bool $all = false, ?string $search = null): bool
    {
        $query = Category::query();

        if ($all) {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
            $query->delete();
        } else {
            Category::whereIn('id', $ids)->delete();
        }

        return true;
    }

    /**
     * Update single category status.
     */
    public function updateStatus(Category $category, bool $isActive): bool
    {
        return $category->update([
            'status' => $isActive ? 1 : 0
        ]);
    }

    /**
     * Bulk update category status.
     */
    public function bulkUpdateStatus(array $ids, bool $all, bool $isActive, ?string $search = null): bool
    {
        $query = Category::query();

        if (!$all) {
            $query->whereIn('id', $ids);
        } else {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
        }

        $query->update(['status' => $isActive ? 1 : 0]);

        return true;
    }

    /**
     * Get categories for form dropdown (id, name, parent_id).
     */
    public function getFormCategories(): Collection
    {
        return Category::all(['id', 'name', 'parent_id']);
    }

    /**
     * Get categories for form dropdown except the category itself (to avoid self-parenting).
     */
    public function getFormCategoriesExcept(int $exceptId): Collection
    {
        return Category::where('id', '!=', $exceptId)->get(['id', 'name', 'parent_id']);
    }



    /**
     * Get categories structured as a tree for the navbar.
     */
    public function getNavbarCategoriesTree(): Collection
    {
        $select = ['id', 'name', 'slug', 'parent_id', 'status'];
        $categories = Category::select($select)
            ->where('status', 1)
            ->whereNull('parent_id')
            ->with([
                'children' => fn ($q) => $q->select($select)->where('status', 1),
                'children.children' => fn ($q) => $q->select($select)->where('status', 1),
            ])
            ->get();

        $this->attachTopBrands($categories);

        return $categories;
    }

    /**
     * Get categories structured for homepage layout with brand dependencies.
     */
    public function getHomeCategoriesWithBrands(): Collection
    {
        $categories = Category::where('status', 1)->whereNull('parent_id')
            ->with([
                'children' => fn ($q) => $q->where('status', 1),
                'children.children' => fn ($q) => $q->where('status', 1)
            ])
            ->get();

        $this->attachTopBrands($categories);

        return $categories;
    }

    /**
     * Helper to attach top brands recursively to categories.
     */
    protected function attachTopBrands(Collection $categories): void
    {
        $attachBrands = function ($items) use (&$attachBrands) {
            foreach ($items as $item) {
                $item->top_brands = $item->top_brands;
                if ($item->children->count() > 0) {
                    $attachBrands($item->children);
                }
            }
        };
        
        $attachBrands($categories);
    }

    /**
     * Apply hierarchy filtering.
     */
    protected function applyHierarchyFilter($query, Request $request): void
    {
        if ($request->filled('root_type')) {
            if ($request->root_type === 'root') {
                $query->whereNull('parent_id');
            } elseif ($request->root_type === 'sub') {
                $query->whereHas('parent', function($q) { $q->whereNull('parent_id'); });
            } elseif ($request->root_type === 'sub_sub') {
                $query->whereHas('parent.parent', function($q) { $q->whereNull('parent_id'); });
            }
        }

        if ($request->filled('has_image')) {
            $request->has_image === '1' ? $query->whereNotNull('image') : $query->whereNull('image');
        }

        if ($request->filled('sub_sub_id') && $request->sub_sub_id !== 'all') {
            $query->where('id', $request->sub_sub_id);
        } elseif ($request->filled('sub_id') && $request->sub_id !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('id', $request->sub_id)->orWhere('parent_id', $request->sub_id);
            });
        } elseif ($request->filled('root_id') && $request->root_id !== 'all') {
            $rootId = $request->root_id;
            $query->where(function($q) use ($rootId) {
                $q->where('id', $rootId)
                  ->orWhere('parent_id', $rootId)
                  ->orWhereIn('parent_id', function($subQ) use ($rootId) {
                      $subQ->select('id')->from('categories')->where('parent_id', $rootId);
                  });
            });
        }
    }

    /**
     * Calculate category statistics optimized.
     */
    protected function getStats(): array
    {
        $statsData = DB::table('categories')->selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive,
            SUM(CASE WHEN parent_id IS NULL THEN 1 ELSE 0 END) as root,
            SUM(CASE WHEN image IS NOT NULL THEN 1 ELSE 0 END) as withImage
        ')->first();

        $subCount = DB::table('categories as c1')
            ->join('categories as c2', 'c1.parent_id', '=', 'c2.id')
            ->whereNull('c2.parent_id')
            ->count();

        $subSubCount = DB::table('categories as c1')
            ->join('categories as c2', 'c1.parent_id', '=', 'c2.id')
            ->join('categories as c3', 'c2.parent_id', '=', 'c3.id')
            ->whereNull('c3.parent_id')
            ->count();

        return [
            'total'    => (int) ($statsData->total ?? 0),
            'active'   => (int) ($statsData->active ?? 0),
            'inactive' => (int) ($statsData->inactive ?? 0),
            'root'     => (int) ($statsData->root ?? 0),
            'sub'      => $subCount,
            'sub_sub'  => $subSubCount,
            'withImage'=> (int) ($statsData->withImage ?? 0),
            'noImage'  => (int) ($statsData->total - $statsData->withImage),
        ];
    }

    /**
     * Get lookup data for filters optimized.
     */
    protected function getLookups(): array
    {
        $roots = Category::whereNull('parent_id')->select('id', 'name')->get();
        $rootIds = $roots->pluck('id');

        $subs = Category::whereIn('parent_id', $rootIds)->select('id', 'name', 'parent_id')->get();
        $subIds = $subs->pluck('id');

        $subSubs = Category::whereIn('parent_id', $subIds)->select('id', 'name', 'parent_id')->get();

        return [
            'rootCategories' => $roots,
            'allSubCategories' => $subs,
            'allSubSubCategories' => $subSubs,
        ];
    }
}
