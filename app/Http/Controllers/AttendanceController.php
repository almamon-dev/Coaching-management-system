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
        $attendances = Attendance::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->paginate(30);
            
        return Inertia::render('User/Dashboard/Attendance', [
            'attendances' => $attendances
        ]);
    }
}
