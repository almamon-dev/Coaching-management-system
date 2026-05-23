<?php

namespace App\Http\Resources\Admin\Marketing;

use App\Support\Media\FileUrlGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'code' => $this->code,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'min_purchase' => $this->min_purchase,
            'expires_at' => $this->expires_at,
            'usage_limit' => $this->usage_limit,
            'used_count' => $this->used_count,
            'file_path' => FileUrlGenerator::generate($this->file_path),
            'thumbnail' => FileUrlGenerator::generate($this->thumbnail),
            'status' => $this->status,
            'applies_to' => $this->applies_to,
            'target_ids' => $this->target_ids,
            'download_count' => $this->download_count,
            'created_at' => $this->created_at,
        ];
    }
}
