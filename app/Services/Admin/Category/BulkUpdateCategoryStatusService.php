<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Repositories\Admin\Category\CategoryRepository;

class BulkUpdateCategoryStatusService
{
    public function __construct(
        protected CategoryRepository $repository,
    ) {}

    /**
     * Update status for multiple categories and clear the cache.
     */
    public function execute(array $ids, bool $all, bool $isActive, ?string $search = null): bool
    {
        // CategoryObserver::saved() flushes TAG_CATEGORIES automatically
        return $this->repository->bulkUpdateStatus($ids, $all, $isActive, $search);
    }
}
