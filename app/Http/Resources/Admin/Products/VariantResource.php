<?php

namespace App\Http\Resources\Admin\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'value' => $this->value,
            'price_adjustment' => (float) $this->price_adjustment,
            'stock' => (int) $this->stock,
            'product' => new ProductResource($this->whenLoaded('product')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
