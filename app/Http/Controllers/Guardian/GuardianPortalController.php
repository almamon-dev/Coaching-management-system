<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\GuardianProfile;
use App\Models\StudentProfile;
use App\Models\ClassRoutine;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Result;
use App\Models\Assignment;
use App\Models\Notice;

class GuardianPortalController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $guardian = GuardianProfile::where('user_id', $user->id)->first();

        if (!$guardian) {
            // Fallback for demo guardian
            $guardian = GuardianProfile::first();
        }

        $children = StudentProfile::with(['course', 'batch'])
            ->where('guardian_id', $guardian ? $guardian->id : 0)
            ->orWhere('guardian_phone', $user ? $user->phone : '')
            ->get();

        // Selected child ID (default to first child)
        $selectedChildId = $request->input('child_id', $children->first() ? $children->first()->id : null);
        $selectedChild = $children->firstWhere('id', $selectedChildId) ?? $children->first();

        $routines = [];
        $attendances = [];
        $attendancePercentage = 100;
        $invoices = [];
        $payments = [];
        $results = [];
        $assignments = [];
        $notices = [];

        if ($selectedChild) {
            $batchId = $selectedChild->batch_id;
            $courseId = $selectedChild->course_id;

            $routines = ClassRoutine::with(['subject', 'teacher'])
                ->where('batch_id', $batchId)
                ->whereDate('class_date', '>=', date('Y-m-d'))
                ->orderBy('class_date', 'asc')
                ->take(10)
                ->get();

            $attendances = Attendance::where('student_id', $selectedChild->id)->latest()->take(20)->get();
            $totalClasses = Attendance::where('student_id', $selectedChild->id)->count();
            $presentClasses = Attendance::where('student_id', $selectedChild->id)->whereIn('status', ['present', 'late'])->count();
            $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100, 1) : 100;

            $invoices = FeeInvoice::with('feeType')->where('student_id', $selectedChild->id)->latest()->get();
            $payments = FeePayment::where('student_id', $selectedChild->id)->latest()->get();

            $results = Result::with('exam')->where('student_id', $selectedChild->id)->latest()->get();

            $assignments = Assignment::with(['subject', 'teacher'])->where('batch_id', $batchId)->latest()->get();

            $notices = Notice::where(function($q) use ($batchId, $courseId) {
                $q->where('target_role', 'all')
                  ->orWhere('target_role', 'guardians')
                  ->orWhere('batch_id', $batchId)
                  ->orWhere('course_id', $courseId);
            })->latest()->take(10)->get();
        }

        return Inertia::render('Guardian/Dashboard', [
            'guardian' => $guardian,
            'children' => $children,
            'selectedChild' => $selectedChild,
            'routines' => $routines,
            'attendances' => $attendances,
            'attendancePercentage' => $attendancePercentage,
            'invoices' => $invoices,
            'payments' => $payments,
            'results' => $results,
            'assignments' => $assignments,
            'notices' => $notices,
        ]);
    }
}
