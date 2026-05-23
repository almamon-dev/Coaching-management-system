<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Http\Resources\Frontend\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\GlobalVariant;
use App\Support\Cache\CacheKeys;
use App\Support\Cache\CacheManager;
use App\Support\Formatters\SlugFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * ProductService
 *
 * Orchestrates business logic for product retrieval, filtering, and breadcrumb generation.
 * Optimized for high performance through selective column loading and strategic caching.
 */
class ProductService
{
    /**
     * Build and execute a filtered product query for listing pages.
     */
    public function getFilteredProducts(Request $request, array $initialFilters = [])
    {
        $query = Product::query()
            ->select([
                'id', 'brand_id', 'category_id', 'name', 'slug',
                'price', 'discount_price', 'status', 'view_count', 'created_at',
            ])
            ->with([
                'brand:id,name,slug',
                'categories:id,name,slug',
                'primaryImage:id,product_id,image',
            ]);

        if (isset($initialFilters['brand'])) {
            $query->whereBelongsTo($initialFilters['brand']);
        }

        return $query
            ->filterCategories($initialFilters['category_ids'] ?? $request->category)
            ->filterBrands($request->brand)
            ->filterPrice($request->min_price, $request->max_price)
            ->filterStatus($request->status)
            ->sort($request->get('sort', 'default'))
            ->paginate($request->get('limit', 20))
            ->withQueryString();
    }

    /**
     * Calculates the dynamic price range for the current category/brand context.
     */
    public function getPriceRange(array $initialFilters = [])
    {
        $query = Product::query();

        if (isset($initialFilters['category_ids'])) {
            $query->filterCategories($initialFilters['category_ids']);
        }
        if (isset($initialFilters['brand'])) {
            $query->whereBelongsTo($initialFilters['brand']);
        }

        return [
            'min' => 0,
            'max' => $query->max('price') ?: 1000000,
        ];
    }

    /**
     * Generates a recursive breadcrumb array for navigation.
     */
    public function getBreadcrumbs(?Category $category = null, ?Brand $brand = null)
    {
        $breadcrumbs = [];
        $temp = $category;

        while ($temp) {
            array_unshift($breadcrumbs, [
                'name' => $temp->name,
                'slug' => $temp->path,
                'type' => 'category',
            ]);
            $temp = $temp->parent;
        }

        if ($brand && $category) {
            $breadcrumbs[] = [
                'name' => $brand->name.' '.$category->name,
                'slug' => $category->path.'/'.$brand->slug,
                'type' => 'brand_category',
            ];
        } elseif ($brand) {
            array_unshift($breadcrumbs, ['name' => 'Brands', 'slug' => '#', 'type' => 'link']);
            $breadcrumbs[] = ['name' => $brand->name, 'slug' => $brand->slug, 'type' => 'brand'];
        }

        return $breadcrumbs;
    }

    /**
     * Retrieve global header data (categories/brands).
     */
    public function getHeaderData()
    {
        return Cache::remember('frontend_header_data', 86400, function () {
            $categories = Category::query()
                ->roots()
                ->active()
                ->with([
                    'children' => fn ($q) => $q->active()->select(['id', 'parent_id', 'name', 'slug']),
                    'children.children' => fn ($q) => $q->active()->select(['id', 'parent_id', 'name', 'slug']),
                ])
                ->select(['id', 'parent_id', 'name', 'slug', 'image'])
                ->get();

            $this->attachBrandsRecursively($categories);

            return [
                'categories' => $categories,
                'brands' => Brand::select(['id', 'name', 'slug'])->active()->get(),
            ];
        });
    }

    public function getAvailableVariants()
    {
        return GlobalVariant::with('options')->where('status', 1)->get();
    }

    /**
     * Fetch category page rendering data.
     */
    public function getCategoryPageData(Request $request, Category $category): array
    {
        $categoryIds = array_merge([$category->id], $category->getAllChildrenIds());
        $initialFilters = ['category_ids' => $categoryIds];

        $priceRange = CacheManager::store([CacheKeys::TAG_CATEGORIES])->remember(
            CacheKeys::categoryPriceRange($category->id),
            3600,
            fn () => $this->getPriceRange($initialFilters)
        );

        $availableVariants = $this->getAvailableVariants();

        $relevantBrands = CacheManager::store([CacheKeys::TAG_CATEGORIES])->remember(
            CacheKeys::categoryBrands($category->id),
            3600,
            fn () => Brand::whereHas('products.categories', fn ($q) => $q->whereIn('categories.id', $categoryIds))->get()
        );

        return [
            'category' => $category,
            'subcategories' => $category->children()->where('status', 1)->get(),
            'products' => Inertia::defer(fn () => ProductResource::collection(
                $this->getFilteredProducts($request, $initialFilters)
            )->response()->getData(true)),
            'filters' => $request->all(),
            'priceRange' => $priceRange,
            'breadcrumbs' => $this->getBreadcrumbs($category),
            'availableVariants' => $availableVariants,
            'relevantBrands' => $relevantBrands,
        ];
    }

    /**
     * Fetch brand page rendering data.
     */
    public function getBrandPageData(Request $request, Brand $brand, ?string $categoryPath = null): array
    {
        $contextCategory = null;
        $initialFilters = ['brand' => $brand];

        if ($categoryPath) {
            $lastCategorySlug = SlugFormatter::getLastSlugSegment($categoryPath);
            $contextCategory = Category::where('slug', $lastCategorySlug)->first();
            if ($contextCategory) {
                $initialFilters['category_ids'] = array_merge([$contextCategory->id], $contextCategory->getAllChildrenIds());
            }
        }

        $priceRange = $this->getPriceRange($initialFilters);

        return [
            'brand' => $brand,
            'category' => $contextCategory,
            'products' => Inertia::defer(fn () => ProductResource::collection(
                $this->getFilteredProducts($request, $initialFilters)
            )->response()->getData(true)),
            'filters' => $request->all(),
            'priceRange' => $priceRange,
            'breadcrumbs' => $this->getBreadcrumbs($contextCategory, $brand),
            'availableVariants' => $this->getAvailableVariants(),
            'relevantBrands' => [],
            'subcategories' => [],
        ];
    }

    /**
     * Helper to attach brands to category objects for navigation display.
     */
    private function attachBrandsRecursively($categories)
    {
        foreach ($categories as $category) {
            $category->top_brands = $category->top_brands;
            if ($category->children->count() > 0) {
                $this->attachBrandsRecursively($category->children);
            }
        }
    }
}
