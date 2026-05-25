<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            BrandSeeder::class,
            CategorySeeder::class,
            GlobalVariantSeeder::class,
           ProductSeeder::class,
            // AttributePresetSeeder::class,
            // ProductSeeder::class,
            // OrderSeeder::class,
            // SupplierSeeder::class,
            // MarketingCampaignSeeder::class,
            // WarehouseSeeder::class,
            // OfferSeeder::class,
            ShippingMethodSeeder::class,
            // OrderReturnSeeder::class,
            PageSeeder::class,
            
        ]);
    }
}
