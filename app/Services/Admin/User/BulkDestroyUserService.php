<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Repositories\Admin\User\UserRepository;

class BulkDestroyUserService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(array $ids): int
    {
        return $this->repository->bulkDelete($ids);
    }
}
