<?php

namespace App\Http\Resources\Admin\Products;

use App\Http\Resources\Admin\SupplierResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand_id' => $this->brand_id,
            'supplier_id' => $this->supplier_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail,
            'price' => (float) $this->price,
            'discount' => (float) $this->discount,
            'discount_type' => $this->discount_type,
            'is_discount' => (bool) $this->is_discount,
            'stock' => (int) $this->stock,
            'has_variants' => (bool) $this->has_variants,
            'status' => (int) $this->status,
            'status_label' => match($this->status) {
                1 => 'In Stock',
                2 => 'Out of Stock',
                3 => 'Pre Order',
                4 => 'Up Coming',
                default => 'Unknown'
            },
            'is_active' => $this->status == 1,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'images' => $this->images,
            'variants' => $this->variants,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
