<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Warehouse;
use Inertia\Inertia;
use Illuminate\Support\Str;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Warehouse::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $warehouses = $query->latest()
            ->cursorPaginate($request->per_page ?? 10)
            ->withQueryString();

        $stats = [
            'total' => Warehouse::count(),
            'active' => Warehouse::where('is_active', true)->count(),
            'inactive' => Warehouse::where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Warehouses/List/WarehouseListPage', [
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'stats' => $stats
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        // Ensure slug is unique
        $count = Warehouse::where('slug', 'like', $validated['slug'].'%')->count();
        if ($count > 0) {
            $validated['slug'] = $validated['slug'] . '-' . ($count + 1);
        }

        Warehouse::create($validated);

        return back()->with('success', 'Warehouse created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        if ($validated['name'] !== $warehouse->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $count = Warehouse::where('slug', 'like', $validated['slug'].'%')->where('id', '!=', $warehouse->id)->count();
            if ($count > 0) {
                $validated['slug'] = $validated['slug'] . '-' . ($count + 1);
            }
        }

        $warehouse->update($validated);

        return back()->with('success', 'Warehouse updated successfully.');
    }

    /**
     * Toggle status.
     */
    public function status(Warehouse $warehouse)
    {
        $warehouse->update(['is_active' => !$warehouse->is_active]);
        return back()->with('success', 'Warehouse status updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();
        return back()->with('success', 'Warehouse deleted successfully.');
    }

    /**
     * Bulk delete.
     */
    public function bulkDelete(Request $request)
    {
        Warehouse::whereIn('id', $request->ids)->delete();
        return back()->with('success', 'Selected warehouses deleted.');
    }
}
