<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Assignment::with(['academicClass', 'section', 'subject'])
            ->where('teacher_id', auth()->id());

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $assignments = $query->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        $teacherId = auth()->id();
        $assigned = \Illuminate\Support\Facades\DB::table('subject_teacher')
            ->where('user_id', $teacherId)
            ->get();

        $classIds = $assigned->pluck('academic_class_id')->unique();
        $sectionIds = $assigned->pluck('section_id')->unique();
        $subjectIds = $assigned->pluck('subject_id')->unique();

        return Inertia::render('Teacher/Assignments/Index', [
            'assignments' => $assignments,
            'classes' => AcademicClass::whereIn('id', $classIds)->orderBy('numeric_value')->get(),
            'sections' => Section::whereIn('id', $sectionIds)->orderBy('name')->get(),
            'subjects' => Subject::whereIn('id', $subjectIds)->orderBy('name')->get(),
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'due_date' => 'required|date|after_or_equal:today',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,zip|max:10240', // max 10MB
        ]);

        $filePath = null;
        if ($request->hasFile('attachment')) {
            $filePath = FileUploader::upload('assignments', $request->file('attachment'));
        }

        Assignment::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'academic_class_id' => $validated['academic_class_id'],
            'section_id' => $validated['section_id'],
            'subject_id' => $validated['subject_id'],
            'due_date' => $validated['due_date'],
            'file_path' => $filePath,
            'teacher_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Assignment created successfully.');
    }

    public function destroy(Assignment $assignment)
    {
        if ($assignment->teacher_id !== auth()->id()) {
            abort(403);
        }
        if ($assignment->file_path) {
            FileRemover::delete($assignment->file_path);
        }
        $assignment->delete();
        return redirect()->back()->with('success', 'Assignment deleted successfully.');
    }
}
