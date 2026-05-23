<?php
 
namespace App\Http\Resources\User;
 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
 
class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product->name,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'images' => collect($this->images ?? [])->map(fn($img) => str_starts_with($img, '/') ? $img : '/' . $img)->values()->toArray(),
            'videos' => $this->videos ?? [],
            'date' => $this->created_at->format('Y-m-d'),
            'status' => $this->status ? 'Published' : 'Pending',
        ];
    }
}
