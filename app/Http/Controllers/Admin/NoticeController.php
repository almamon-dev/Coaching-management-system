<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Notice;
use App\Models\Course;
use App\Models\Batch;
use App\Models\ActivityLog;

class NoticeController extends Controller
{
    public function index()
    {
        $notices = Notice::with(['course', 'batch', 'creator'])->latest()->get();
        $courses = Course::where('status', 'active')->get();
        $batches = Batch::where('status', 'active')->get();

        return Inertia::render('Admin/Notices/Index', [
            'notices' => $notices,
            'courses' => $courses,
            'batches' => $batches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|string', // all, course, batch, teachers, guardians, students
            'course_id' => 'nullable|exists:courses,id',
            'batch_id' => 'nullable|exists:batches,id',
            'category' => 'required|string', // Exam, Holiday, Cancellation, Routine change, Fee reminder, Announcement
            'priority' => 'required|in:high,normal,low',
        ]);

        $notice = Notice::create([
            ...$validated,
            'published_at' => date('Y-m-d H:i:s'),
            'created_by' => auth()->id(),
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Notice Published',
            'module' => 'Notices',
            'description' => "Published notice: {$notice->title}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Notice published successfully.');
    }

    public function destroy($id)
    {
        $notice = Notice::findOrFail($id);
        $notice->delete();

        return redirect()->back()->with('success', 'Notice deleted.');
    }
}
