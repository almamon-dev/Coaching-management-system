<?php

namespace App\Http\Controllers\Admin\Fees;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FeeType;

class FeeTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeType::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $sortField = $request->get('sort_field', 'category');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        $allowedSortFields = ['category', 'name', 'code', 'is_active', 'created_at'];
        
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
            if ($sortField === 'category') {
                $query->orderBy('name', 'asc'); // Secondary sort
            }
        } else {
            $query->orderBy('category')->orderBy('name');
        }

        $feeTypes = $query->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('Admin/Fees/Types/Index', [
            'feeTypes' => $feeTypes,
            'filters' => $request->only(['search', 'per_page', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:fee_types,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        FeeType::create([
            'category' => $validated['category'],
            'name' => $validated['name'],
            'code' => strtoupper(str_replace(' ', '_', $validated['code'])),
            'description' => $validated['description'] ?? null,
            'is_active' => $request->has('is_active') ? $request->is_active : true,
        ]);

        return back()->with('success', 'Fee Type created successfully.');
    }

    public function update(Request $request, FeeType $feeType)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:fee_types,code,' . $feeType->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $feeType->update([
            'category' => $validated['category'],
            'name' => $validated['name'],
            'code' => strtoupper(str_replace(' ', '_', $validated['code'])),
            'description' => $validated['description'] ?? null,
            'is_active' => $request->has('is_active') ? $request->is_active : $feeType->is_active,
        ]);

        return back()->with('success', 'Fee Type updated successfully.');
    }

    public function destroy(FeeType $feeType)
    {
        $feeType->delete();
        return back()->with('success', 'Fee Type deleted successfully.');
    }
}
