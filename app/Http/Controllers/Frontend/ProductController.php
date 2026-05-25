<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\Frontend\ProductService;
use App\Support\Formatters\SlugFormatter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Entry point for clean URLs
     */
    public function handleSlug(Request $request, $slug)
    {
        $lastPart = SlugFormatter::getLastSlugSegment($slug);
        $segments = explode('/', $slug);
        $categoryPath = count($segments) > 1 ? implode('/', array_slice($segments, 0, -1)) : null;

        if ($category = Category::where('slug', $lastPart)->first()) {
            return $this->category($request, $category);
        }

        if ($brand = Brand::where('slug', $lastPart)->first()) {
            return $this->brand($request, $brand, $categoryPath);
        }

        if ($product = Product::where('slug', $lastPart)->first()) {
            return $this->show($product->slug);
        }

        abort(404);
    }

    /**
     * Brand Listing Page
     */
    public function brand(Request $request, Brand $brand, $categoryPath = null)
    {
        $headerData = $this->productService->getHeaderData();
        $brandPageData = $this->productService->getBrandPageData($request, $brand, $categoryPath);

        return Inertia::render('Frontend/Products/Index', array_merge($headerData, $brandPageData));
    }

    /**
     * Category Listing Page
     */
    public function category(Request $request, Category $category)
    {
        $headerData = $this->productService->getHeaderData();
        $categoryPageData = $this->productService->getCategoryPageData($request, $category);

        return Inertia::render('Frontend/Products/Index', array_merge($headerData, $categoryPageData));
    }

    /**
     * Product Detail Page
     */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'brand',
                'categories.parent.parent',
                'images',
                'reviews' => fn ($q) => $q->where('status', 1)->with('user')->latest(),
                'questions' => fn ($q) => $q->with('user')->latest(),
            ])
            ->firstOrFail();

        $category = $product->categories->first();
        $headerData = $this->productService->getHeaderData();

        return Inertia::render('Frontend/Products/Show', array_merge($headerData, [
            'product' => ProductResource::make($product)->resolve(),
            'breadcrumbs' => $category ? $this->productService->getBreadcrumbs($category, $product->brand) : [],
            'relatedProducts' => Inertia::defer(fn () => ProductResource::collection(
                Product::whereHas('categories', fn ($q) => $category ? $q->where('categories.id', $category->id) : null)
                    ->where('id', '!=', $product->id)
                    ->limit(5)->get()
            )->resolve()),
        ]));
    }
}
