<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TeacherAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        
        $teachers = TeacherProfile::with('user')->get();

        $attendances = Attendance::where('date', $date)
            ->whereIn('user_id', $teachers->pluck('user_id'))
            ->get()
            ->keyBy('user_id');

        $teachersData = $teachers->map(function ($teacher) use ($attendances) {
            $attendance = $attendances->get($teacher->user_id);
            return [
                'id' => $teacher->user_id,
                'employee_id' => $teacher->employee_id,
                'name' => $teacher->user->name ?? 'Unknown',
                'email' => $teacher->user->email ?? '',
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($teacher->user->name ?? 'User') . '&background=0D8ABC&color=fff',
                'status' => $attendance ? $attendance->status : '', // Default empty so admin has to mark it
                'remarks' => $attendance ? $attendance->remarks : '',
            ];
        });

        return Inertia::render('Admin/Attendance/Teacher/Index', [
            'date' => $date,
            'teachers' => $teachersData,
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
                    'remarks' => $record['remarks'] ?? '',
                    'recorded_by' => auth()->id(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Teacher attendance saved successfully.');
    }
}
