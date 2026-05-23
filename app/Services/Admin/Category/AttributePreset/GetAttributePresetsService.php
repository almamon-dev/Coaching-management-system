<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Repositories\Admin\Category\AttributePresetRepository;
use Illuminate\Database\Eloquent\Collection;

class GetAttributePresetsService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    /**
     * Get all presets.
     */
    public function execute(): Collection
    {
        return $this->repository->all();
    }
}
