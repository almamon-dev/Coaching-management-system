<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Caches\Admin\Category\CategoryCache;
use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Support\Str;

class UpdateAttributeService
{
    protected CategoryCache $cache;

    public function __construct(CategoryCache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Synchronize attributes for a category.
     *
     * @param Category $category
     * @param array $attributesData
     * @return void
     */
    public function execute(Category $category, array $attributesData): void
    {
        $attributeIds = [];

        foreach ($attributesData as $attrData) {
            $slug = $attrData['slug'] ?: Str::slug($attrData['name']);
            
            // Try to find existing attribute by ID or Slug
            $attribute = null;
            if (!empty($attrData['id'])) {
                $attribute = Attribute::find($attrData['id']);
            }
            
            if (!$attribute) {
                $attribute = Attribute::where('slug', $slug)->first();
            }

            $payload = [
                'name' => $attrData['name'],
                'slug' => $slug,
                'type' => $attrData['type'],
                'unit' => !empty($attrData['unit']) ? $attrData['unit'] : null,
                'placeholder' => !empty($attrData['placeholder']) ? $attrData['placeholder'] : null,
                'show_in_filter' => (bool)($attrData['show_in_filter'] ?? true),
            ];

            if ($attribute) {
                $attribute->update($payload);
            } else {
                $attribute = Attribute::create($payload);
            }

            // Handle options for dropdowns
            $this->manageOptions($attribute, $attrData['type'], $attrData['options'] ?? '');

            $attributeIds[$attribute->id] = [
                'is_required' => (bool)($attrData['is_required'] ?? false),
            ];
        }

        // Sync category attributes
        $category->attributes()->sync($attributeIds);

        // Bust all category related caches
        $this->cache->clear();
    }

    /**
     * Manage attribute values/options.
     */
    protected function manageOptions(Attribute $attribute, string $type, string $optionsString): void
    {
        if (str_contains($type, 'dropdown')) {
            $options = array_filter(array_map('trim', explode("\n", $optionsString)));
            
            $attribute->values()->delete();
            foreach ($options as $option) {
                $attribute->values()->create(['value' => $option]);
            }
        } else {
            $attribute->values()->delete();
        }
    }
}
