<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Caches\Admin\Brand\BrandCache;
use Illuminate\Http\Request;

class IndexBrandService
{
    public function __construct(
        protected BrandCache $cache,
    ) {}

    /**
     * Get paginated brand list with stats.
     */
    public function execute(Request $request): array
    {
        return $this->cache->getBrandList($request);
    }
}
