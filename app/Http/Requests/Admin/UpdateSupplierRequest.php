<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:suppliers,slug,' . $this->supplier->id,
            'email' => 'nullable|email|max:255|unique:suppliers,email,' . $this->supplier->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|image|max:2048',
            'status' => 'boolean',
            'brand_ids' => 'nullable|array',
            'brand_ids.*' => 'exists:brands,id',
        ];
    }
}
