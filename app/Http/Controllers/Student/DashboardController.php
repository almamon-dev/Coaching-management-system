<?php

namespace App\Http\Controllers\Student;

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

        if ($user->user_type === 'staff' || $user->user_type === 'teacher' || $user->hasRole('staff') || $user->hasRole('teacher')) {
            $today = now()->format('l'); // e.g. "Monday"
            
            $classesToday = \App\Models\ClassRoutine::with(['academicClass', 'section', 'subject'])
                ->where('teacher_id', $user->id)
                ->where('day', $today)
                ->orderBy('start_time')
                ->get()
                ->map(function ($routine) {
                    $now = now()->format('H:i:s');
                    $status = 'UPCOMING';
                    $statusColor = 'bg-slate-100 text-slate-600';
                    
                    if ($now > $routine->end_time) {
                        $status = 'COMPLETED';
                        $statusColor = 'bg-slate-200 text-slate-600';
                    } elseif ($now >= $routine->start_time && $now <= $routine->end_time) {
                        $status = 'ONGOING';
                        $statusColor = 'bg-[#008060] text-white ring-4 ring-[#008060]/20';
                    }

                    return [
                        'time' => \Carbon\Carbon::parse($routine->start_time)->format('h:i A') . ' - ' . \Carbon\Carbon::parse($routine->end_time)->format('h:i A'),
                        'subject' => ($routine->subject->name ?? 'Unknown') . ' (' . ($routine->academicClass->name ?? '') . ' - ' . ($routine->section->name ?? '') . ')',
                        'room' => 'Room ' . ($routine->room_number ?? 'N/A'),
                        'status' => $status,
                        'statusColor' => $statusColor,
                    ];
                });

            return Inertia::render('Teacher/Dashboard/TeacherOverview', [
                'schedule' => $classesToday,
                'stats' => [
                    'classes_today' => $classesToday->count(),
                    'total_classes' => \App\Models\ClassRoutine::where('teacher_id', $user->id)->count(),
                    'pending_tasks' => 2,
                ],
                'notices' => [
                    ['title' => 'Submit Term 1 Result Sheets', 'time' => '1 day ago'],
                    ['title' => 'Monthly Staff Meeting', 'time' => '3 days ago'],
                ]
            ]);
        }

        return Inertia::render('Student/Dashboard/Overview', [
            'academicPerformance' => $academicPerformance,
            'latestExamName' => $latestExamName,
            'stats' => [
                'points' => $user->points ?? 0,
            ],
        ]);
    }

    public function security()
    {
        return Inertia::render('Student/Dashboard/Security', [
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
        
        return Inertia::render('Student/Dashboard/Notifications', [
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
