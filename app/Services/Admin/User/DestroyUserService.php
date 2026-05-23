<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Models\User;
use App\Repositories\Admin\User\UserRepository;

class DestroyUserService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(User $user): bool
    {
        return $this->repository->delete($user);
    }
}
