<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Page;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PageRepository
{
    /**
     * Get paginated page list based on request filters.
     */
    public function getPageList(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $status = $request->input('status');

        return Page::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                } elseif ($status === 'system') {
                    $query->whereIn('slug', ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions']);
                }
            })
            ->latest()
            ->paginate((int) $request->input('per_page', 10))
            ->withQueryString();
    }

    /**
     * Calculate administrative page list statistics.
     */
    public function getStats(): array
    {
        return [
            'total' => Page::count(),
            'active' => Page::where('is_active', true)->count(),
            'inactive' => Page::where('is_active', false)->count(),
            'system' => Page::whereIn('slug', ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'])->count(),
        ];
    }

    /**
     * Create a new page.
     */
    public function create(array $data): Page
    {
        return Page::create($data);
    }

    /**
     * Update an existing page.
     */
    public function update(Page $page, array $data): bool
    {
        return $page->update($data);
    }

    /**
     * Delete a page.
     */
    public function delete(Page $page): bool
    {
        return $page->delete();
    }

    /**
     * Update single page status.
     */
    public function updateStatus(Page $page, bool $isActive): bool
    {
        return $page->update([
            'is_active' => $isActive
        ]);
    }

    /**
     * Bulk status update for page list.
     */
    public function bulkUpdateStatus(array $ids, bool $all, bool $isActive, ?string $search = null): bool
    {
        $query = Page::query();
        if (!$all) {
            $query->whereIn('id', $ids);
        } else {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
        }

        $query->update(['is_active' => $isActive]);
        return true;
    }

    /**
     * Bulk delete pages from storage.
     */
    public function bulkDelete(array $ids, bool $all = false, ?string $search = null): bool
    {
        $query = Page::query();
        
        // Prevent deleting system pages
        $systemSlugs = ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'];
        $query->whereNotIn('slug', $systemSlugs);

        if (!$all) {
            $query->whereIn('id', $ids);
        } else {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
        }

        $query->delete();
        return true;
    }
}
