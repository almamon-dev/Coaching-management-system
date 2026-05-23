<?php

declare(strict_types=1);

namespace App\Services\Admin\Category;

use App\Caches\Admin\Category\CategoryCache;
use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Support\Str;

class StoreAttributeService
{
    protected CategoryCache $cache;

    public function __construct(CategoryCache $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Quickly create and attach an attribute to a category and clear cache.
     *
     * @param Category $category
     * @param array $data
     * @return Attribute
     */
    public function execute(Category $category, array $data): Attribute
    {
        $attribute = Attribute::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'type' => $data['type'],
            'unit' => $data['unit'] ?? null,
            'placeholder' => $data['placeholder'] ?? null,
            'show_in_filter' => true
        ]);

        if (str_contains($data['type'], 'dropdown') && !empty($data['values'])) {
            $options = array_map('trim', explode(',', $data['values']));
            foreach ($options as $option) {
                $attribute->values()->create(['value' => $option]);
            }
        }

        $category->attributes()->attach($attribute->id, ['is_required' => false]);

        // Bust all category related caches (since attributes have changed)
        $this->cache->clear();

        return $attribute;
    }
}
