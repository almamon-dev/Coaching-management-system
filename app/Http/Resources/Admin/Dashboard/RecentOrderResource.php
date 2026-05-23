<?php

namespace App\Http\Resources\Admin\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecentOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstItem = $this->items->first();
        $productName = $firstItem ? $firstItem->product->name : 'N/A';
        $categoryName = $firstItem && $firstItem->product->category ? $firstItem->product->category->name : 'Uncategorized';
        
        if ($this->items->count() > 1) {
            $productName .= ' (+' . ($this->items->count() - 1) . ' more)';
        }

        return [
            'id' => $this->id,
            'order_id' => $this->order_number,
            'customer' => $this->user->name ?? 'Guest',
            'product' => $productName,
            'category' => $categoryName,
            'amount' => (float)$this->total_amount,
            'status' => ucfirst($this->status),
            'date' => $this->created_at->format('Y-m-d')
        ];
    }
}
