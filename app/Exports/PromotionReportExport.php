<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class PromotionReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;
    protected $type;

    public function __construct(Collection $data, string $type)
    {
        $this->data = $data;
        $this->type = $type;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        if ($this->type === 'teacher') {
            return [
                'Teacher Name',
                'Employee ID',
                'Previous Designation',
                'New Designation',
                'Previous Department',
                'New Department',
                'Promotion Date',
                'Note',
            ];
        }

        return [
            'Student Name',
            'Student ID',
            'Previous Session',
            'Previous Class',
            'Previous Section',
            'Promoted Date',
        ];
    }

    public function map($row): array
    {
        if ($this->type === 'teacher') {
            return [
                $row->teacherProfile->user->name ?? 'N/A',
                $row->teacherProfile->employee_id ?? 'N/A',
                $row->previous_designation ?? 'N/A',
                $row->new_designation ?? 'N/A',
                $row->previous_department ?? 'N/A',
                $row->new_department ?? 'N/A',
                $row->promotion_date ? $row->promotion_date->format('Y-m-d') : 'N/A',
                $row->note ?? 'N/A',
            ];
        }

        return [
            $row->studentProfile->user->name ?? 'N/A',
            $row->studentProfile->student_id ?? 'N/A',
            $row->academicSession->name ?? 'N/A',
            $row->academicClass->name ?? 'N/A',
            $row->section->name ?? 'N/A',
            $row->updated_at ? $row->updated_at->format('Y-m-d') : 'N/A',
        ];
    }
}
