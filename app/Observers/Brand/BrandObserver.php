<?php

declare(strict_types=1);

namespace App\Observers\Brand;

use App\Caches\Admin\Brand\BrandCache;
use App\Models\Brand;
use Illuminate\Support\Facades\Cache;

class BrandObserver
{
    public function __construct(
        protected BrandCache $cache,
    ) {}

    /**
     * Flush cache whenever a brand is created or updated.
     */
    public function saved(Brand $brand): void
    {
        $this->cache->clear();
        
        // Also clear global_brands_list if defined in Brand model booted method
        Cache::forget('global_brands_list');
    }

    /**
     * Flush cache whenever a brand is deleted.
     */
    public function deleted(Brand $brand): void
    {
        $this->cache->clear();
        
        // Also clear global_brands_list if defined in Brand model booted method
        Cache::forget('global_brands_list');
    }
}
