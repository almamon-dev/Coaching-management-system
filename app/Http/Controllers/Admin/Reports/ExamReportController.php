<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Exam;
use App\Models\Result;
use App\Models\AcademicClass;
use Illuminate\Support\Facades\DB;

class ExamReportController extends Controller
{
    public function index(Request $request)
    {
        $examId  = $request->input('exam_id');
        $classId = $request->input('class_id');

        // Helper to build fresh filtered query each time
        $q = fn() => Result::query()
            ->when($examId,  fn($q) => $q->where('exam_id', $examId))
            ->when($classId, fn($q) => $q->where('academic_class_id', $classId));

        // Per-exam, per-class summary (paginated)
        $summary = Result::select(
                'exam_id',
                'academic_class_id',
                DB::raw('count(*) as total'),
                DB::raw('sum(case when status = "Passed" then 1 else 0 end) as passed'),
                DB::raw('sum(case when status = "Failed" then 1 else 0 end) as failed'),
                DB::raw('round(avg(total_marks), 1) as avg_marks'),
                DB::raw('round(avg(gpa), 2) as avg_gpa')
            )
            ->with(['exam', 'academicClass'])
            ->when($examId,  fn($q) => $q->where('exam_id', $examId))
            ->when($classId, fn($q) => $q->where('academic_class_id', $classId))
            ->groupBy('exam_id', 'academic_class_id')
            ->paginate(10, ['*'], 'summary_page')
            ->withQueryString();

        // GPA Distribution — fresh query each time
        $gpaDistribution = [
            ['grade' => 'A+', 'count' => $q()->where('grade', 'A+')->count()],
            ['grade' => 'A',  'count' => $q()->where('grade', 'A')->count()],
            ['grade' => 'A-', 'count' => $q()->where('grade', 'A-')->count()],
            ['grade' => 'B',  'count' => $q()->where('grade', 'B')->count()],
            ['grade' => 'C',  'count' => $q()->where('grade', 'C')->count()],
            ['grade' => 'D',  'count' => $q()->where('grade', 'D')->count()],
            ['grade' => 'F',  'count' => $q()->where('grade', 'F')->count()],
        ];

        // Class-wise pass rate
        $classPerformance = Result::select(
                'academic_class_id',
                DB::raw('count(*) as total'),
                DB::raw('sum(case when status = "Passed" then 1 else 0 end) as passed'),
                DB::raw('round(avg(gpa), 2) as avg_gpa')
            )
            ->with('academicClass')
            ->when($examId, fn($q) => $q->where('exam_id', $examId))
            ->groupBy('academic_class_id')
            ->get()
            ->map(fn($r) => [
                'class'    => $r->academicClass->name ?? '-',
                'pass_pct' => $r->total > 0 ? round(($r->passed / $r->total) * 100, 1) : 0,
                'avg_gpa'  => $r->avg_gpa,
                'total'    => $r->total,
            ]);

        // Top performers — independent query, paginated
        $topPerformers = Result::with(['student', 'academicClass', 'exam'])
            ->when($examId,  fn($q) => $q->where('exam_id', $examId))
            ->when($classId, fn($q) => $q->where('academic_class_id', $classId))
            ->orderByDesc('gpa')
            ->orderByDesc('total_marks')
            ->paginate(10)
            ->withQueryString();

        // Overall stats — fresh queries
        $total  = $q()->count();
        $passed = $q()->where('status', 'Passed')->count();
        $failed = $q()->where('status', 'Failed')->count();
        $avgGpa = round($q()->avg('gpa') ?? 0, 2);

        $overallStats = [
            'total_results' => $total,
            'passed'        => $passed,
            'failed'        => $failed,
            'pass_rate'     => $total > 0 ? round(($passed / $total) * 100, 1) : 0,
            'avg_gpa'       => $avgGpa,
        ];

        return Inertia::render('Admin/Reports/Exams/Index', [
            'summary'          => $summary,
            'gpaDistribution'  => $gpaDistribution,
            'classPerformance' => $classPerformance,
            'topPerformers'    => $topPerformers,
            'overallStats'     => $overallStats,
            'exams'            => Exam::orderByDesc('id')->get(),
            'classes'          => AcademicClass::orderBy('numeric_value')->get(),
            'filters'          => $request->only('exam_id', 'class_id'),
        ]);
    }
}
