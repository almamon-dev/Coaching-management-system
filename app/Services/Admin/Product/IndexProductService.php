<?php

declare(strict_types=1);

namespace App\Services\Admin\Product;

use App\Caches\Admin\Product\ProductCache;
use Illuminate\Http\Request;

class IndexProductService
{
    public function __construct(
        protected ProductCache $cache,
    ) {}

    /**
     * Get paginated product list with stats.
     */
    public function execute(Request $request): array
    {
        return $this->cache->getProductList($request);
    }
}
