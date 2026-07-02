<?php

namespace App\Http\Controllers\Admin\Fees;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FeeGroup;
use App\Models\FeeType;
use App\Models\AcademicClass;
use Illuminate\Support\Facades\DB;

class FeeGroupController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeGroup::with(['items.type', 'academicClass']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('academicClass', function ($classQuery) use ($search) {
                      $classQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        $allowedSortFields = ['name', 'description', 'is_active', 'created_at'];
        
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $feeGroups = $query->paginate($request->get('per_page', 10))
            ->withQueryString();

        $feeTypes = FeeType::where('is_active', true)->orderBy('category')->orderBy('name')->get();
        $academicClasses = AcademicClass::orderBy('name')->get();

        return Inertia::render('Admin/Fees/Groups/Index', [
            'feeGroups' => $feeGroups,
            'feeTypes' => $feeTypes,
            'academicClasses' => $academicClasses,
            'filters' => $request->only(['search', 'per_page', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.fee_type_id' => 'required|exists:fee_types,id',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $feeGroup = FeeGroup::create([
                'name' => $validated['name'],
                'academic_class_id' => $validated['academic_class_id'],
                'description' => $validated['description'] ?? null,
                'is_active' => $request->has('is_active') ? $request->is_active : true,
            ]);

            if (!empty($validated['items'])) {
                $feeGroup->items()->createMany($validated['items']);
            }
        });

        return back()->with('success', 'Fee Group created successfully.');
    }

    public function update(Request $request, FeeGroup $feeGroup)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.fee_type_id' => 'required|exists:fee_types,id',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request, $feeGroup) {
            $feeGroup->update([
                'name' => $validated['name'],
                'academic_class_id' => $validated['academic_class_id'],
                'description' => $validated['description'] ?? null,
                'is_active' => $request->has('is_active') ? $request->is_active : $feeGroup->is_active,
            ]);

            $feeGroup->items()->delete();

            if (!empty($validated['items'])) {
                $feeGroup->items()->createMany($validated['items']);
            }
        });

        return back()->with('success', 'Fee Group updated successfully.');
    }

    public function destroy(FeeGroup $feeGroup)
    {
        $feeGroup->delete();
        return back()->with('success', 'Fee Group deleted successfully.');
    }
}
