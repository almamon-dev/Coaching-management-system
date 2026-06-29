<?php

namespace App\Http\Controllers\Admin\Academics;

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
        $assignedSections = Section::with('academicClass')->whereNotNull('class_teacher_id')->get()->keyBy('class_teacher_id');
        $teachers = User::whereHas('roles', function($q) { $q->where('name', 'staff'); })->get()->map(function($teacher) use ($assignedSections) {
            if ($assignedSections->has($teacher->id)) {
                $sec = $assignedSections->get($teacher->id);
                $className = $sec->academicClass ? $sec->academicClass->name : '';
                $teacher->assigned_label = trim($className . ' ' . $sec->name);
            } else {
                $teacher->assigned_label = null;
            }
            return $teacher;
        });

        return Inertia::render('Admin/Sections/Index', [
            'sections' => $sections,
            'classes' => AcademicClass::orderBy('numeric_value')->get(),
            'teachers' => $teachers,
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
