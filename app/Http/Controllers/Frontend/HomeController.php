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

        return Inertia::render('Frontend/Home', [
            'categories' => $categories,
            'featuredProducts' => ProductResource::collection($featuredProducts)->resolve(),
            'specialOffers' => ProductResource::collection($specialOffers)->resolve(),
        ]);
    }
}
