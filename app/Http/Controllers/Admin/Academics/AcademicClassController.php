<?php

namespace App\Http\Controllers\Admin\Academics;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicClassController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $classes = AcademicClass::withCount('sections')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('numeric_value', 'asc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $stats = [
            'all' => AcademicClass::count()
        ];

        return Inertia::render('Admin/AcademicClasses/List/AcademicClassListPage', [
            'classes' => $classes,
            'filters' => $request->only(['search', 'per_page']),
            'stats' => $stats
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/AcademicClasses/Create/AcademicClassCreatePage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'numeric_value' => 'required|integer|min:1',
            'sections' => 'nullable|array',
            'sections.*.name' => 'required|string|max:255',
            'sections.*.capacity' => 'nullable|integer|min:1',
        ]);

        $class = AcademicClass::create([
            'name' => $validated['name'],
            'numeric_value' => $validated['numeric_value'],
        ]);

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $sectionData) {
                $class->sections()->create([
                    'name' => $sectionData['name'],
                    'capacity' => $sectionData['capacity'] ?? 40,
                ]);
            }
        }

        return redirect()->route('admin.classes.index')->with('success', 'Class and Sections created successfully.');
    }

    public function edit($id)
    {
        $class = AcademicClass::with('sections')->findOrFail($id);
        return Inertia::render('Admin/AcademicClasses/Edit/AcademicClassEditPage', [
            'academic_class' => $class
        ]);
    }

    public function update(Request $request, $id)
    {
        $class = AcademicClass::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'numeric_value' => 'required|integer|min:1',
            'sections' => 'nullable|array',
            'sections.*.id' => 'nullable|exists:sections,id',
            'sections.*.name' => 'required|string|max:255',
            'sections.*.capacity' => 'nullable|integer|min:1',
        ]);

        $class->update([
            'name' => $validated['name'],
            'numeric_value' => $validated['numeric_value'],
        ]);

        // Sync Sections
        $submittedSectionIds = collect($validated['sections'] ?? [])->pluck('id')->filter()->toArray();
        // Delete sections that were removed
        $class->sections()->whereNotIn('id', $submittedSectionIds)->delete();

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $sectionData) {
                if (isset($sectionData['id'])) {
                    $class->sections()->where('id', $sectionData['id'])->update([
                        'name' => $sectionData['name'],
                        'capacity' => $sectionData['capacity'] ?? 40,
                    ]);
                } else {
                    $class->sections()->create([
                        'name' => $sectionData['name'],
                        'capacity' => $sectionData['capacity'] ?? 40,
                    ]);
                }
            }
        }

        return redirect()->route('admin.classes.index')->with('success', 'Class and Sections updated successfully.');
    }

    public function destroy(AcademicClass $class)
    {
        $class->delete();
        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        AcademicClass::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', 'Classes deleted successfully.');
    }
}
