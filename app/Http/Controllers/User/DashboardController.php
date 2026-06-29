<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $academicPerformance = [];
        $latestExamName = 'No Exam Data';
        
        if ($user->user_type === 'user' || $user->user_type === 'student') {
            // Fetch the most recently published result
            $latestResult = \App\Models\Result::with(['exam'])
                ->where('student_id', $user->id)
                ->where('is_published', true)
                ->orderBy('created_at', 'desc')
                ->first();
                
            if ($latestResult) {
                $latestExamName = $latestResult->exam->name;
                
                // Fetch marks for this result
                $marks = \App\Models\Mark::with(['subject'])
                    ->where('exam_id', $latestResult->exam_id)
                    ->where('student_id', $user->id)
                    ->get();
                    
                foreach ($marks as $mark) {
                    $academicPerformance[] = [
                        'subject' => $mark->subject->name ?? 'Unknown',
                        'score' => $mark->marks,
                    ];
                }
            }
        }

        return Inertia::render('User/Dashboard/Overview', [
            'academicPerformance' => $academicPerformance,
            'latestExamName' => $latestExamName,
            'stats' => [
                'points' => $user->points ?? 0,
            ],
        ]);
    }

    public function security()
    {
        return Inertia::render('User/Dashboard/Security', [
            'two_factor_enabled' => false,
            'last_login' => [
                'date' => '2026-05-11 10:45:12',
                'device' => 'Chrome on Windows 11',
                'ip' => '103.120.45.12',
            ],
        ]);
    }

    public function notifications()
    {
        $notifications = auth()->user()->notifications()->paginate(15);
        
        return Inertia::render('User/Dashboard/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markNotificationsAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        
        // Clear cached notification data to keep it in sync instantly
        \Illuminate\Support\Facades\Cache::forget("user_notifications_" . auth()->id());
        \Illuminate\Support\Facades\Cache::forget("user_notifications_count_" . auth()->id());

        return back()->with('success', 'All notifications marked as read.');
    }
}
