<?php

namespace App\Services\Admin\Marketing;

use App\Models\MarketingCampaign;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;

class StoreCampaignService
{
    /**
     * Store a new marketing campaign (Coupon or Brochure).
     */
    public function execute(array $data): MarketingCampaign
    {
        return DB::transaction(function () use ($data) {
            $campaignData = collect($data)->except(['file', 'thumbnail_file'])->toArray();
            
            // Handle file uploads for brochures
            if ($data['type'] === 'brochure') {
                if (isset($data['file']) && $data['file'] instanceof \Illuminate\Http\UploadedFile) {
                    $campaignData['file_path'] = FileUploader::upload('marketing/brochures', $data['file']);
                }
                
                if (isset($data['thumbnail_file']) && $data['thumbnail_file'] instanceof \Illuminate\Http\UploadedFile) {
                    $campaignData['thumbnail'] = FileUploader::upload('marketing/thumbnails', $data['thumbnail_file']);
                }
            }

            return MarketingCampaign::create($campaignData);
        });
    }
}
