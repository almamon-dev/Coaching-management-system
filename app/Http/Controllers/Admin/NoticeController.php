<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notices = Notice::with('creator:id,name')->latest()->paginate(10);
        return inertia('Admin/Notices/Index', compact('notices'));
    }

    public function create()
    {
        return inertia('Admin/Notices/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:notice,announcement',
            'target_audience' => 'required|in:all,teacher,student',
            'status' => 'required|in:draft,published',
        ]);

        $validated['created_by'] = auth()->id();
        
        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $notice = Notice::create($validated);

        if ($notice->status === 'published') {
            $this->sendNotification($notice);
        }

        return redirect()->route('admin.notices.index')->with('success', 'Notice created successfully.');
    }

    public function edit(Notice $notice)
    {
        return inertia('Admin/Notices/Edit', compact('notice'));
    }

    public function update(Request $request, Notice $notice)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:notice,announcement',
            'target_audience' => 'required|in:all,teacher,student',
            'status' => 'required|in:draft,published',
        ]);

        $wasDraft = $notice->status === 'draft';
        
        if ($validated['status'] === 'published' && !$notice->published_at) {
            $validated['published_at'] = now();
        }

        $notice->update($validated);

        // If it was just published, notify users
        if ($wasDraft && $notice->status === 'published') {
            $this->sendNotification($notice);
        }

        return redirect()->route('admin.notices.index')->with('success', 'Notice updated successfully.');
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();
        return redirect()->route('admin.notices.index')->with('success', 'Notice deleted successfully.');
    }

    protected function sendNotification(Notice $notice)
    {
        // Get target users based on audience
        $query = \App\Models\User::query();
        
        if ($notice->target_audience === 'teacher') {
            $query->where('user_type', 'teacher');
        } elseif ($notice->target_audience === 'student') {
            $query->where('user_type', 'student');
        } // 'all' means all active users, or we can filter out admins if needed.

        $users = $query->get();
        \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\NewNoticeNotification($notice));
    }
}
