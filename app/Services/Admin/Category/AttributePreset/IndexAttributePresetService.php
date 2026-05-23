<?php

declare(strict_types=1);

namespace App\Services\Admin\Category\AttributePreset;

use App\Repositories\Admin\Category\AttributePresetRepository;
use Illuminate\Http\Request;

class IndexAttributePresetService
{
    public function __construct(
        protected AttributePresetRepository $repository,
    ) {}

    /**
     * Get paginated attribute presets with stats directly from database.
     */
    public function execute(Request $request): array
    {
        return $this->repository->getPresetList($request);
    }
}
