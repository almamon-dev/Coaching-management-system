<?php

declare(strict_types=1);

namespace App\Services\User\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Auth;

class PaymentMethodService
{
    /**
     * Get all payment methods for the authenticated user.
     */
    public function getUserPaymentMethods()
    {
        return Auth::user()->paymentMethods()
            ->latest()
            ->get();
    }

    /**
     * Store a new payment method.
     */
    public function store(array $data)
    {
        $cleanNumber = str_replace(' ', '', $data['number']);
        
        // Detect card type
        $type = str_starts_with($cleanNumber, '4') ? 'Visa' : 'MasterCard';

        return Auth::user()->paymentMethods()->create([
            'card_holder' => $data['holder'],
            'card_number' => $cleanNumber,
            'expiry_date' => $data['expiry'],
            'card_type' => $type,
            'is_default' => Auth::user()->paymentMethods()->count() === 0,
        ]);
    }
}
