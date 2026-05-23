<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    public function run(): void
    {
        ShippingMethod::updateOrCreate(
            ['provider' => 'redx'],
            [
                'name' => 'RedX Delivery',
                'charge' => 60.00,
                'api_credentials' => [
                    'api_key' => 'redx_sandbox_key_123',
                    'client_id' => 'redx_client_id_abc',
                ],
                'is_active' => true,
            ]
        );

        ShippingMethod::updateOrCreate(
            ['provider' => 'pathao'],
            [
                'name' => 'Pathao Courier',
                'charge' => 80.00,
                'api_credentials' => [
                    'client_id' => 'pathao_client_id_456',
                    'client_secret' => 'pathao_client_secret_xyz',
                ],
                'is_active' => true,
            ]
        );

        ShippingMethod::updateOrCreate(
            ['provider' => 'steadfast'],
            [
                'name' => 'Steadfast Courier',
                'charge' => 70.00,
                'api_credentials' => [
                    'api_key' => 'steadfast_sandbox_key_789',
                    'secret_key' => 'steadfast_secret_key_def',
                ],
                'is_active' => true,
            ]
        );
    }
}
