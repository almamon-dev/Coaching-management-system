<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use App\Models\AcademicClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Admin\Reports\StudentReportRequest;
use App\Services\Reports\StudentReportService;

class StudentReportController extends Controller
{
    protected StudentReportService $reportService;

    public function __construct(StudentReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(StudentReportRequest $request)
    {
        if ($request->input('export')) {
            return $this->reportService->export($request->validated());
        }

        $data = $this->reportService->getReportData($request->validated());
        
        // Calculate Statistics for Graphical Report
        $allEnrollments = \App\Models\Enrollment::with('studentProfile')->get();
        
        $stats = [
            'total' => $allEnrollments->count(),
            'active' => $allEnrollments->where('status', 'active')->count(),
            'promoted' => $allEnrollments->where('status', 'promoted')->count(),
            'transferred' => $allEnrollments->where('status', 'transferred')->count(),
            'dropped' => $allEnrollments->where('status', 'dropped')->count(),
        ];
        
        $genderData = [
            ['name' => 'Male', 'value' => $allEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'male')->count()],
            ['name' => 'Female', 'value' => $allEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'female')->count()],
        ];

        // Class-wise distribution
        $classes = AcademicClass::orderBy('numeric_value', 'asc')->get();
        $classDistribution = [];
        foreach ($classes as $class) {
            $classEnrollments = $allEnrollments->where('academic_class_id', $class->id);
            $classDistribution[] = [
                'name'     => $class->name,
                'students' => $classEnrollments->count(),
                'male'     => $classEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'male')->count(),
                'female'   => $classEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'female')->count(),
            ];
        }

        return Inertia::render('Admin/Reports/Students/Index', [
            'filters' => $request->all(),
            'reportData' => $data,
            'sessions' => AcademicSession::orderBy('start_date', 'desc')->get(),
            'classes' => $classes,
            'sections' => Section::orderBy('name', 'asc')->get(),
            'stats' => $stats,
            'genderData' => $genderData,
            'classDistribution' => $classDistribution,
        ]);
    }
}
