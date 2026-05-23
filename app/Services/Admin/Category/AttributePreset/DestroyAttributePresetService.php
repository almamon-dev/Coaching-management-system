<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Models\AttributePreset;
use App\Repositories\Admin\Category\AttributePresetRepository;

class DestroyAttributePresetService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    public function execute(AttributePreset $preset): bool
    {
        return $this->repository->delete($preset);
    }
}
