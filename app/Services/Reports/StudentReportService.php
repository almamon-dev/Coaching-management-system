<?php

namespace App\Services\Reports;

use App\Models\Enrollment;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StudentReportExport;
use Barryvdh\DomPDF\Facade\Pdf;

class StudentReportService
{
    public function getReportData(array $filters)
    {
        $query = $this->buildQuery($filters);
        $perPage = $filters['per_page'] ?? 10;
        return $query->paginate($perPage)->withQueryString();
    }

    public function export(array $filters)
    {
        $data = $this->buildQuery($filters)->get();
        $format = $filters['export'] ?? 'excel';
        
        $filename = "student_report_" . date('Y-m-d');

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.students', ['data' => $data]);
            return $pdf->download($filename . '.pdf');
        }

        return Excel::download(new StudentReportExport($data), $filename . '.xlsx');
    }

    protected function buildQuery(array $filters)
    {
        $query = Enrollment::with(['studentProfile.user', 'academicClass', 'section', 'academicSession']);

        if (!empty($filters['academic_session_id'])) {
            $query->where('academic_session_id', $filters['academic_session_id']);
        }

        if (!empty($filters['academic_class_id'])) {
            $query->where('academic_class_id', $filters['academic_class_id']);
        }

        if (!empty($filters['section_id'])) {
            $query->where('section_id', $filters['section_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->where('status', 'active');
        }

        if (!empty($filters['search']) || !empty($filters['gender']) || !empty($filters['blood_group'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters) {
                if (!empty($filters['gender'])) {
                    $q->where('gender', $filters['gender']);
                }
                
                if (!empty($filters['blood_group'])) {
                    $q->where('blood_group', $filters['blood_group']);
                }
                
                if (!empty($filters['search'])) {
                    $search = $filters['search'];
                    $q->where('student_id', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($uq) use ($search) {
                          $uq->where('name', 'like', "%{$search}%")
                             ->orWhere('phone', 'like', "%{$search}%");
                      });
                }
            });
        }

        return $query->orderBy('id', 'desc');
    }
}
