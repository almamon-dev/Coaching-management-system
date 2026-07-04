<?php

namespace App\Http\Requests\Admin\Reports;

use Illuminate\Foundation\Http\FormRequest;

class TeacherReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designation' => 'nullable|string',
            'department' => 'nullable|string',
            'search' => 'nullable|string',
            'export' => 'nullable|in:pdf,excel',
        ];
    }
}
