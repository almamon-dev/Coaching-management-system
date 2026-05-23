<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Repositories\Admin\Category\CategoryRepository;
use App\Services\Admin\Category\GetCategoryAttributesService;
use App\Services\Admin\Category\StoreAttributeService;
use App\Services\Admin\Category\UpdateAttributeService;
use App\Services\Admin\Category\DetachCategoryAttributeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CategoryAttributeController extends Controller
{
    /**
     * Get attributes for selected categories (Ajax).
     */
    public function index(Request $request, GetCategoryAttributesService $service): JsonResponse
    {
        $categoryIds = $request->input('category_ids', []);

        if (empty($categoryIds)) {
            return response()->json([]);
        }

        $startIds = is_array($categoryIds) ? $categoryIds : [$categoryIds];
        $attributes = $service->execute($startIds);

        return response()->json($attributes);
    }

    /**
     * Show the attribute management page for a category.
     */
    public function manage(Category $category, CategoryRepository $repository): InertiaResponse
    {
        return Inertia::render('Admin/Categories/Details/CategoryAttributesPage', [
            'category' => $category->load('attributes.values'),
            'categories' => $repository->getFormCategories(),
        ]);
    }

    /**
     * Update/Sync attributes for a category.
     */
    public function update(Request $request, Category $category, UpdateAttributeService $service): RedirectResponse
    {
        $request->validate([
            'attributes' => 'required|array',
            'attributes.*.name' => 'required|string',
            'attributes.*.type' => 'required|string',
        ]);

        $service->execute($category, $request->input('attributes'));

        return redirect()->back()->with('success', 'Attributes updated successfully.');
    }

    /**
     * Quick add a single attribute.
     */
    public function quickAdd(Request $request, Category $category, StoreAttributeService $service): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:text,number,dropdown_single,dropdown_multiple,boolean',
            'unit' => 'nullable|string|max:20',
            'placeholder' => 'nullable|string|max:100',
            'values' => 'nullable|string',
        ]);

        $attribute = $service->execute($category, $validated);

        return response()->json([
            'success' => true,
            'attribute' => $attribute,
        ]);
    }

    /**
     * Remove an attribute from a category.
     */
    public function detachAttribute(Category $category, Attribute $attribute, DetachCategoryAttributeService $service): JsonResponse
    {
        $service->execute($category, $attribute);

        return response()->json(['success' => true]);
    }
}
