<?php

namespace App\Services\Reports;

use App\Models\TeacherPromotion;
use App\Models\Enrollment;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PromotionReportExport;
use Barryvdh\DomPDF\Facade\Pdf;

class PromotionReportService
{
    public function getReportData(array $filters)
    {
        $type = $filters['type'] ?? 'student';
        
        if ($type === 'teacher') {
            return $this->getTeacherPromotions($filters);
        }
        
        return $this->getStudentPromotions($filters);
    }

    protected function getTeacherPromotions(array $filters)
    {
        $query = TeacherPromotion::with(['teacherProfile.user']);

        if (!empty($filters['start_date'])) {
            $query->whereDate('promotion_date', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('promotion_date', '<=', $filters['end_date']);
        }

        $data = $query->orderBy('promotion_date', 'desc')->paginate(10)->withQueryString();

        return [
            'records' => $data,
            'stats'   => ['total' => $data->total()],
        ];
    }

    protected function getStudentPromotions(array $filters)
    {
        $query = Enrollment::with(['studentProfile.user', 'academicClass', 'section', 'academicSession'])
            ->where('status', 'promoted');

        if (!empty($filters['class_id'])) {
            $query->where('academic_class_id', $filters['class_id']);
        }
        if (!empty($filters['start_date'])) {
            $query->whereDate('updated_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('updated_at', '<=', $filters['end_date']);
        }

        $data = $query->orderBy('updated_at', 'desc')->paginate(10)->withQueryString();

        // Stats per class
        $classCounts = Enrollment::selectRaw('academic_class_id, count(*) as total')
            ->with('academicClass')
            ->where('status', 'promoted')
            ->groupBy('academic_class_id')
            ->get()
            ->map(fn($r) => [
                'class' => $r->academicClass->name ?? '-',
                'total' => $r->total,
            ]);

        return [
            'records'      => $data,
            'stats'        => ['total' => $data->total()],
            'class_counts' => $classCounts,
        ];
    }

    public function export(array $filters)
    {
        $type = $filters['type'] ?? 'student';
        $format = $filters['export'] ?? 'excel';
        
        $data = $type === 'teacher' 
            ? $this->getTeacherPromotionsForExport($filters) 
            : $this->getStudentPromotionsForExport($filters);

        $filename = "{$type}_promotions_report_" . date('Y-m-d');

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.promotions', ['data' => $data, 'type' => $type]);
            return $pdf->download($filename . '.pdf');
        }

        return Excel::download(new PromotionReportExport($data, $type), $filename . '.xlsx');
    }

    protected function getTeacherPromotionsForExport(array $filters)
    {
        $query = TeacherPromotion::with(['teacherProfile.user']);

        if (!empty($filters['start_date'])) {
            $query->whereDate('promotion_date', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('promotion_date', '<=', $filters['end_date']);
        }

        return $query->orderBy('promotion_date', 'desc')->get();
    }

    protected function getStudentPromotionsForExport(array $filters)
    {
        $query = Enrollment::with(['studentProfile.user', 'academicClass', 'section', 'academicSession'])
            ->where('status', 'promoted');

        if (!empty($filters['start_date'])) {
            $query->whereDate('updated_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('updated_at', '<=', $filters['end_date']);
        }

        return $query->orderBy('updated_at', 'desc')->get();
    }
}
