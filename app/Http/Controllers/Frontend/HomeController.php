<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = app(\App\Caches\Admin\Category\CategoryCache::class)->getHomeCategoriesWithBrands();

        // Cache featured products for 5 minutes
        $featuredProducts = Cache::remember('home_featured_products', 300, function () {
            $featured = Product::active()
                ->select(['id', 'name', 'slug', 'price', 'discount_price', 'discount_end_date', 'brand_id', 'is_featured'])
                ->with(['primaryImage:id,product_id,image', 'brand:id,name,slug'])
                ->where('is_featured', 1)
                ->latest()
                ->take(15)
                ->get();

            // Fallback to latest products if not enough featured
            if ($featured->count() < 4) {
                $featured = Product::active()
                    ->select(['id', 'name', 'slug', 'price', 'discount_price', 'discount_end_date', 'brand_id'])
                    ->with(['primaryImage:id,product_id,image', 'brand:id,name,slug'])
                    ->latest()
                    ->take(15)
                    ->get();
            }

            return $featured;
        });

        // Cache special offers for 5 minutes
        $specialOffers = Cache::remember('home_special_offers', 300, function () {
            return Product::active()
                ->select(['id', 'name', 'slug', 'price', 'discount_price', 'discount_end_date', 'brand_id'])
                ->with(['primaryImage:id,product_id,image', 'brand:id,name,slug'])
                ->whereNotNull('discount_price')
                ->where('discount_price', '>', 0)
                ->latest()
                ->take(10)
                ->get();
        });

        // Static Notices for now (to be made dynamic later)
        $notices = [
            [
                'id' => 1,
                'title' => 'Admission Open for 2026 Academic Year',
                'date' => '2025-12-15',
                'description' => 'Admission process for class 6 to 9 will start from 20th December. Collect forms from the school office.',
                'is_new' => true,
            ],
            [
                'id' => 2,
                'title' => 'Winter Vacation Announcement',
                'date' => '2025-12-10',
                'description' => 'The school will remain closed from 25th December to 5th January on account of the winter vacation.',
                'is_new' => true,
            ],
            [
                'id' => 3,
                'title' => 'Annual Sports Competition 2026',
                'date' => '2025-12-05',
                'description' => 'Students interested in participating in the annual sports day are requested to submit their names to their respective class teachers.',
                'is_new' => false,
            ],
            [
                'id' => 4,
                'title' => 'Parent-Teacher Meeting for Class 10',
                'date' => '2025-11-28',
                'description' => 'A mandatory parent-teacher meeting will be held on the upcoming Saturday to discuss SSC exam preparations.',
                'is_new' => false,
            ]
        ];

        return Inertia::render('Frontend/Home', [
            'categories' => $categories,
            'featuredProducts' => ProductResource::collection($featuredProducts)->resolve(),
            'specialOffers' => ProductResource::collection($specialOffers)->resolve(),
            'notices' => $notices,
        ]);
    }
}
