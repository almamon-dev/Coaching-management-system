<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Models\User;
use App\Repositories\Admin\User\UserRepository;

class UpdateUserService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(User $user, array $data): bool
    {
        return $this->repository->update($user, $data);
    }
}
