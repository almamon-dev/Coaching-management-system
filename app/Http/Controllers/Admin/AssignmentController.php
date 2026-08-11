<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Batch;
use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\ActivityLog;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::with(['batch', 'subject', 'teacher', 'submissions'])->latest()->get();
        $batches = Batch::where('status', 'active')->get();
        $subjects = Subject::all();
        $teachers = TeacherProfile::where('status', 'active')->get();

        return Inertia::render('Admin/Assignments/Index', [
            'assignments' => $assignments,
            'batches' => $batches,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'batch_id' => 'required|exists:batches,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teacher_profiles,id',
            'description' => 'nullable|string',
            'attachment_url' => 'nullable|string',
            'due_date' => 'required|date',
            'max_marks' => 'required|numeric|min:1',
        ]);

        $assignment = Assignment::create($validated);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Assignment Created',
            'module' => 'Assignments',
            'description' => "Created assignment {$assignment->title}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Assignment created successfully.');
    }

    public function submissions($id)
    {
        $assignment = Assignment::with(['batch', 'subject', 'teacher'])->findOrFail($id);
        $submissions = AssignmentSubmission::with('student')->where('assignment_id', $id)->get();

        return Inertia::render('Admin/Assignments/Submissions', [
            'assignment' => $assignment,
            'submissions' => $submissions,
        ]);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $submission = AssignmentSubmission::findOrFail($submissionId);

        $validated = $request->validate([
            'marks_obtained' => 'required|numeric|min:0',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'marks_obtained' => $validated['marks_obtained'],
            'feedback' => $validated['feedback'],
            'status' => 'reviewed',
        ]);

        return redirect()->back()->with('success', 'Submission graded successfully.');
    }
}
