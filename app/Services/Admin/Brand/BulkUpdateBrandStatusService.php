<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Repositories\Admin\Brand\BrandRepository;

class BulkUpdateBrandStatusService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(array $ids, bool $all, string $field, $value, ?string $search = null): bool
    {
        return $this->repository->bulkUpdateStatus($ids, $all, $field, $value, $search);
    }
}
