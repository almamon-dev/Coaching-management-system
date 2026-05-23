<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Product;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductRepository
{
    /**
     * Get paginated product list.
     * Stats are fetched separately via getStats() — cached independently.
     */
    public function getProductList(Request $request)
    {
        return $this->buildProductQuery($request)
            ->cursorPaginate($request->per_page ?? 10)
            ->withQueryString();
    }

    /**
     * Get global product statistics.
     * Single LEFT JOIN query — no correlated subqueries, no full-table NOT EXISTS.
     * Called once and cached independently from the list.
     */
    public function getStats(): array
    {
        $row = DB::selectOne("
            SELECT
                COUNT(*)           AS total,
                SUM(p.status = 1)  AS published,
                SUM(p.status = 0)  AS draft,
                SUM(p.status = 2)  AS private,
                SUM(pi.product_id IS NULL) AS noImage
            FROM products p
            LEFT JOIN (SELECT DISTINCT product_id FROM product_images) pi
                   ON pi.product_id = p.id
        ");

        return [
            'total'     => (int) ($row->total ?? 0),
            'published' => (int) ($row->published ?? 0),
            'draft'     => (int) ($row->draft ?? 0),
            'private'   => (int) ($row->private ?? 0),
            'noImage'   => (int) ($row->noImage ?? 0),
        ];
    }

    /**
     * Build the product listing query.
     *
     * Kept intentionally lean for the list view:
     * - No correlated subqueries (coupons_count belongs on the detail page)
     * - withExists() for has_images uses a single EXISTS check per page, not per row
     */
    protected function buildProductQuery(Request $request)
    {
        $query = Product::select([
            'id', 'name', 'slug', 'sku', 'price', 'discount_price', 'stock',
            'status', 'brand_id', 'category_id', 'is_featured',
            'has_emi', 'warranty', 'view_count', 'created_at',
        ])
        ->with([
            'brand:id,name',
            'category:id,name',
            'primaryImage:id,product_id,image',
        ])
        ->withExists('images as has_images');   // single EXISTS, not correlated-per-row

        $this->applyFilters($query, $request);
        $this->applySorting($query, $request->get('sort_by', 'latest'));

        return $query;
    }

    /**
     * Apply search and filter constraints.
     */
    protected function applyFilters($query, Request $request): void
    {
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%")
            );
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('brand_id') && $request->brand_id !== 'all') {
            $query->where('brand_id', $request->brand_id);
        }
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
    }

    /**
     * Apply sorting to the query.
     */
    protected function applySorting($query, string $sort): void
    {
        match ($sort) {
            'price_low'  => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'name_az'    => $query->orderBy('name', 'asc'),
            'stock_low'  => $query->orderBy('stock', 'asc'),
            'stock_high' => $query->orderBy('stock', 'desc'),
            default      => $query->orderByDesc('id'),
        };
    }
}
