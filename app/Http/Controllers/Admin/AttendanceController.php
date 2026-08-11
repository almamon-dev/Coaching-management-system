<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Batch;
use App\Models\StudentProfile;
use App\Models\ClassRoutine;
use App\Models\ActivityLog;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $batches = Batch::where('status', 'active')->get();
        $batchId = $request->input('batch_id') ?? $batches->first()?->id;
        $date = $request->input('date', date('Y-m-d'));

        $students = [];
        $existingAttendances = [];

        if ($batchId) {
            $students = StudentProfile::where('batch_id', $batchId)
                ->where('status', 'active')
                ->get();

            $existingAttendances = Attendance::where('batch_id', $batchId)
                ->whereDate('date', $date)
                ->pluck('status', 'student_id')
                ->toArray();
        }

        // Low Attendance Alert List (< 75%)
        $lowAttendanceStudents = StudentProfile::with(['batch', 'course'])
            ->where('status', 'active')
            ->get()
            ->map(function($st) {
                $total = Attendance::where('student_id', $st->id)->count();
                $present = Attendance::where('student_id', $st->id)->whereIn('status', ['present', 'late'])->count();
                $percentage = $total > 0 ? round(($present / $total) * 100, 1) : 100;
                $st->attendance_percentage = $percentage;
                $st->total_classes = $total;
                $st->present_classes = $present;
                return $st;
            })
            ->filter(fn($st) => $st->total_classes >= 3 && $st->attendance_percentage < 75)
            ->values();

        return Inertia::render('Admin/Attendance/Index', [
            'batches' => $batches,
            'students' => $students,
            'existingAttendances' => $existingAttendances,
            'selectedBatchId' => $batchId,
            'selectedDate' => $date,
            'lowAttendanceStudents' => $lowAttendanceStudents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'date' => 'required|date',
            'attendances' => 'required|array', // key: student_id, val: status (present, absent, late, leave)
        ]);

        foreach ($validated['attendances'] as $studentId => $status) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'batch_id' => $validated['batch_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $status,
                ]
            );
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Attendance Taken',
            'module' => 'Attendance',
            'description' => "Marked attendance for Batch #{$validated['batch_id']} on {$validated['date']}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Attendance recorded successfully.');
    }
}
