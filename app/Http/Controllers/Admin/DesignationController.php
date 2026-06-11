<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $query = Designation::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status === 'active' ? 1 : 0);
        }

        $designations = $query->orderBy('name')->paginate($request->per_page ?? 10)->withQueryString();

        $stats = [
            'all' => Designation::count(),
            'active' => Designation::where('status', 1)->count(),
            'inactive' => Designation::where('status', 0)->count(),
        ];

        return Inertia::render('Admin/Designations/Index', [
            'designations' => $designations,
            'filters' => $request->only(['search', 'per_page', 'status']),
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:designations,name',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        Designation::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Designation $designation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:designations,name,' . $designation->id,
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $designation->update($validated);

        return redirect()->back();
    }

    public function destroy(Designation $designation)
    {
        $designation->delete();
        return redirect()->back();
    }
}
