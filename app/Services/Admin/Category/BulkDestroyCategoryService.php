<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Repositories\Admin\Category\CategoryRepository;

class BulkDestroyCategoryService
{
    public function __construct(
        protected CategoryRepository $repository,
    ) {}

    /**
     * Delete multiple categories and clear the cache.
     */
    public function execute(array $ids, bool $all = false, ?string $search = null): bool
    {
        // CategoryObserver::deleted() flushes TAG_CATEGORIES automatically
        return $this->repository->bulkDelete($ids, $all, $search);
    }
}
