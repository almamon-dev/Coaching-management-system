<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributePresetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
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
            'fields' => data_get($this->resource, 'fields', []),
            'created_at' => $createdAt,
        ];
    }
}
