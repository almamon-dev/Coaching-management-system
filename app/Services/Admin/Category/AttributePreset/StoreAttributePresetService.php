<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Models\AttributePreset;
use App\Repositories\Admin\Category\AttributePresetRepository;
use Illuminate\Support\Str;

class StoreAttributePresetService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    public function execute(array $data): AttributePreset
    {
        return $this->repository->create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'fields' => $data['fields']
        ]);
    }
}
