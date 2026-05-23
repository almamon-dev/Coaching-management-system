<?php

namespace App\Http\Controllers\Admin\Supplier;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Http\Requests\Admin\UpdateSupplierRequest;
use App\Http\Resources\Admin\SupplierResource;
use App\Models\Brand;
use App\Models\Supplier;
use App\Services\Admin\Supplier\IndexSupplierService;
use App\Services\Admin\Supplier\StoreSupplierService;
use App\Services\Admin\Supplier\UpdateSupplierService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request, IndexSupplierService $service)
    {
        $result = $service->execute($request);

        return Inertia::render('Admin/Suppliers/List/SupplierListPage', [
            'suppliers' => SupplierResource::collection($result['suppliers']),
            'filters' => $request->only(['search', 'status', 'brand_id', 'per_page']),
            'brands' => $result['brands'],
            'stats' => $result['stats'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Suppliers/Create/SupplierCreatePage', [
            'brands' => Brand::active()->get(['id', 'name']),
        ]);
    }

    public function store(StoreSupplierRequest $request, StoreSupplierService $service)
    {
        $service->execute($request->validated(), $request->file('logo'));

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier created successfully.');
    }

    public function edit(Supplier $supplier)
    {
        $supplier->load('brands');

        return Inertia::render('Admin/Suppliers/Edit/SupplierEditPage', [
            'supplier' => new SupplierResource($supplier),
            'brands' => Brand::active()->get(['id', 'name']),
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier, UpdateSupplierService $service)
    {
        $service->execute($supplier, $request->validated(), $request->file('logo'));

        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->back()->with('success', 'Supplier deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'ids.*' => 'exists:suppliers,id',
            'all' => 'required|boolean',
        ]);

        if ($request->all) {
            $query = Supplier::query();

            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('email', 'like', '%'.$request->search.'%');
                });
            }

            $query->delete();
        } else {
            Supplier::whereIn('id', $request->ids)->delete();
        }

        return redirect()->back()->with('success', 'Selected suppliers deleted successfully.');
    }

    public function updateStatus(Request $request, Supplier $supplier)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $supplier->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Supplier status updated successfully.');
    }
}
