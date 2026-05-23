<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Models\AttributePreset;
use App\Repositories\Admin\Category\AttributePresetRepository;
use Illuminate\Support\Str;

class UpdateAttributePresetService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    public function execute(AttributePreset $preset, array $data): bool
    {
        return $this->repository->update($preset, [
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'fields' => $data['fields']
        ]);
    }
}
