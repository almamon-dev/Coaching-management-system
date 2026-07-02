<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\AcademicClass;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceReportController extends Controller
{
    public function index(Request $request)
    {
        $date     = $request->input('date', date('Y-m-d'));
        $classId  = $request->input('class_id');
        $userType = $request->input('user_type', 'student'); // 'student' | 'teacher'

        // Recent absentees / late — filtered by user_type
        $absenteesQuery = Attendance::whereDate('date', $date)
            ->whereIn('status', ['absent', 'late'])
            ->orderByDesc('date');

        if ($userType === 'teacher') {
            $absenteesQuery->with(['user.teacherProfile'])
                ->whereHas('user.teacherProfile');
        } else {
            $absenteesQuery->with(['user.studentProfile.latestEnrollment.academicClass', 'user.studentProfile.latestEnrollment.section'])
                ->whereHas('user.studentProfile')
                ->when($classId, fn($q) => $q->whereHas('user.studentProfile.latestEnrollment', fn($q2) => $q2->where('academic_class_id', $classId)));
        }

        $recentAbsentees = $absenteesQuery->paginate(10)->withQueryString();

        // Stats (all users for the date)
        $statsQuery = Attendance::whereDate('date', $date);
        if ($classId && $userType === 'student') {
            $statsQuery->whereHas('user.studentProfile.latestEnrollment', fn($q) => $q->where('academic_class_id', $classId));
        }
        $attendances = $statsQuery->get();

        $total = $attendances->count();
        $stats = [
            'total'              => $total,
            'present'            => $attendances->where('status', 'present')->count(),
            'absent'             => $attendances->where('status', 'absent')->count(),
            'late'               => $attendances->where('status', 'late')->count(),
            'leave'              => $attendances->where('status', 'on_leave')->count(),
            'present_percentage' => $total > 0 ? round(($attendances->where('status', 'present')->count() / $total) * 100, 1) : 0,
        ];

        // Monthly trends
        $monthlyQuery = Attendance::select(DB::raw('DATE(date) as date'), 'status', DB::raw('count(*) as total'))
            ->whereMonth('date', Carbon::parse($date)->month)
            ->whereYear('date',  Carbon::parse($date)->year);

        if ($classId && $userType === 'student') {
            $monthlyQuery->whereHas('user.studentProfile.latestEnrollment', fn($q) => $q->where('academic_class_id', $classId));
        }

        $monthlyData = $monthlyQuery->groupBy('date', 'status')->get()->groupBy('date');

        $trendData = [];
        foreach ($monthlyData as $d => $statuses) {
            $trendData[] = [
                'date'    => Carbon::parse($d)->format('M d'),
                'present' => $statuses->where('status', 'present')->sum('total'),
                'absent'  => $statuses->where('status', 'absent')->sum('total'),
                'late'    => $statuses->where('status', 'late')->sum('total'),
            ];
        }

        return Inertia::render('Admin/Reports/Attendance/Index', [
            'stats'           => $stats,
            'trendData'       => array_values($trendData),
            'recentAbsentees' => $recentAbsentees,
            'classes'         => AcademicClass::orderBy('numeric_value')->get(),
            'filters'         => $request->only('date', 'class_id', 'user_type'),
        ]);
    }
}
