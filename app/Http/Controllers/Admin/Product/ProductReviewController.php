<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    /**
     * Display a listing of product reviews.
     */
    public function index(Request $request)
    {
        $query = Review::with(['product:id,name,slug', 'user:id,name,email']);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('comment', 'like', "%{$request->search}%")
                  ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$request->search}%"))
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
            });
        }

        // Rating Filter
        if ($request->rating && $request->rating !== 'all') {
            $query->where('rating', $request->rating);
        }

        // Status Filter
        if ($request->status && !in_array($request->status, ['all', 'today'])) {
            $query->where('status', $request->status === 'published' ? 1 : 0);
        }

        // Date Range Filter
        if ($request->date_range && $request->date_range !== 'all') {
            if ($request->date_range === 'today') $query->whereDate('created_at', now());
            if ($request->date_range === 'yesterday') $query->whereDate('created_at', now()->subDay());
            if ($request->date_range === '7days') $query->where('created_at', '>=', now()->subDays(7));
            if ($request->date_range === '30days') $query->where('created_at', '>=', now()->subDays(30));
        }

        $reviews = $query->latest()
            ->cursorPaginate($request->per_page ?? 15)
            ->withQueryString();

        // Stats (Centralized for all pages)
        $stats = [
            'total' => Review::count(),
            'published' => Review::where('status', 1)->count(),
            'hidden' => Review::where('status', 0)->count(),
            'today' => Review::whereDate('created_at', now())->count(),
        ];

        return Inertia::render('Admin/Reviews/List/ReviewListPage', [
            'reviews' => $reviews,
            'filters' => $request->all(['search', 'rating', 'status', 'date_range', 'per_page']),
            'stats' => $stats,
        ]);
    }

    /**
     * Toggle the published status of a review.
     */
    public function toggleStatus(Review $review)
    {
        $review->update([
            'status' => $review->status ? 0 : 1,
        ]);

        return back()->with('success', 'Review status updated successfully.');
    }

    /**
     * Delete a product review.
     */
    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted successfully.');
    }

    /**
     * Bulk delete product reviews.
     */
    public function bulkDestroy(Request $request)
    {
        if ($request->all) {
            $query = Review::query();
            
            // Re-apply same filters as index to delete the correct subset
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('comment', 'like', "%{$request->search}%")
                      ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$request->search}%"))
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
                });
            }
            if ($request->rating && $request->rating !== 'all') $query->where('rating', $request->rating);
            if ($request->status && !in_array($request->status, ['all', 'today'])) {
                $query->where('status', $request->status === 'published' ? 1 : 0);
            }
            if ($request->date_range === 'today') $query->whereDate('created_at', now());

            $query->delete();
        } else {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:reviews,id',
            ]);
            Review::whereIn('id', $request->ids)->delete();
        }

        return back()->with('success', 'Selected reviews deleted successfully.');
    }

    /**
     * Bulk update status for product reviews.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|integer',
        ]);

        if ($request->all) {
            $query = Review::query();
            // Re-apply same filters as index
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('comment', 'like', "%{$request->search}%")
                      ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$request->search}%"))
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
                });
            }
            if ($request->rating && $request->rating !== 'all') $query->where('rating', $request->rating);
            if ($request->status_filter && !in_array($request->status_filter, ['all', 'today'])) {
                $query->where('status', $request->status_filter === 'published' ? 1 : 0);
            }
            if ($request->date_range === 'today') $query->whereDate('created_at', now());

            $query->update(['status' => $request->status]);
        } else {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:reviews,id',
            ]);
            Review::whereIn('id', $request->ids)->update(['status' => $request->status]);
        }

        return back()->with('success', 'Selected reviews status updated successfully.');
    }
}
