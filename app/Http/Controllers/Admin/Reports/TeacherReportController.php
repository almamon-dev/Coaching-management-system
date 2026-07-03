<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Admin\Reports\TeacherReportRequest;
use App\Services\Reports\TeacherReportService;
use App\Models\TeacherProfile;

class TeacherReportController extends Controller
{
    protected TeacherReportService $reportService;

    public function __construct(TeacherReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(TeacherReportRequest $request)
    {
        $data = $this->reportService->getReportData($request->validated());

        $allTeachers = TeacherProfile::with('user')->get();

        $stats = [
            'total'        => $allTeachers->count(),
            'departments'  => $allTeachers->pluck('department')->filter()->unique()->count(),
            'designations' => $allTeachers->pluck('designation')->filter()->unique()->count(),
            'male'         => $allTeachers->filter(fn($t) => $t->user && strtolower($t->user->gender) === 'male')->count(),
            'female'       => $allTeachers->filter(fn($t) => $t->user && strtolower($t->user->gender) === 'female')->count(),
        ];

        $genderData = [
            ['name' => 'Male',   'value' => $stats['male']],
            ['name' => 'Female', 'value' => $stats['female']],
        ];

        $designations = $allTeachers->pluck('designation')->filter()->unique()->values();
        $designationDistribution = [];
        foreach ($designations as $designation) {
            $designationDistribution[] = [
                'name'     => $designation,
                'teachers' => $allTeachers->where('designation', $designation)->count(),
            ];
        }

        // Class-wise student distribution
        $classes        = \App\Models\AcademicClass::orderBy('numeric_value', 'asc')->get();
        $allEnrollments = \App\Models\Enrollment::with('studentProfile')->get();
        $classDistribution = [];
        foreach ($classes as $class) {
            $classEnrollments = $allEnrollments->where('academic_class_id', $class->id);
            $count = $classEnrollments->count();
            if ($count > 0) {
                $classDistribution[] = [
                    'name'     => $class->name,
                    'students' => $count,
                    'male'     => $classEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'male')->count(),
                    'female'   => $classEnrollments->filter(fn($e) => $e->studentProfile && strtolower($e->studentProfile->gender) === 'female')->count(),
                ];
            }
        }

        return Inertia::render('Admin/Reports/Teachers/Index', [
            'filters'                 => $request->all(),
            'reportData'              => $data,
            'stats'                   => $stats,
            'genderData'              => $genderData,
            'designations'            => $designations,
            'designationDistribution' => collect($designationDistribution)->sortByDesc('teachers')->values()->toArray(),
            'classDistribution'       => $classDistribution,
            'totalStudents'           => $allEnrollments->count(),
        ]);
    }
}
