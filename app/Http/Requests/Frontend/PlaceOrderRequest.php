<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string',
            'upazila' => 'nullable|string',
            'district' => 'required|string',
            'mobile' => 'required|string',
            'email' => 'required|email',
            'paymentMethod' => 'required|string',
            'deliveryMethod' => 'required|string',
            'comment' => 'nullable|string',
        ];
    }
}
