<?php

declare(strict_types=1);

namespace App\Observers\Product;

use App\Caches\Admin\Product\ProductCache;
use App\Models\Product;

class ProductObserver
{
    public function __construct(
        protected ProductCache $cache,
    ) {}

    /**
     * Flush cache whenever a product is created or updated.
     * Covers: store, update, updateStatus, bulkUpdateStatus.
     */
    public function saved(Product $product): void
    {
        $this->cache->clear();
    }

    /**
     * Flush cache whenever a product is deleted.
     * Covers: destroy, bulkDestroy.
     */
    public function deleted(Product $product): void
    {
        $this->cache->clear();
    }
}
