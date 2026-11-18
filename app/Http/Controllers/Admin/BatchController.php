<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Batch;
use App\Models\Course;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\ActivityLog;

class BatchController extends Controller
{
    public function index()
    {
        $batches = Batch::with(['course', 'subject', 'teacher'])
            ->withCount('students')
            ->orderBy('id', 'asc')
            ->get();

        $courses = Course::with('subjects')->where('status', 'active')->orderBy('id', 'asc')->get();
        $subjects = Subject::all();
        $teachers = TeacherProfile::where('status', 'active')->get();

        return Inertia::render('Admin/Batches/Index', [
            'batches' => $batches,
            'courses' => $courses,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function create()
    {
        return redirect()->route('admin.batches.index');
    }

    public function show($id)
    {
        $batch = Batch::with(['course', 'subject', 'teacher', 'students', 'classRoutines' => fn($q) => $q->latest('class_date')->take(10)])
            ->withCount('students')
            ->findOrFail($id);

        return Inertia::render('Admin/Batches/Show', [
            'batch' => $batch,
        ]);
    }

    public function edit($id)
    {
        return redirect()->route('admin.batches.index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teacher_profiles,id',
            'room' => 'nullable|string|max:100',
            'image' => 'nullable',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'class_days' => 'nullable|string', // e.g. "Sun, Tue, Thu"
            'class_time' => 'nullable|string', // e.g. "09:00 AM - 10:30 AM"
            'max_students' => 'required|integer|min:1',
            'status' => 'required|in:active,completed,upcoming,inactive',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('batches', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (is_string($request->input('image'))) {
            $validated['image'] = $request->input('image');
        }

        $batch = Batch::create($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'System',
            'user_role' => auth()->user()?->user_type ?? 'admin',
            'action' => 'Batch Created',
            'module' => 'Batches',
            'description' => "Created batch {$batch->name}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Batch created successfully.');
    }

    public function update(Request $request, $id)
    {
        $batch = Batch::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teacher_profiles,id',
            'room' => 'nullable|string|max:100',
            'image' => 'nullable',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'class_days' => 'nullable|string',
            'class_time' => 'nullable|string',
            'max_students' => 'required|integer|min:1',
            'status' => 'required|in:active,completed,upcoming,inactive',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('batches', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (is_string($request->input('image'))) {
            $validated['image'] = $request->input('image');
        }

        $batch->update($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'System',
            'user_role' => auth()->user()?->user_type ?? 'admin',
            'action' => 'Batch Updated',
            'module' => 'Batches',
            'description' => "Updated batch {$batch->name}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Batch updated successfully.');
    }

    public function destroy($id)
    {
        $batch = Batch::findOrFail($id);
        $name = $batch->name;
        $batch->delete();

        return redirect()->back()->with('success', "Batch {$name} deleted successfully.");
    }
}
