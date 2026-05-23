<?php

declare(strict_types=1);

namespace App\Services\User\Address;

use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressService
{
    /**
     * Get all addresses for the authenticated user.
     */
    public function getUserAddresses()
    {
        return Auth::user()->addresses()
            ->latest()
            ->get();
    }

    /**
     * Store a new address.
     */
    public function store(array $data)
    {
        return Auth::user()->addresses()->create([
            'type' => $data['type'] ?? 'Home',
            'name' => $data['name'],
            'address' => $data['address'],
            'city' => $data['city'],
            'area' => $data['area'] ?? null,
            'post_code' => $data['post_code'] ?? null,
            'is_primary' => $data['is_primary'] ?? (Auth::user()->addresses()->count() === 0),
        ]);
    }

    /**
     * Update an address.
     */
    public function update(Address $address, array $data)
    {
        if ($data['is_primary'] ?? false) {
            Auth::user()->addresses()->update(['is_primary' => false]);
        }

        return $address->update([
            'type' => $data['type'] ?? $address->type,
            'name' => $data['name'] ?? $address->name,
            'address' => $data['address'] ?? $address->address,
            'city' => $data['city'] ?? $address->city,
            'area' => $data['area'] ?? $address->area,
            'post_code' => $data['post_code'] ?? $address->post_code,
            'is_primary' => $data['is_primary'] ?? $address->is_primary,
        ]);
    }

    /**
     * Delete an address.
     */
    public function delete(Address $address)
    {
        return $address->delete();
    }
}
