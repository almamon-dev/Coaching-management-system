<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Repositories\Admin\Category\AttributePresetRepository;

class BulkDestroyAttributePresetService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    public function execute(array $ids, bool $all = false, ?string $search = null): bool
    {
        return $this->repository->bulkDelete($ids, $all, $search);
    }
}
