<?php

declare(strict_types=1);

namespace App\Caches\Admin\Category;

use App\Repositories\Admin\Category\CategoryRepository;
use App\Support\Cache\CacheKeys;
use App\Support\Cache\CacheManager;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class CategoryCache
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get cached category list.
     */
    public function getCategoryList(Request $request): array
    {
        $cacheParams = $request->only([
            'search',
            'status',
            'root_id',
            'sub_id',
            'sub_sub_id',
            'per_page',
            'cursor',
            'root_type',
            'has_image',
            'want_lookups',
        ]);

        $cacheKey = CacheKeys::categoryList($cacheParams);

        return CacheManager::store([CacheKeys::TAG_CATEGORIES])
            ->remember($cacheKey, 86400, function () use ($request) {

                $result = $this->repository->getCategoryList($request);

                // Serialize all Eloquent objects to plain PHP arrays
                $result['categories'] = $result['categories']->toArray();

                if (! empty($result['lookups'])) {
                    $result['lookups'] = [
                        'rootCategories' => collect($result['lookups']['rootCategories'])->toArray(),
                        'allSubCategories' => collect($result['lookups']['allSubCategories'])->toArray(),
                        'allSubSubCategories' => collect($result['lookups']['allSubSubCategories'])->toArray(),
                    ];
                }

                return $result;
            });
    }

    /**
     * Get cached navbar categories tree.
     */
    public function getNavbarCategoriesTree(): Collection
    {
        $cacheKey = CacheKeys::navbarCategoriesTree();

        return CacheManager::store([CacheKeys::TAG_CATEGORIES])
            ->remember($cacheKey, 3600, function () {
                return $this->repository->getNavbarCategoriesTree();
            });
    }

    /**
     * Get cached home categories with brands.
     */
    public function getHomeCategoriesWithBrands(): Collection
    {
        $cacheKey = CacheKeys::homeCategoriesWithBrands();

        return CacheManager::store([CacheKeys::TAG_CATEGORIES])
            ->remember($cacheKey, 3600, function () {
                return $this->repository->getHomeCategoriesWithBrands();
            });
    }

    /**
     * Clear all category-related caches.
     */
    public function clear(): void
    {
        if (CacheManager::supportsTags()) {
            CacheManager::store([CacheKeys::TAG_CATEGORIES])->flush();
        } else {
            CacheManager::store()->forget(CacheKeys::navbarCategoriesTree());
            CacheManager::store()->forget(CacheKeys::homeCategoriesWithBrands());
        }
    }
}
