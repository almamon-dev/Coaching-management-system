<?php

declare(strict_types=1);

namespace App\Services\Admin\User;

use App\Repositories\Admin\User\UserRepository;
use Illuminate\Http\Request;

class IndexUserService
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    public function execute(Request $request): array
    {
        return $this->repository->getUserList($request);
    }
}
