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
        $batches = Batch::with(['course', 'teacher'])->where('status', 'active')->get();
        $batchId = $request->input('batch_id') ?? $batches->first()?->id;
        $date = $request->input('date', date('Y-m-d'));

        $students = [];
        $existingAttendances = [];
        $existingRemarks = [];
        $isAttendanceTaken = false;

        if ($batchId) {
            $students = StudentProfile::where(function($q) use ($batchId) {
                $q->whereHas('batches', function($b) use ($batchId) {
                    $b->where('batches.id', $batchId);
                })->orWhere('batch_id', $batchId);
            })
            ->where('status', 'active')
            ->get();

            $attendancesQuery = Attendance::where('batch_id', $batchId)
                ->whereDate('date', $date)
                ->get();

            $isAttendanceTaken = $attendancesQuery->isNotEmpty();
            $existingAttendances = $attendancesQuery->pluck('status', 'student_id')->toArray();
            $existingRemarks = $attendancesQuery->pluck('remark', 'student_id')->toArray();
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
            'existingRemarks' => $existingRemarks,
            'isAttendanceTaken' => $isAttendanceTaken,
            'selectedBatchId' => $batchId,
            'selectedDate' => $date,
            'lowAttendanceStudents' => $lowAttendanceStudents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'date' => 'required|date|before_or_equal:today',
            'attendances' => 'required|array', // key: student_id, val: status (present, absent, late, leave)
            'remarks' => 'nullable|array',
        ]);

        foreach ($validated['attendances'] as $studentId => $status) {
            $normStatus = ($status === 'on_leave') ? 'leave' : $status;
            $remark = $request->input("remarks.{$studentId}") ?? null;

            Attendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'batch_id' => $validated['batch_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $normStatus,
                    'remark' => $remark,
                ]
            );
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Attendance Recorded',
            'module' => 'Attendance',
            'description' => "Recorded/Updated attendance for Batch #{$validated['batch_id']} on {$validated['date']}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->route('admin.attendance.index', [
            'batch_id' => $validated['batch_id'],
            'date' => $validated['date'],
        ])->with('success', 'Attendance recorded/updated successfully for ' . date('d M, Y', strtotime($validated['date'])));
    }
}
