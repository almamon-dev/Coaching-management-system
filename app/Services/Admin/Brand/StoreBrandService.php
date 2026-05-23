<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Models\Brand;
use App\Repositories\Admin\Brand\BrandRepository;
use App\Support\Media\FileUploader;

class StoreBrandService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(array $data, $logoFile = null): Brand
    {
        if ($logoFile) {
            $data['logo'] = FileUploader::upload('brands', $logoFile);
        }

        if (isset($data['status'])) {
            $data['status'] = $data['status'] === 'active' ? 1 : 0;
        }

        return $this->repository->create($data);
    }
}
