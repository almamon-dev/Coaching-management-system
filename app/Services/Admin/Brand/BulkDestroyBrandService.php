<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Repositories\Admin\Brand\BrandRepository;

class BulkDestroyBrandService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(array $ids, bool $all = false, ?string $search = null): bool
    {
        return $this->repository->bulkDelete($ids, $all, $search);
    }
}
