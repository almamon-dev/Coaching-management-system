<?php

namespace App\Http\Requests\Admin\Reports;

use Illuminate\Foundation\Http\FormRequest;

class PromotionReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('type') || !$this->input('type')) {
            $this->merge(['type' => 'student']);
        }
    }

    public function rules(): array
    {
        return [
            'type'       => 'nullable|in:student,teacher',
            'class_id'   => 'nullable|integer|exists:academic_classes,id',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date',
            'department' => 'nullable|string',
            'export'     => 'nullable|in:pdf,excel',
        ];
    }
}
