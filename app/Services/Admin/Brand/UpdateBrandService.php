<?php

declare(strict_types=1);

namespace App\Services\Admin\Brand;

use App\Models\Brand;
use App\Repositories\Admin\Brand\BrandRepository;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;

class UpdateBrandService
{
    public function __construct(
        protected BrandRepository $repository,
    ) {}

    public function execute(Brand $brand, array $data, $logoFile = null): bool
    {
        if ($logoFile) {
            if ($brand->logo) {
                FileRemover::delete($brand->logo);
            }
            $data['logo'] = FileUploader::upload('brands', $logoFile);
        }

        if (isset($data['status'])) {
            $data['status'] = $data['status'] === 'active' ? 1 : 0;
        }

        return $this->repository->update($brand, $data);
    }
}
