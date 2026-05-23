<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Brand;

use App\Models\Brand;
use App\Support\Media\FileRemover;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BrandRepository
{
    /**
     * Get filtered brands and statistics.
     */
    public function getBrandList(Request $request): array
    {
        $query = Brand::query()->select(['id', 'name', 'slug', 'logo', 'status', 'is_featured', 'created_at']);

        // Add Product Count via Subquery (Faster than withCount)
        $query->addSelect([
            'products_count' => \App\Models\Product::whereColumn('brand_id', 'brands.id')
                ->selectRaw('count(*)')
        ]);

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

        // Is Featured Filter
        if ($request->filled('is_featured') && $request->is_featured !== 'all') {
            $query->where('is_featured', $request->is_featured === '1' ? 1 : 0);
        }

        // Has Logo Filter
        if ($request->filled('has_logo') && $request->has_logo !== 'all') {
            if ($request->has_logo === '1') {
                $query->whereNotNull('logo')->where('logo', '!=', '');
            } else {
                $query->where(function($q) {
                    $q->whereNull('logo')->orWhere('logo', '');
                });
            }
        }

        $brands = $query->orderByDesc('id')
            ->cursorPaginate($request->per_page ?? 10)
            ->withQueryString();

        return [
            'brands' => $brands,
            'stats' => $this->getStats()
        ];
    }

    /**
     * Create a new brand.
     */
    public function create(array $data): Brand
    {
        return Brand::create($data);
    }

    /**
     * Update an existing brand.
     */
    public function update(Brand $brand, array $data): bool
    {
        return $brand->update($data);
    }

    /**
     * Delete a brand.
     */
    public function delete(Brand $brand): bool
    {
        if ($brand->logo) {
            FileRemover::delete($brand->logo);
        }
        return (bool) $brand->delete();
    }

    /**
     * Bulk delete brands.
     */
    public function bulkDelete(array $ids, bool $all = false, ?string $search = null): bool
    {
        $query = Brand::query();

        if ($all) {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
            $brands = $query->get(['logo']);
            foreach ($brands as $brand) {
                if ($brand->logo) {
                    FileRemover::delete($brand->logo);
                }
            }
            $query->delete();
        } else {
            $brands = Brand::whereIn('id', $ids)->get(['logo']);
            foreach ($brands as $brand) {
                if ($brand->logo) {
                    FileRemover::delete($brand->logo);
                }
            }
            Brand::whereIn('id', $ids)->delete();
        }

        return true;
    }

    /**
     * Update brand status.
     */
    public function updateStatus(Brand $brand, int $status): bool
    {
        return $brand->update([
            'status' => $status
        ]);
    }

    /**
     * Bulk update brand status or is_featured.
     */
    public function bulkUpdateStatus(array $ids, bool $all, string $field, $value, ?string $search = null): bool
    {
        $query = Brand::query();

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

        $query->update([$field => $value]);

        return true;
    }

    /**
     * Calculate brand statistics optimized.
     */
    protected function getStats(): array
    {
        $statsData = DB::table('brands')->selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive,
            SUM(CASE WHEN logo IS NOT NULL AND logo != "" THEN 1 ELSE 0 END) as withLogo,
            SUM(CASE WHEN logo IS NULL OR logo = "" THEN 1 ELSE 0 END) as noLogo
        ')->first();

        return [
            'total'    => (int) ($statsData->total ?? 0),
            'active'   => (int) ($statsData->active ?? 0),
            'inactive' => (int) ($statsData->inactive ?? 0),
            'withLogo' => (int) ($statsData->withLogo ?? 0),
            'noLogo'   => (int) ($statsData->noLogo ?? 0),
        ];
    }
}
