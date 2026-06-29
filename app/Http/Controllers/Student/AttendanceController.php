<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function myAttendance(Request $request)
    {
        $user = auth()->user();
        
        $currentMonth = $request->input('month', Carbon::now()->month);
        $currentYear = $request->input('year', Carbon::now()->year);

        $attendances = Attendance::where('user_id', $user->id)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->orderBy('date', 'desc')
            ->get();
            
        $stats = [
            'total_present' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'present')->count(),
            'total_absent' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'absent')->count(),
            'total_late' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'late')->count(),
            'total_leave' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->whereIn('status', ['on_leave', 'half_day'])->count(),
        ];
            
        return Inertia::render('Student/Dashboard/Attendance', [
            'attendances' => $attendances,
            'stats' => $stats,
            'filters' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear,
            ]
        ]);
    }
}
