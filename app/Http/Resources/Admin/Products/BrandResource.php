<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $createdAt = data_get($this->resource, 'created_at');
        if ($createdAt instanceof \DateTimeInterface) {
            $createdAt = $createdAt->format('Y-m-d H:i:s');
        }

        return [
            'id' => data_get($this->resource, 'id'),
            'name' => data_get($this->resource, 'name'),
            'slug' => data_get($this->resource, 'slug'),
            'logo' => data_get($this->resource, 'logo'),
            'status' => (int) data_get($this->resource, 'status'),
            'is_featured' => (bool) data_get($this->resource, 'is_featured'),
            'products_count' => data_get($this->resource, 'products_count', 0),
            'categories_count' => data_get($this->resource, 'categories_count', 0),
            'created_at' => $createdAt,
        ];
    }
}
