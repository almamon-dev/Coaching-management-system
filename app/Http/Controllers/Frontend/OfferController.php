<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class OfferController extends Controller
{
    /**
     * Get shared navigation categories and brands (cached for premium performance)
     */
    protected function getNavData()
    {
        $categories = app(\App\Caches\Admin\Category\CategoryCache::class)->getHomeCategoriesWithBrands();

        return [
            'categories' => $categories,
            'brands' => Brand::all(),
        ];
    }

    /**
     * Display a listing of the active offers.
     */
    public function index()
    {
        $offers = Offer::active()->latest()->get();
        $navData = $this->getNavData();

        return Inertia::render('Frontend/Offers/Index', array_merge($navData, [
            'offers' => $offers
        ]));
    }

    /**
     * Display the specified offer.
     */
    public function show($slug)
    {
        $offer = Offer::active()->where('slug', $slug)->firstOrFail();
        $navData = $this->getNavData();

        return Inertia::render('Frontend/Offers/Show', array_merge($navData, [
            'offer' => $offer
        ]));
    }
}
