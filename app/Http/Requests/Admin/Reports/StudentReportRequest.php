<?php

namespace App\Http\Requests\Admin\Reports;

use Illuminate\Foundation\Http\FormRequest;

class StudentReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_session_id' => 'nullable|exists:academic_sessions,id',
            'academic_class_id' => 'nullable|exists:academic_classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'status' => 'nullable|string|in:active,promoted,transferred,dropped',
            'gender' => 'nullable|string|in:male,female,other',
            'blood_group' => 'nullable|string',
            'search' => 'nullable|string',
            'export' => 'nullable|in:pdf,excel',
        ];
    }
}
