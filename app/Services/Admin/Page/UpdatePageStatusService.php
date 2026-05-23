<?php

declare(strict_types=1);

namespace App\Services\Admin\Page;

use App\Models\Page;
use App\Repositories\Admin\Page\PageRepository;

class UpdatePageStatusService
{
    protected PageRepository $repository;

    public function __construct(PageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Execute visibility status update for a page.
     */
    public function execute(Page $page, bool $isActive): bool
    {
        return $this->repository->updateStatus($page, $isActive);
    }
}
