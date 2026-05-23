<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Repositories\Admin\Page\PageRepository;

class BulkUpdatePageStatusService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute bulk status updates for selected pages.
     */
    public function execute(array $ids, bool $all, bool $isActive, ?string $search = null): bool
    {
        return $this->repository->bulkUpdateStatus($ids, $all, $isActive, $search);
    }
}
