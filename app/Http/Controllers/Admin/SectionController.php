<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\AcademicClass;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::with(['academicClass', 'classTeacher']);

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('academicClass', function ($sub) use ($request) {
                      $sub->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('class_id') && $request->class_id !== 'all') {
            $query->where('academic_class_id', $request->class_id);
        }

        $sections = $query->latest()->paginate($request->per_page ?? 10)->withQueryString();
        
        return Inertia::render('Admin/Sections/Index', [
            'sections' => $sections,
            'classes' => AcademicClass::orderBy('numeric_value')->get(),
            'teachers' => User::where('user_type', 'teacher')->get(),
            'filters' => $request->only(['search', 'per_page', 'class_id']),
            'stats' => [
                'all' => Section::count(),
                'active' => Section::count(),
                'inactive' => 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_class_id' => 'required|exists:academic_classes,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'class_teacher_id' => 'nullable|exists:users,id',
        ]);

        Section::create($validated);

        return redirect()->back()->with('success', 'Section created successfully.');
    }

    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'academic_class_id' => 'required|exists:academic_classes,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'class_teacher_id' => 'nullable|exists:users,id',
        ]);

        $section->update($validated);

        return redirect()->back()->with('success', 'Section updated successfully.');
    }

    public function destroy(Section $section)
    {
        $section->delete();
        return redirect()->back()->with('success', 'Section deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:sections,id'
        ]);

        Section::whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', 'Selected sections deleted successfully.');
    }
}
