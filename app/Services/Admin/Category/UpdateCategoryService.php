<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;

class UpdateCategoryService
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Update an existing category with image replacement.
     */
    public function execute(Category $category, array $data, $imageFile = null): bool
    {
        if ($imageFile) {
            if ($category->image) {
                FileRemover::delete($category->image);
            }
            $data['image'] = FileUploader::upload('categories', $imageFile);
        }

        if (isset($data['is_active'])) {
            $data['status'] = $data['is_active'] ? 1 : 0;
        }

        return $this->repository->update($category, $data);
    }
}
