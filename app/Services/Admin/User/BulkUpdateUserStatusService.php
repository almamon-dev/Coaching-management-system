<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Repositories\Admin\User\UserRepository;

class BulkUpdateUserStatusService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(array $ids, string $status): int
    {
        return $this->repository->bulkUpdateStatus($ids, $status);
    }
}
