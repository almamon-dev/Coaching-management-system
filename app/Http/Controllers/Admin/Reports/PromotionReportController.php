<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Services\Reports\PromotionReportService;
use App\Http\Requests\Admin\Reports\PromotionReportRequest;
use App\Models\AcademicClass;
use Inertia\Inertia;

class PromotionReportController extends Controller
{
    protected PromotionReportService $reportService;

    public function __construct(PromotionReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(PromotionReportRequest $request)
    {
        $type = $request->input('type', 'student');

        if ($request->input('export')) {
            return $this->reportService->export($request->validated());
        }

        $data = $this->reportService->getReportData($request->validated());

        return Inertia::render('Admin/Reports/Promotions/Index', [
            'type'        => $type,
            'filters'     => $request->all(),
            'records'     => $data['records'],
            'stats'       => $data['stats'],
            'classCounts' => $data['class_counts'] ?? [],
            'classes'     => AcademicClass::orderBy('numeric_value')->get(['id', 'name']),
        ]);
    }
}
