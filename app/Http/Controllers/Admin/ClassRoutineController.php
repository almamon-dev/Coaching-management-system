<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassRoutine;
use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassRoutineController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassRoutine::with(['academicClass', 'section', 'subject', 'teacher']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('academicClass', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('section', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('teacher', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $routines = $query->latest()->paginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('Admin/ClassRoutines/Index', [
            'routines' => $routines,
            'classes' => AcademicClass::orderBy('numeric_value')->get(),
            'sections' => Section::orderBy('name')->get(),
            'subjects' => Subject::orderBy('name')->get(),
            'teachers' => User::where('user_type', 'teacher')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'per_page']),
            'stats' => [
                'all' => ClassRoutine::count(),
                'active' => ClassRoutine::count(),
                'inactive' => 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:users,id',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_number' => 'nullable|string|max:50',
        ]);

        ClassRoutine::create($validated);

        return redirect()->back()->with('success', 'Class routine created successfully.');
    }

    public function update(Request $request, ClassRoutine $classRoutine)
    {
        $validated = $request->validate([
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:users,id',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_number' => 'nullable|string|max:50',
        ]);

        $classRoutine->update($validated);

        return redirect()->back()->with('success', 'Class routine updated successfully.');
    }

    public function destroy(ClassRoutine $classRoutine)
    {
        $classRoutine->delete();
        return redirect()->back()->with('success', 'Class routine deleted successfully.');
    }
}
