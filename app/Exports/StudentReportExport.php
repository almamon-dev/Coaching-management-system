<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class StudentReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected  $data;

    public function __construct(Collection $data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Student ID',
            'Gender',
            'Blood Group',
            'Session',
            'Class',
            'Section',
            'Status',
        ];
    }

    public function map($row): array
    {
        return [
            $row->studentProfile->user->name ?? 'N/A',
            $row->studentProfile->student_id ?? 'N/A',
            ucfirst($row->studentProfile->gender ?? 'N/A'),
            $row->studentProfile->blood_group ?? 'N/A',
            $row->academicSession->name ?? 'N/A',
            $row->academicClass->name ?? 'N/A',
            $row->section->name ?? 'N/A',
            ucfirst($row->status ?? 'N/A'),
        ];
    }
}
