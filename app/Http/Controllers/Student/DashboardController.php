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
            $today = now()->format('l'); 
            
            $weeklyRoutine = \App\Models\ClassRoutine::with(['academicClass', 'section', 'subject'])
                ->where('teacher_id', $user->id)
                ->orderByRaw("FIELD(day, 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')")
                ->orderBy('start_time')
                ->get()
                ->groupBy('day')
                ->map(function ($routines, $day) use ($today) {
                    return $routines->map(function ($routine) use ($day, $today) {
                        $now = now()->format('H:i:s');
                        $status = 'UPCOMING';
                        $statusColor = 'bg-slate-100 text-slate-600';
                        
                        if ($day !== $today) {
                            $status = 'SCHEDULED';
                            $statusColor = 'bg-slate-100 text-slate-500';
                        } else {
                            if ($now > $routine->end_time) {
                                $status = 'COMPLETED';
                                $statusColor = 'bg-slate-300 text-slate-700';
                            } elseif ($now >= $routine->start_time && $now <= $routine->end_time) {
                                $status = 'ONGOING';
                                $statusColor = 'bg-[#008060] text-white ring-2 ring-[#008060]/20';
                            }
                        }

                        return [
                            'id' => $routine->id,
                            'code' => $routine->subject->code ?? 'N/A',
                            'time' => \Carbon\Carbon::parse($routine->start_time)->format('h:i A') . ' - ' . \Carbon\Carbon::parse($routine->end_time)->format('h:i A'),
                            'subject' => $routine->subject->name ?? 'Unknown',
                            'class_sec' => ($routine->academicClass->name ?? '') . ' - ' . ($routine->section->name ?? ''),
                            'room' => 'Room ' . ($routine->room_number ?? 'N/A'),
                            'day' => $day,
                            'status' => $status,
                            'statusColor' => $statusColor,
                        ];
                    });
                });

            $currentMonth = request('month', now()->month);
            $currentYear = request('year', now()->year);

            $attendances = \App\Models\Attendance::where('user_id', $user->id)
                ->whereMonth('date', $currentMonth)
                ->whereYear('date', $currentYear)
                ->get();
                
            $attendanceStats = [
                'total_present' => $attendances->where('status', 'present')->count(),
                'total_absent' => $attendances->where('status', 'absent')->count(),
                'total_late' => $attendances->where('status', 'late')->count(),
                'total_leave' => $attendances->whereIn('status', ['on_leave', 'half_day'])->count(),
            ];

            $upcomingExams = \App\Models\Exam::where('status', 'upcoming')
                ->orderBy('start_date', 'asc')
                ->take(3)
                ->get()
                ->map(function ($exam) {
                    return [
                        'title' => $exam->name,
                        'date' => \Carbon\Carbon::parse($exam->start_date)->format('M d, Y'),
                    ];
                });

            return Inertia::render('Teacher/Dashboard/TeacherOverview', [
                'weeklyRoutine' => $weeklyRoutine,
                'today' => $today,
                'stats' => [
                    'classes_today' => collect($weeklyRoutine->get($today, []))->count(),
                    'total_classes' => \App\Models\ClassRoutine::where('teacher_id', $user->id)->count(),
                    'pending_tasks' => 3, // Mock pending tasks: Attendance, Marks, Assignment
                ],
                'upcomingExams' => $upcomingExams,
                'notices' => [
                    ['title' => 'Submit Term 1 Result Sheets', 'time' => '1 day ago'],
                    ['title' => 'Monthly Staff Meeting', 'time' => '3 days ago'],
                ],
                'attendances' => $attendances,
                'attendanceStats' => $attendanceStats,
                'filters' => ['month' => (int) $currentMonth, 'year' => (int) $currentYear]
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
