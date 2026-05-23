<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Products\StoreCategoryRequest;
use App\Http\Requests\Admin\Products\UpdateCategoryRequest;
use App\Http\Resources\Admin\Products\CategoryResource;
use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;
use App\Services\Admin\Category\IndexCategoryService;
use App\Services\Admin\Category\StoreCategoryService;
use App\Services\Admin\Category\UpdateCategoryService;
use App\Services\Admin\Category\DestroyCategoryService;
use App\Services\Admin\Category\BulkDestroyCategoryService;
use App\Services\Admin\Category\UpdateCategoryStatusService;
use App\Services\Admin\Category\BulkUpdateCategoryStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request, IndexCategoryService $service): InertiaResponse
    {
        $result = $service->execute($request);

        $rawCategories = $result['categories'];

        // When data comes from Redis cache it's a plain array (paginator->toArray()).
        // We must map only the 'data' items through CategoryResource and keep the
        // pagination meta (next_cursor, path, etc.) intact.
        if (is_array($rawCategories) && array_key_exists('data', $rawCategories)) {
            $rawCategories['data'] = CategoryResource::collection(
                collect($rawCategories['data'])
            )->toArray($request);
            $categories = $rawCategories;
        } else {
            // Live paginator (cache miss on first ever request before caching kicks in)
            $categories = CategoryResource::collection($rawCategories);
        }

        return Inertia::render('Admin/Categories/List/CategoryListPage', [
            'categories'          => $categories,
            'filters'             => $request->only(['search', 'status', 'root_id', 'sub_id', 'sub_sub_id', 'per_page']),
            'rootCategories'      => $result['lookups']['rootCategories'],
            'allSubCategories'    => $result['lookups']['allSubCategories'],
            'allSubSubCategories' => $result['lookups']['allSubSubCategories'],
            'stats'               => $result['stats'],
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(CategoryRepository $repository): InertiaResponse
    {
        return Inertia::render('Admin/Categories/Create/CategoryCreatePage', [
            'categories' => $repository->getFormCategories(),
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreCategoryRequest $request, StoreCategoryService $service)
    {
        $category = $service->execute($request->validated(), $request->file('image'));

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'category' => $category]);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category, CategoryRepository $repository): InertiaResponse
    {
        return Inertia::render('Admin/Categories/Edit/CategoryEditPage', [
            'category' => $category,
            'categories' => $repository->getFormCategoriesExcept($category->id),
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryService $service): RedirectResponse
    {
        $service->execute($category, $request->validated(), $request->file('image'));

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category, DestroyCategoryService $service): RedirectResponse
    {
        $service->execute($category);

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }

    /**
     * Bulk remove categories from storage.
     */
    public function bulkDestroy(Request $request, BulkDestroyCategoryService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'ids.*' => 'exists:categories,id',
            'all' => 'required|boolean',
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected categories deleted successfully.');
    }

    /**
     * Update status for a category.
     */
    public function updateStatus(Request $request, Category $category, UpdateCategoryStatusService $service): RedirectResponse
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $service->execute($category, (bool) $request->input('is_active'));

        return redirect()->back()->with('success', 'Category status updated successfully.');
    }

    /**
     * Bulk update status for categories.
     */
    public function bulkUpdateStatus(Request $request, BulkUpdateCategoryStatusService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'is_active' => 'required|boolean'
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            (bool) $request->input('is_active'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected categories updated successfully.');
    }
}
