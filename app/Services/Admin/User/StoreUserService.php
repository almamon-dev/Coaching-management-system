<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Models\User;
use App\Repositories\Admin\User\UserRepository;

class StoreUserService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(array $data): User
    {
        return $this->repository->create($data);
    }
}
