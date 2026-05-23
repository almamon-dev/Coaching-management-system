<?php

declare(strict_types=1);

namespace App\Caches\Admin\Brand;

use App\Repositories\Admin\Brand\BrandRepository;
use App\Support\Cache\CacheKeys;
use App\Support\Cache\CacheManager;
use Illuminate\Http\Request;

class BrandCache
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    /**
     * Get cached brand list.
     */
    public function getBrandList(Request $request): array
    {
        $params = $request->only(['search', 'status', 'is_featured', 'has_logo', 'per_page', 'cursor']);
        $cacheKey = CacheKeys::brandList($params);

        return CacheManager::store([CacheKeys::TAG_BRANDS])->remember($cacheKey, 86400, function () use ($request) {
            $result = $this->repository->getBrandList($request);
            // Convert cursor pagination to array for consistent caching / serialization
            $result['brands'] = $result['brands']->toArray();
            return $result;
        });
    }

    /**
     * Clear all cached brand list data.
     */
    public function clear(): void
    {
        if (CacheManager::supportsTags()) {
            CacheManager::store([CacheKeys::TAG_BRANDS])->flush();
            return;
        }

        // Tagging is unavailable for the current store; items will expire naturally.
    }
}
