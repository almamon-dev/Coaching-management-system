<?php
 
namespace App\Http\Resources\User;
 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
 
class PaymentMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->card_type,
            'number' => '**** **** **** ' . substr($this->card_number, -4),
            'expiry' => $this->expiry_date,
            'holder' => $this->card_holder,
            'is_default' => (bool) $this->is_default,
        ];
    }
}
