<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\ClassRoutine;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Result;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\StudyMaterial;
use App\Models\Notice;

class StudentPortalController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $student = StudentProfile::with(['course', 'batch', 'guardian'])
            ->where('user_id', $user->id)
            ->first();

        if (!$student) {
            // Fallback for demo student #1
            $student = StudentProfile::with(['course', 'batch', 'guardian'])->first();
        }

        $batchId = $student ? $student->batch_id : null;
        $courseId = $student ? $student->course_id : null;

        // Class Routines
        $routines = ClassRoutine::with(['subject', 'teacher'])
            ->where('batch_id', $batchId)
            ->whereDate('class_date', '>=', date('Y-m-d'))
            ->orderBy('class_date', 'asc')
            ->take(10)
            ->get();

        // Attendance stats
        $attendances = Attendance::where('student_id', $student->id)->latest()->take(20)->get();
        $totalClasses = Attendance::where('student_id', $student->id)->count();
        $presentClasses = Attendance::where('student_id', $student->id)->whereIn('status', ['present', 'late'])->count();
        $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100, 1) : 100;

        // Fees & Dues
        $invoices = FeeInvoice::with('feeType')->where('student_id', $student->id)->latest()->get();
        $payments = FeePayment::where('student_id', $student->id)->latest()->get();
        $totalPaid = $invoices->sum('paid_amount');
        $totalDue = $invoices->sum('due_amount');

        // Results
        $results = Result::with('exam')->where('student_id', $student->id)->latest()->get();

        // Assignments
        $assignments = Assignment::with(['subject', 'teacher', 'submissions' => function($q) use ($student) {
            $q->where('student_id', $student->id);
        }])->where('batch_id', $batchId)->latest()->get();

        // Study Materials
        $studyMaterials = StudyMaterial::with('subject')
            ->where(function($q) use ($batchId, $courseId) {
                $q->where('batch_id', $batchId)->orWhere('course_id', $courseId)->orWhereNull('batch_id');
            })
            ->latest()
            ->get();

        // Notices
        $notices = Notice::where(function($q) use ($batchId, $courseId) {
            $q->where('target_role', 'all')
              ->orWhere('target_role', 'students')
              ->orWhere('batch_id', $batchId)
              ->orWhere('course_id', $courseId);
        })->latest()->take(10)->get();

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'routines' => $routines,
            'attendances' => $attendances,
            'attendancePercentage' => $attendancePercentage,
            'invoices' => $invoices,
            'payments' => $payments,
            'totalPaid' => $totalPaid,
            'totalDue' => $totalDue,
            'results' => $results,
            'assignments' => $assignments,
            'studyMaterials' => $studyMaterials,
            'notices' => $notices,
        ]);
    }
}
