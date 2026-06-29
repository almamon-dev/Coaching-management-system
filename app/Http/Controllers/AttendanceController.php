<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        // For now, let's fetch students for attendance marking.
        $date = $request->input('date', Carbon::today()->toDateString());
        
        // Fetch users who are students
        $students = User::whereIn('id', \App\Models\StudentProfile::select('user_id'))
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // Fetch existing attendance records for the selected date
        $attendances = Attendance::where('date', $date)
            ->whereIn('user_id', $students->pluck('id'))
            ->get()
            ->keyBy('user_id');

        // Merge student data with attendance data
        $studentsData = $students->map(function ($student) use ($attendances) {
            $attendance = $attendances->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'status' => $attendance ? $attendance->status : 'present', // Default to present
                'remarks' => $attendance ? $attendance->remarks : '',
            ];
        });

        return Inertia::render('Admin/Attendance/Student/Index', [
            'date' => $date,
            'students' => $studentsData,
            'isAttendanceTaken' => $attendances->isNotEmpty(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'attendances' => 'required|array',
            'attendances.*.id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,absent,late,half_day,on_leave',
            'attendances.*.remarks' => 'nullable|string|max:255',
        ]);

        $date = $request->input('date');
        $records = $request->input('attendances');

        foreach ($records as $record) {
            Attendance::updateOrCreate(
                [
                    'user_id' => $record['id'],
                    'date' => $date,
                ],
                [
                    'status' => $record['status'],
                    'remarks' => $record['remarks'],
                    'recorded_by' => auth()->id(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Attendance saved successfully.');
    }
    
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
            
        // Calculate stats for the selected month
        $stats = [
            'total_present' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'present')->count(),
            'total_absent' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'absent')->count(),
            'total_late' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->where('status', 'late')->count(),
            'total_leave' => Attendance::where('user_id', $user->id)->whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->whereIn('status', ['on_leave', 'half_day'])->count(),
        ];
            
        return Inertia::render('User/Dashboard/Attendance', [
            'attendances' => $attendances,
            'stats' => $stats,
            'filters' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear,
            ]
        ]);
    }
}
