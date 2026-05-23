<?php

namespace App\Http\Requests\Admin\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'sometimes|required|exists:products,id',
            'name' => 'sometimes|required|string|max:255',
            'value' => 'sometimes|required|string|max:255',
            'price_adjustment' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer|min:0',
        ];
    }
}
