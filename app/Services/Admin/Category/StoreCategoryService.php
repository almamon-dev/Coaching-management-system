<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;
use App\Support\Media\FileUploader;

class StoreCategoryService
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Create a new category with image handling.
     */
    public function execute(array $data, $imageFile = null): Category
    {
        if ($imageFile) {
            $data['image'] = FileUploader::upload('categories', $imageFile);
        }

        if (isset($data['is_active'])) {
            $data['status'] = $data['is_active'] ? 1 : 0;
        }

        return $this->repository->create($data);
    }
}
