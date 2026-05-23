<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Brand;
use Inertia\Inertia;

class PageController extends Controller
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
     * Display the specified static/dynamic page.
     */
    public function show($slug)
    {
        $page = Page::active()->where('slug', $slug)->firstOrFail();
        $navData = $this->getNavData();

        return Inertia::render('Frontend/Page/Show', array_merge($navData, [
            'page' => $page
        ]));
    }
}
