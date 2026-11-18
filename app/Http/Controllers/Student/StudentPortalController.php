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
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $student = StudentProfile::with(['course', 'batch', 'guardian'])
            ->where('user_id', $user->id)
            ->first();

        if (!$student) {
            // Fallback for demo student #1
            $student = StudentProfile::with(['course', 'batch', 'guardian'])->first();
        }

        $studentId = $student ? $student->id : null;
        $batchId = $student ? $student->batch_id : null;
        $courseId = $student ? $student->course_id : null;

        // Enrolled Batches (Many-to-Many + Fallback)
        $enrolledBatches = collect();
        if ($student) {
            $enrolledBatches = $student->batches()
                ->with(['course', 'subject', 'teacher'])
                ->get();

            if ($enrolledBatches->isEmpty() && $student->batch) {
                $enrolledBatches = collect([$student->batch()->with(['course', 'subject', 'teacher'])->first()]);
            }
        }

        $enrolledBatches = $enrolledBatches->map(function ($b) {
            $course = $b->course;
            $cleanTitle = $course?->title ?: $b->name;

            // Fallback image resolution
            $image = $b->image;
            if (!$image) {
                $titleLower = strtolower($cleanTitle . ' ' . $b->name);
                if (str_contains($titleLower, 'physics')) {
                    $image = '/images/batches/batch_physics.jpg';
                } elseif (str_contains($titleLower, 'higher math') || str_contains($titleLower, 'math')) {
                    $image = '/images/batches/batch_higher_math.jpg';
                } elseif (str_contains($titleLower, 'chemistry')) {
                    $image = '/images/batches/batch_chemistry.jpg';
                } elseif (str_contains($titleLower, 'ict')) {
                    $image = '/images/batches/batch_ict.jpg';
                } elseif (str_contains($titleLower, 'class 9') || str_contains($titleLower, 'cls9')) {
                    $image = '/images/batches/batch_class9.jpg';
                } elseif (str_contains($titleLower, 'class 10') || str_contains($titleLower, 'ssc')) {
                    $image = '/images/batches/batch_class10.jpg';
                } else {
                    $image = '/images/batches/batch_revision.jpg';
                }
            }

            $b->display_image = $image;
            $b->category = $course?->category ?: 'Academic Program';
            $b->code = $course?->code ?: ($b->code ?: 'BATCH-' . $b->id);
            $b->duration = $course?->duration ?: '12 Months';
            $b->description = $course?->description ?: 'Expert-guided coaching program with comprehensive syllabus coverage and exam-focused revision.';
            return $b;
        });

        $allBatchIds = $enrolledBatches->pluck('id')->filter()->push($batchId)->unique()->values()->all();

        // Class Routines (Today & Upcoming, fallback to latest if none upcoming)
        $routines = collect();
        if (!empty($allBatchIds)) {
            $routines = ClassRoutine::with(['subject', 'teacher'])
                ->whereIn('batch_id', $allBatchIds)
                ->whereDate('class_date', '>=', date('Y-m-d'))
                ->orderBy('class_date', 'asc')
                ->take(15)
                ->get();

            if ($routines->isEmpty()) {
                $routines = ClassRoutine::with(['subject', 'teacher'])
                    ->whereIn('batch_id', $allBatchIds)
                    ->latest('class_date')
                    ->take(15)
                    ->get();
            }
        }

        // Attendance stats
        $attendances = $studentId
            ? Attendance::with('batch')->where('student_id', $studentId)->latest('date')->get()
            : collect();
        $totalClasses = $studentId ? Attendance::where('student_id', $studentId)->count() : 0;
        $presentClasses = $studentId ? Attendance::where('student_id', $studentId)->whereIn('status', ['present', 'late'])->count() : 0;
        $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100, 1) : 100;

        // Fees & Dues
        $invoices = $studentId ? FeeInvoice::with('feeType')->where('student_id', $studentId)->latest()->get() : collect();
        $payments = $studentId ? FeePayment::where('student_id', $studentId)->latest()->get() : collect();
        $totalPaid = $invoices->sum('paid_amount');
        $totalDue = $invoices->sum('due_amount');

        // Results (Only published exam results)
        $results = $studentId
            ? Result::with(['exam.course', 'exam.batch'])
                ->where('student_id', $studentId)
                ->whereHas('exam', function($q) {
                    $q->where('status', 'published');
                })
                ->latest()
                ->get()
            : collect();

        // Assignments
        $assignments = !empty($allBatchIds)
            ? Assignment::with(['subject', 'teacher', 'submissions' => function($q) use ($studentId) {
                if ($studentId) {
                    $q->where('student_id', $studentId);
                }
            }])->whereIn('batch_id', $allBatchIds)->latest()->get()
            : collect();

        // Study Materials
        $studyMaterials = StudyMaterial::with('subject')
            ->where(function($q) use ($allBatchIds, $courseId) {
                if (!empty($allBatchIds)) {
                    $q->whereIn('batch_id', $allBatchIds);
                }
                if ($courseId) {
                    $q->orWhere('course_id', $courseId);
                }
                $q->orWhereNull('batch_id');
            })
            ->latest()
            ->get();

        // Notices
        $notices = Notice::where(function($q) use ($allBatchIds, $courseId) {
            $q->where('target_role', 'all')
              ->orWhere('target_role', 'students');
            if (!empty($allBatchIds)) {
                $q->orWhereIn('batch_id', $allBatchIds);
            }
            if ($courseId) {
                $q->orWhere('course_id', $courseId);
            }
        })->latest()->take(10)->get();

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'currentTab' => $request->query('tab', 'overview'),
            'enrolledBatches' => $enrolledBatches,
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
