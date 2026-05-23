<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class GetCategoryAttributesService
{
    protected CategoryRepository $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all attributes (with values) for given category IDs and all their ancestors.
     */
    public function execute(array $categoryIds): Collection
    {
        $allCategoryIds = [];
        foreach ($categoryIds as $id) {
            $category = Category::find($id);
            if ($category) {
                $allCategoryIds[] = $category->id;
                $allCategoryIds = array_merge($allCategoryIds, $category->getAllAncestorIds());
            }
        }

        $allCategoryIds = array_unique($allCategoryIds);

        return $this->repository->getAttributesForCategories($allCategoryIds);
    }
}
