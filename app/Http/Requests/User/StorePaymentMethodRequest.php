<?php
 
namespace App\Http\Requests\User;
 
use Illuminate\Foundation\Http\FormRequest;
 
class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
 
    public function rules(): array
    {
        return [
            'holder' => 'required|string|max:255',
            'number' => 'required|string',
            'expiry' => 'required|string',
            'cvv' => 'required|string|size:3',
        ];
    }
 
    public function messages(): array
    {
        return [
            'holder.required' => 'Cardholder name is required.',
            'number.required' => 'Card number is required.',
            'expiry.required' => 'Expiry date is required.',
            'cvv.size' => 'CVV must be exactly 3 digits.',
        ];
    }
}
