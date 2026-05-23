<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;

class DestroyCategoryService
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Delete a category.
     */
    public function execute(Category $category): bool
    {
        return $this->repository->delete($category);
    }
}
