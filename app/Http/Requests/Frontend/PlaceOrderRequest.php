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
            'shipping_zip_code' => 'nullable|string',
            'mobile' => 'required|string',
            'email' => 'required|email',
            
            // Company & Delivery
            'company_name' => 'nullable|string',
            'vat_id' => 'nullable|string',
            'delivery_instructions' => 'nullable|string',
            
            // Billing
            'is_billing_same_as_shipping' => 'required|boolean',
            'billing_name' => 'nullable|string|required_if:is_billing_same_as_shipping,false',
            'billing_email' => 'nullable|email',
            'billing_phone' => 'nullable|string|required_if:is_billing_same_as_shipping,false',
            'billing_address' => 'nullable|string|required_if:is_billing_same_as_shipping,false',
            'billing_upazila' => 'nullable|string',
            'billing_district' => 'nullable|string|required_if:is_billing_same_as_shipping,false',
            'billing_zip_code' => 'nullable|string',
            
            'paymentMethod' => 'required|string',
            'deliveryMethod' => 'required|string',
            'comment' => 'nullable|string',
        ];
    }
}
