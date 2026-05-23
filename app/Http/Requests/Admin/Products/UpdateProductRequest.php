<?php

namespace App\Http\Requests\Admin\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:products,slug,'.$this->product->id,
            'sku' => 'required|string|max:100|unique:products,sku,'.$this->product->id,
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:categories,id',
            'sub_sub_category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'emi_monthly' => 'nullable|numeric|min:0',
            'emi_duration' => 'nullable|integer|min:1',
            'stock' => 'nullable|integer|min:0',
            'status' => 'nullable|integer|in:0,1,2,3,4',
            'attributes' => 'nullable|array',
            'thumbnail' => 'nullable|image|max:51200',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:51200',
            'key_features' => 'nullable|array',
            'key_features.*' => 'nullable|string',
            'specifications' => 'nullable|array',
            'specifications.*.key' => 'nullable|string',
            'specifications.*.value' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'tags' => 'nullable|string',
            'warranty' => 'nullable|string',
        ];
    }
}
