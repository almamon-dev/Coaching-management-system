<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Repositories\Admin\Page\PageRepository;

class BulkDestroyPageService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute bulk deletion of pages.
     */
    public function execute(array $ids, bool $all = false, ?string $search = null): bool
    {
        return $this->repository->bulkDelete($ids, $all, $search);
    }
}
