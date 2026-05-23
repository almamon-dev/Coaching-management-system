<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;

class UpdateCategoryStatusService
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Update status for a category.
     */
    public function execute(Category $category, bool $isActive): bool
    {
        return $this->repository->updateStatus($category, $isActive);
    }
}
