<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DailyAttendanceExport;
use App\Exports\MonthlyAttendanceExport;

class AttendanceReportController extends Controller
{
    public function dailyReport(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $type = $request->input('type', 'student'); // 'student' or 'teacher'

        $query = Attendance::where('date', $date)
            ->with(['user' => function($q) {
                $q->select('id', 'name', 'email', 'user_type');
            }]);

        if ($type === 'student') {
            $query->whereIn('user_id', \App\Models\StudentProfile::select('user_id'));
        } else {
            $query->whereIn('user_id', \App\Models\TeacherProfile::select('user_id'));
        }

        $attendances = $query->get();

        $stats = [
            'total' => $attendances->count(),
            'present' => $attendances->where('status', 'present')->count(),
            'absent' => $attendances->where('status', 'absent')->count(),
            'late' => $attendances->where('status', 'late')->count(),
            'on_leave' => $attendances->where('status', 'on_leave')->count(),
        ];

        return Inertia::render('Admin/Attendance/Reports/DailyReport', [
            'date' => $date,
            'type' => $type,
            'stats' => $stats,
            'attendances' => $attendances,
        ]);
    }

    public function monthlyReport(Request $request)
    {
        $month = $request->input('month', Carbon::today()->format('Y-m'));
        $type = $request->input('type', 'student');

        $startDate = Carbon::parse($month . '-01')->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Get all users of specific type
        if ($type === 'student') {
            $users = User::whereIn('id', \App\Models\StudentProfile::select('user_id'))
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
        } else {
            $users = User::whereIn('id', \App\Models\TeacherProfile::select('user_id'))
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
        }

        // Get all attendances for the month
        $attendances = Attendance::whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->whereIn('user_id', $users->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $reportData = $users->map(function ($user) use ($attendances) {
            $userAttendances = $attendances->get($user->id, collect());
            
            $presentCount = $userAttendances->where('status', 'present')->count();
            $absentCount = $userAttendances->where('status', 'absent')->count();
            $lateCount = $userAttendances->where('status', 'late')->count();
            $leaveCount = $userAttendances->where('status', 'on_leave')->count();
            
            $totalDays = $presentCount + $absentCount + $lateCount + $leaveCount;
            $attendancePercentage = $totalDays > 0 ? round(($presentCount / $totalDays) * 100, 2) : 0;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'on_leave' => $leaveCount,
                'percentage' => $attendancePercentage
            ];
        });

        return Inertia::render('Admin/Attendance/Reports/MonthlyReport', [
            'month' => $month,
            'type' => $type,
            'reportData' => $reportData,
        ]);
    }

    public function analytics(Request $request)
    {
        $startDate = Carbon::today()->subDays(29);
        $endDate = Carbon::today();
        
        $type = $request->input('type', 'student');

        $query = DB::table('attendances')
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()]);

        if ($type === 'student') {
            $query->whereIn('user_id', \App\Models\StudentProfile::select('user_id'));
        } else {
            $query->whereIn('user_id', \App\Models\TeacherProfile::select('user_id'));
        }

        $stats = $query->select('date', 
                DB::raw("SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present"),
                DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent"),
                DB::raw("SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late"),
                DB::raw("SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) as on_leave")
            )
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $dateString = $date->toDateString();
            if ($stats->has($dateString)) {
                $chartData[] = $stats->get($dateString);
            } else {
                $chartData[] = [
                    'date' => $dateString,
                    'present' => 0,
                    'absent' => 0,
                    'late' => 0,
                    'on_leave' => 0,
                ];
            }
        }

        return Inertia::render('Admin/Attendance/Reports/Analytics', [
            'type' => $type,
            'stats' => $chartData,
        ]);
    }

    public function exportDaily(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $type = $request->input('type', 'student');

        $query = Attendance::where('date', $date)
            ->with(['user' => function($q) {
                $q->select('id', 'name', 'email', 'user_type');
            }]);

        if ($type === 'student') {
            $query->whereIn('user_id', \App\Models\StudentProfile::select('user_id'));
        } else {
            $query->whereIn('user_id', \App\Models\TeacherProfile::select('user_id'));
        }

        $attendances = $query->get();
        $fileName = "daily_attendance_{$type}_{$date}.xlsx";

        return Excel::download(new DailyAttendanceExport($attendances), $fileName);
    }

    public function exportMonthly(Request $request)
    {
        $month = $request->input('month', Carbon::today()->format('Y-m'));
        $type = $request->input('type', 'student');

        $startDate = Carbon::parse($month . '-01')->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        if ($type === 'student') {
            $users = User::whereIn('id', \App\Models\StudentProfile::select('user_id'))
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
        } else {
            $users = User::whereIn('id', \App\Models\TeacherProfile::select('user_id'))
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
        }

        $attendances = Attendance::whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->whereIn('user_id', $users->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $reportData = $users->map(function ($user) use ($attendances) {
            $userAttendances = $attendances->get($user->id, collect());
            
            $presentCount = $userAttendances->where('status', 'present')->count();
            $absentCount = $userAttendances->where('status', 'absent')->count();
            $lateCount = $userAttendances->where('status', 'late')->count();
            $leaveCount = $userAttendances->where('status', 'on_leave')->count();
            
            $totalDays = $presentCount + $absentCount + $lateCount + $leaveCount;
            $attendancePercentage = $totalDays > 0 ? round(($presentCount / $totalDays) * 100, 2) : 0;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'on_leave' => $leaveCount,
                'percentage' => $attendancePercentage
            ];
        });

        $fileName = "monthly_attendance_{$type}_{$month}.xlsx";

        return Excel::download(new MonthlyAttendanceExport($reportData, $month), $fileName);
    }
}
