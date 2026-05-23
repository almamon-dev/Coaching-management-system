<?php

namespace Database\Seeders;

use App\Models\MarketingCampaign;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MarketingCampaignSeeder extends Seeder
{
    public function run(): void
    {
        MarketingCampaign::truncate();
        
        // 1. Global Coupon
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Welcome Mega Discount',
            'code' => 'WELCOME500',
            'discount_type' => 'fixed',
            'discount_value' => 500,
            'min_purchase' => 2000,
            'expires_at' => Carbon::now()->addMonths(3),
            'usage_limit' => 100,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 2. Category Specific Coupon (Laptops)
        $laptopCategory = Category::where('name', 'Laptop')->first();
        if ($laptopCategory) {
            MarketingCampaign::create([
                'type' => 'coupon',
                'title' => 'Laptop Mania 10%',
                'code' => 'LAPTOP10',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'min_purchase' => 10000,
                'expires_at' => Carbon::now()->addMonth(),
                'usage_limit' => 50,
                'status' => 1,
                'applies_to' => 'category',
                'target_ids' => [$laptopCategory->id]
            ]);
        }

        // 3. Product Specific Coupon
        $product = Product::first();
        if ($product) {
            MarketingCampaign::create([
                'type' => 'coupon',
                'title' => 'Flash Sale Special',
                'code' => 'FLASH50',
                'discount_type' => 'fixed',
                'discount_value' => 50,
                'min_purchase' => 500,
                'expires_at' => Carbon::now()->addDays(7),
                'usage_limit' => 20,
                'status' => 1,
                'applies_to' => 'product',
                'target_ids' => [$product->id]
            ]);
        }

        // 4. Inactive Coupon
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Expired Summer Sale',
            'code' => 'SUMMER20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'min_purchase' => 1000,
            'expires_at' => Carbon::now()->subDays(10),
            'usage_limit' => 50,
            'used_count' => 50,
            'status' => 0,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 5. High Usage Coupon
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Flash Monday 200',
            'code' => 'MONDAY200',
            'discount_type' => 'fixed',
            'discount_value' => 200,
            'min_purchase' => 1000,
            'expires_at' => Carbon::now()->addDays(1),
            'usage_limit' => 500,
            'used_count' => 485,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 6. New Year Promo
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Happy New Year 2025',
            'code' => 'HNY2025',
            'discount_type' => 'percentage',
            'discount_value' => 25,
            'min_purchase' => 5000,
            'expires_at' => Carbon::now()->addYear(),
            'usage_limit' => 1000,
            'used_count' => 120,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 7. Component Special
        $compCat = Category::where('name', 'Component')->first();
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Build PC Discount',
            'code' => 'BUILDPC',
            'discount_type' => 'fixed',
            'discount_value' => 1000,
            'min_purchase' => 50000,
            'expires_at' => Carbon::now()->addMonths(6),
            'usage_limit' => 30,
            'used_count' => 5,
            'status' => 1,
            'applies_to' => 'category',
            'target_ids' => [$compCat->id ?? 0]
        ]);

        // 8. Limited Time Flash
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Midnight Magic',
            'code' => 'MIDNIGHT',
            'discount_type' => 'percentage',
            'discount_value' => 5,
            'min_purchase' => 100,
            'expires_at' => Carbon::now()->addHours(12),
            'usage_limit' => 100,
            'used_count' => 98,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 9. Inactive Partner Coupon
        MarketingCampaign::create([
            'type' => 'coupon',
            'title' => 'Bogo Partner Offer',
            'code' => 'BOGO50',
            'discount_type' => 'percentage',
            'discount_value' => 50,
            'min_purchase' => 2000,
            'expires_at' => Carbon::now()->addMonths(2),
            'usage_limit' => 200,
            'used_count' => 0,
            'status' => 0,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        // 10. Brochures
        MarketingCampaign::create([
            'type' => 'brochure',
            'title' => 'Main Product Catalog 2024',
            'file_path' => 'brochures/catalog_2024.pdf',
            'thumbnail' => 'https://www.startech.com.bd/image/cache/catalog/offer/free-delivery-offer-june-500x500.webp',
            'download_count' => 150,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        MarketingCampaign::create([
            'type' => 'brochure',
            'title' => 'Ramadan Special Offers',
            'file_path' => 'brochures/ramadan_deals.pdf',
            'thumbnail' => 'https://www.startech.com.bd/image/cache/catalog/offer/eid-pc-offer-2024-500x500.webp',
            'download_count' => 85,
            'status' => 1,
            'applies_to' => 'all',
            'target_ids' => []
        ]);

        MarketingCampaign::create([
            'type' => 'brochure',
            'title' => 'Gaming PC Setup Guide',
            'file_path' => 'brochures/gaming_guide.pdf',
            'thumbnail' => 'https://www.startech.com.bd/image/cache/catalog/offer/component-offer-may-500x500.webp',
            'download_count' => 320,
            'status' => 0,
            'applies_to' => 'all',
            'target_ids' => []
        ]);
    }
}
