<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Caches\Admin\Category\CategoryCache;
use App\Models\Attribute;
use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;

class DetachCategoryAttributeService
{
    protected CategoryRepository $repository;
    protected CategoryCache $cache;

    public function __construct(CategoryRepository $repository, CategoryCache $cache)
    {
        $this->repository = $repository;
        $this->cache = $cache;
    }

    /**
     * Detach an attribute from a category and clear category caches.
     */
    public function execute(Category $category, Attribute $attribute): void
    {
        $this->repository->detachAttribute($category, $attribute);

        // Bust all category related caches
        $this->cache->clear();
    }
}
