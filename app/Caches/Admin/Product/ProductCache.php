<?php

declare(strict_types=1);

namespace App\Caches\Admin\Product;

use App\Repositories\Admin\Product\ProductRepository;
use App\Support\Cache\CacheKeys;
use App\Support\Cache\CacheManager;
use Illuminate\Http\Request;

class ProductCache
{
    public function __construct(
        protected ProductRepository $repository,
    ) {}

    /**
     * Get the full product list response (list + stats).
     *
     * List  → cached by filter params  (TTL: 24h, busted on any product change)
     * Stats → cached globally          (TTL: 1h,  busted on any product change)
     *
     * Paginator is NOT cached directly (not serializable).
     * We cache its toArray() representation and return it as-is.
     * The frontend receives the same {data, next_cursor, ...} shape.
     */
    public function getProductList(Request $request): array
    {
        $params   = $request->only(['search', 'status', 'brand_id', 'category_id', 'min_price', 'max_price', 'sort_by', 'per_page', 'cursor']);
        $listKey  = CacheKeys::productList($params);
        $statsKey = CacheKeys::productStats();

        $products = CacheManager::store([CacheKeys::TAG_PRODUCTS])->remember($listKey, 86400, function () use ($request) {
            // Serialize to array so it can be safely stored in Redis or any supported cache
            return $this->repository->getProductList($request)->toArray();
        });

        $stats = CacheManager::store([CacheKeys::TAG_PRODUCTS])->remember($statsKey, 3600, function () {
            return $this->repository->getStats();
        });

        return ['products' => $products, 'stats' => $stats];
    }

    /**
     * Clear all product-related caches (list + stats).
     */
    public function clear(): void
    {
        if (CacheManager::supportsTags()) {
            CacheManager::store([CacheKeys::TAG_PRODUCTS])->flush();
            return;
        }

        // Tagged cache is not available for the current store.
        // Product list caches will expire naturally instead of being flushed.
        CacheManager::store()->forget(CacheKeys::productStats());
    }
}
