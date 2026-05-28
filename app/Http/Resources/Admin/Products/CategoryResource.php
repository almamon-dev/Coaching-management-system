<?php

namespace App\Http\Resources\Admin\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Helper to extract English name from model or array
        $getEnName = function ($item) {
            if (!$item) return null;
            if ($item instanceof \App\Models\Category) {
                return $item->getTranslation('name', 'en', false) ?: $item->name;
            }
            return data_get($item, 'name_translations.en') ?: data_get($item, 'name');
        };

        // data_get() works on both Eloquent models AND plain arrays (from cache)
        $parentId       = data_get($this->resource, 'parent_id');
        $parent         = data_get($this->resource, 'parent');
        $parentParentId = data_get($parent, 'parent_id');
        $parentName     = $getEnName($parent);

        $level = 0;
        if ($parentId) {
            $level = $parentParentId ? 2 : 1;
        }

        // whenLoaded() only works on Eloquent models — use direct key access for arrays
        $attributes = null;
        $rawAttrs   = data_get($this->resource, 'attributes');
        if ($rawAttrs !== null) {
            $attributes = collect($rawAttrs)->map(fn ($attr) => [
                'id'   => data_get($attr, 'id'),
                'name' => data_get($attr, 'name'),
                'slug' => data_get($attr, 'slug'),
            ])->values()->all();
        }

        return [
            'id'               => data_get($this->resource, 'id'),
            'name'             => $getEnName($this->resource),
            'slug'             => data_get($this->resource, 'slug'),
            'image'            => data_get($this->resource, 'image'),
            'parent_id'        => $parentId,
            'parent_name'      => $parentName,
            'level'            => $level,
            'is_active'        => (bool) data_get($this->resource, 'status'),
            'attributes_count' => data_get($this->resource, 'attributes_count', 0),
            'products_count'   => data_get($this->resource, 'products_count', 0),
            'attributes'       => $attributes,
            'created_at'       => data_get($this->resource, 'created_at'),
        ];
    }
}
