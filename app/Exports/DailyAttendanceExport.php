<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DailyAttendanceExport implements FromCollection, WithHeadings, WithMapping
{
    protected $attendances;

    public function __construct($attendances)
    {
        $this->attendances = $attendances;
    }

    public function collection()
    {
        return $this->attendances;
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Role',
            'Date',
            'Status',
            'Remarks',
        ];
    }

    public function map($attendance): array
    {
        return [
            $attendance->user->name ?? 'Unknown',
            $attendance->user->email ?? 'N/A',
            ucfirst($attendance->user->user_type ?? 'Unknown'),
            $attendance->date,
            ucfirst(str_replace('_', ' ', $attendance->status)),
            $attendance->remarks ?? '-',
        ];
    }
}
