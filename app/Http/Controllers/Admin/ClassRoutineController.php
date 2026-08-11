<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ClassRoutine;
use App\Models\Batch;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\ActivityLog;

class ClassRoutineController extends Controller
{
    public function index(Request $request)
    {
        $query = ClassRoutine::with(['batch.course', 'teacher']);

        if ($request->filled('batch_id')) {
            $query->where('batch_id', $request->batch_id);
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('class_date', $request->date);
        }

        $routines = $query->orderBy('class_date', 'asc')->orderBy('start_time', 'asc')->get();

        $batches = Batch::with('course')->where('status', 'active')->get();
        $subjects = \App\Models\Course::where('status', 'active')->get();
        $teachers = TeacherProfile::where('status', 'active')->get();

        return Inertia::render('Admin/ClassRoutines/Index', [
            'routines' => $routines,
            'batches' => $batches,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'filters' => $request->only(['batch_id', 'teacher_id', 'date']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teacher_profiles,id',
            'room' => 'nullable|string|max:100',
            'class_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'status' => 'required|in:scheduled,completed,rescheduled,cancelled',
            'notes' => 'nullable|string',
        ]);

        // Conflict check for Room
        if (!empty($validated['room'])) {
            $roomConflict = ClassRoutine::whereDate('class_date', $validated['class_date'])
                ->where('room', $validated['room'])
                ->where('status', '!=', 'cancelled')
                ->where(function($q) use ($validated) {
                    $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
                })->first();

            if ($roomConflict) {
                return redirect()->back()->withErrors([
                    'room' => "Room conflict! Room {$validated['room']} is already booked for another class at this time."
                ]);
            }
        }

        // Conflict check for Teacher
        if (!empty($validated['teacher_id'])) {
            $teacherConflict = ClassRoutine::whereDate('class_date', $validated['class_date'])
                ->where('teacher_id', $validated['teacher_id'])
                ->where('status', '!=', 'cancelled')
                ->where(function($q) use ($validated) {
                    $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
                })->first();

            if ($teacherConflict) {
                return redirect()->back()->withErrors([
                    'teacher_id' => "Teacher conflict! This teacher is already scheduled for another class at this time."
                ]);
            }
        }

        $routine = ClassRoutine::create($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Class Scheduled',
            'module' => 'Routines',
            'description' => "Scheduled class for batch #{$routine->batch_id} on {$routine->class_date}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Class routine created successfully.');
    }

    public function update(Request $request, $id)
    {
        $routine = ClassRoutine::findOrFail($id);

        $validated = $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teacher_profiles,id',
            'room' => 'nullable|string|max:100',
            'class_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'status' => 'required|in:scheduled,completed,rescheduled,cancelled',
            'notes' => 'nullable|string',
        ]);

        $routine->update($validated);

        return redirect()->back()->with('success', 'Class routine updated successfully.');
    }

    public function destroy($id)
    {
        $routine = ClassRoutine::findOrFail($id);
        $routine->delete();

        return redirect()->back()->with('success', 'Class routine deleted successfully.');
    }
}
