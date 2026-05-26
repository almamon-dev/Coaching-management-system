<?php

namespace App\Http\Requests\Admin\Products;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:products,slug',
            'sku' => 'required|string|max:100|unique:products,sku',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:categories,id',
            'sub_sub_category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|in:fixed,percentage',
            'discount_value' => 'nullable|numeric|min:0',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'stock' => 'nullable|integer|min:0',
            'status' => 'nullable|integer|in:0,1,2,3,4',
            'is_featured' => 'nullable|boolean',
            'attributes' => 'nullable|array',
            'thumbnail' => 'nullable|image|max:51200',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:51200',
            'key_features' => 'nullable|array',
            'specifications' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'tags' => 'nullable|string',
            'warranty' => 'nullable|string',
        ];
    }
}
