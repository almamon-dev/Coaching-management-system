<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Models\Brand;
use App\Repositories\Admin\Brand\BrandRepository;

class DestroyBrandService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(Brand $brand): bool
    {
        return $this->repository->delete($brand);
    }
}
