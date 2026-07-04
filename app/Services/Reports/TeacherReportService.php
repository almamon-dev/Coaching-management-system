<?php

namespace App\Services\Reports;

use App\Models\TeacherProfile;

class TeacherReportService
{
    public function getReportData(array $filters)
    {
        $query = $this->buildQuery($filters);
        $perPage = $filters['per_page'] ?? 10;
        return $query->paginate($perPage)->withQueryString();
    }

    protected function buildQuery(array $filters)
    {
        $query = TeacherProfile::with('user');

        if (!empty($filters['designation'])) {
            $query->where('designation', $filters['designation']);
        }
        if (!empty($filters['department'])) {
            $query->where('department', $filters['department']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        return $query->orderBy('id', 'desc');
    }
}
