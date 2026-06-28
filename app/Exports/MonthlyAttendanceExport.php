<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MonthlyAttendanceExport implements FromCollection, WithHeadings, WithMapping
{
    protected $reportData;
    protected $month;

    public function __construct($reportData, $month)
    {
        $this->reportData = collect($reportData);
        $this->month = $month;
    }

    public function collection()
    {
        return $this->reportData;
    }

    public function headings(): array
    {
        return [
            'Name',
            'Month',
            'Present (Days)',
            'Absent (Days)',
            'Late (Days)',
            'On Leave (Days)',
            'Attendance Percentage',
        ];
    }

    public function map($data): array
    {
        return [
            $data['name'],
            $this->month,
            $data['present'],
            $data['absent'],
            $data['late'],
            $data['on_leave'],
            $data['percentage'] . '%',
        ];
    }
}
