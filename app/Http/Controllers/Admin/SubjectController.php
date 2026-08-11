<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Subject;
use App\Models\ActivityLog;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $courseQuery = Course::withCount(['batches', 'students']);

        if ($request->filled('search')) {
            $search = $request->search;
            $courseQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $courseQuery->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $courseQuery->where('status', $request->status);
        }

        $perPage = $request->input('per_page', 10);
        $courses = $courseQuery->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code',
            'category' => 'nullable|string|max:100',
            'monthly_fee' => 'required|numeric|min:0',
            'admission_fee' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'total_lectures' => 'nullable|integer|min:0',
            'total_lessons' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'syllabus_details' => 'nullable|string',
        ]);

        $validated['fee'] = $validated['monthly_fee'];
        unset($validated['monthly_fee']);

        $course = Course::create($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Course Created',
            'module' => 'Courses',
            'description' => "Created course {$course->title} ({$course->code})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->route('admin.courses.index')->with('success', 'Subject created successfully.');
    }

    public function edit($id)
    {
        $course = Course::findOrFail($id);
        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course
        ]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code,' . $id,
            'category' => 'nullable|string|max:100',
            'monthly_fee' => 'required|numeric|min:0',
            'admission_fee' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'total_lectures' => 'nullable|integer|min:0',
            'total_lessons' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'syllabus_details' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['fee'] = $validated['monthly_fee'];
        unset($validated['monthly_fee']);

        $course->update($validated);

        return redirect()->route('admin.courses.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $title = $course->title;
        $course->delete();

        return redirect()->back()->with('success', "Subject {$title} deleted successfully.");
    }
}
