<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display the specified static/dynamic page.
     */
    public function show($slug)
    {
        $page = Page::active()->where('slug', $slug)->firstOrFail();

        return Inertia::render('Frontend/Page/Show', [
            'page' => $page
        ]);
    }
}
