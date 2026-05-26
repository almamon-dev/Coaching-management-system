<?php

namespace App\Http\Resources\Frontend;

use App\Support\Media\FileUrlGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $calculatedDiscount = $this->calculated_discount;
        $effectivePrice = $calculatedDiscount ? $calculatedDiscount['price'] : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => (float) $this->price,
            'discount_price' => $effectivePrice ? (float) $effectivePrice : null,
            'discount_info' => $calculatedDiscount,
            'sku' => $this->sku,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'stock' => $this->stock,
            'warranty' => $this->warranty,
            'description' => $this->description,
            'thumbnail' => FileUrlGenerator::generate($this->primaryImage?->image ?? $this->thumbnail),
            'primary_image' => [
                'full_url' => FileUrlGenerator::generate($this->primaryImage?->image ?? $this->thumbnail) ?? 'https://ui-avatars.com/api/?name='.urlencode($this->name),
            ],
            'images' => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'image' => FileUrlGenerator::generate($img->image),
                'is_primary' => (bool) $img->is_primary,
            ]),
            'brand' => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ] : null,
            'categories' => $this->categories->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
            ]),
            'details' => $this->detail ? [
                'benefits' => $this->detail->benefits,
                'side_effects' => $this->detail->side_effects,
                'formula' => $this->detail->formula,
            ] : null,
            'reviews' => $this->reviews->map(fn ($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'images' => $r->images,
                'videos' => $r->videos,
                'created_at' => $r->created_at,
                'user' => [
                    'name' => $r->user?->name ?? 'Anonymous'
                ]
            ]),
            'questions' => $this->questions->map(fn ($q) => [
                'id' => $q->id,
                'question' => $q->question,
                'answer' => $q->answer,
                'created_at' => $q->created_at,
                'user' => [
                    'name' => $q->user?->name ?? 'Guest User'
                ]
            ]),
        ];
    }
}
