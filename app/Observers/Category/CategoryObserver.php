<?php

declare(strict_types=1);

namespace App\Observers\Category;

use App\Caches\Admin\Category\CategoryCache;
use App\Models\Category;

class CategoryObserver
{
    public function __construct(
        protected CategoryCache $cache,
    ) {}

    /**
     * Flush cache whenever a category is created or updated.
     * Covers: store, update, updateStatus, bulkUpdateStatus.
     */
    public function saved(Category $category): void
    {
        $this->cache->clear();
    }

    /**
     * Flush cache whenever a category is deleted.
     * Covers: destroy, bulkDestroy.
     */
    public function deleted(Category $category): void
    {
        $this->cache->clear();
    }
}
