<?php

namespace App\Http\Resources\Admin;

use App\Support\Media\FileUrlGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'logo' => FileUrlGenerator::generate($this->logo),
            'is_active' => (bool) $this->status,
            'brands' => $this->brands->map(fn ($brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
            ]),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
