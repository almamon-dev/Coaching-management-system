<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Models\Brand;
use App\Repositories\Admin\Brand\BrandRepository;

class UpdateBrandStatusService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(Brand $brand, int $status): bool
    {
        return $this->repository->updateStatus($brand, $status);
    }
}
