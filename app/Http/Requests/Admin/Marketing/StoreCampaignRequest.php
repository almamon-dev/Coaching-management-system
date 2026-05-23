<?php

namespace App\Http\Requests\Admin\Marketing;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:coupon,brochure',
            'title' => 'required|string|max:200',
            'status' => 'nullable|boolean',
            'applies_to' => 'required|in:all,category,product',
            'target_ids' => 'nullable|array',
            'target_ids.*' => 'integer',
            
            // Rules for Coupons
            'code' => 'required_if:type,coupon|nullable|string|max:100|unique:marketing_campaigns,code',
            'discount_type' => 'required_if:type,coupon|nullable|in:fixed,percentage',
            'discount_value' => 'required_if:type,coupon|nullable|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date|after:now',
            'usage_limit' => 'nullable|integer|min:1',
            
            // Rules for Brochures
            'file' => 'required_if:type,brochure|nullable|file|mimes:pdf,jpg,png,jpeg|max:10240',
            'thumbnail_file' => 'nullable|image|max:2048',
        ];
    }
}
