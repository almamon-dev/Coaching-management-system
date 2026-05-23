<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Brand;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Products\StoreBrandRequest;
use App\Http\Requests\Admin\Products\UpdateBrandRequest;
use App\Http\Resources\Admin\Products\BrandResource;
use App\Models\Brand;
use App\Services\Admin\Brand\IndexBrandService;
use App\Services\Admin\Brand\StoreBrandService;
use App\Services\Admin\Brand\UpdateBrandService;
use App\Services\Admin\Brand\DestroyBrandService;
use App\Services\Admin\Brand\BulkDestroyBrandService;
use App\Services\Admin\Brand\UpdateBrandStatusService;
use App\Services\Admin\Brand\BulkUpdateBrandStatusService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BrandController extends Controller
{
    /**
     * Display a listing of brands.
     */
    public function index(Request $request, IndexBrandService $service): InertiaResponse
    {
        $result = $service->execute($request);
        $rawBrands = $result['brands'];

        // When data comes from Redis cache it's a plain array.
        // We must map only the 'data' items through BrandResource.
        if (is_array($rawBrands) && array_key_exists('data', $rawBrands)) {
            $rawBrands['data'] = BrandResource::collection(
                collect($rawBrands['data'])
            )->toArray($request);
            $brands = $rawBrands;
        } else {
            $brands = BrandResource::collection($rawBrands);
        }

        return Inertia::render('Admin/Brands/List/BrandListPage', [
            'brands'  => $brands,
            'filters' => $request->only(['search', 'status', 'has_logo', 'is_featured', 'per_page']),
            'stats'   => $result['stats'],
        ]);
    }

    /**
     * Show the form for creating a new brand.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Brands/Create/BrandCreatePage');
    }

    /**
     * Store a newly created brand in storage.
     */
    public function store(StoreBrandRequest $request, StoreBrandService $service)
    {
        $brand = $service->execute($request->validated(), $request->file('logo'));

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'brand' => new BrandResource($brand)]);
        }

        return redirect()->route('admin.brands.index')->with('success', 'Brand created successfully.');
    }

    /**
     * Show the form for editing the specified brand.
     */
    public function edit(Brand $brand): InertiaResponse
    {
        return Inertia::render('Admin/Brands/Edit/BrandEditPage', [
            'brand' => new BrandResource($brand),
        ]);
    }

    /**
     * Update the specified brand in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand, UpdateBrandService $service): RedirectResponse
    {
        $service->execute($brand, $request->validated(), $request->file('logo'));

        return redirect()->route('admin.brands.index')->with('success', 'Brand updated successfully.');
    }

    /**
     * Remove the specified brand from storage.
     */
    public function destroy(Brand $brand, DestroyBrandService $service): RedirectResponse
    {
        $service->execute($brand);

        return redirect()->back()->with('success', 'Brand deleted successfully.');
    }

    /**
     * Update status for a single brand.
     */
    public function updateStatus(Request $request, Brand $brand, UpdateBrandStatusService $service): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:1,0'
        ]);

        $service->execute($brand, (int) $request->status);

        return redirect()->back()->with('success', 'Brand status updated successfully.');
    }

    /**
     * Bulk update status / featured for brands.
     */
    public function bulkUpdateStatus(Request $request, BulkUpdateBrandStatusService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'field' => 'required|in:status,is_featured',
            'value' => 'required'
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('field'),
            $request->input('value'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected brands updated successfully.');
    }

    /**
     * Bulk destroy brands.
     */
    public function bulkDestroy(Request $request, BulkDestroyBrandService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'ids.*' => 'exists:brands,id',
            'all' => 'required|boolean'
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected brands deleted successfully.');
    }
}
