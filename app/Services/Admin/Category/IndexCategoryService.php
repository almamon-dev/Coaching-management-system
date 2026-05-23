<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Caches\Admin\Category\CategoryCache;
use Illuminate\Http\Request;

class IndexCategoryService
{
    protected CategoryCache $cache;

    public function __construct(CategoryCache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Get paginated category list with lookup filters and stats.
     */
    public function execute(Request $request): array
    {
        return $this->cache->getCategoryList($request);
    }
}
