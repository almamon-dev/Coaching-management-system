<?php

namespace App\Services\Admin\Marketing;

use App\Models\MarketingCampaign;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;

class UpdateCampaignService
{
    /**
     * Update an existing marketing campaign.
     */
    public function execute(MarketingCampaign $campaign, array $data): MarketingCampaign
    {
        return DB::transaction(function () use ($campaign, $data) {
            $campaignData = collect($data)->except(['file', 'thumbnail_file'])->toArray();
            
            // Handle file uploads and delete old files if necessary
            if ($campaign->type === 'brochure') {
                if (isset($data['file']) && $data['file'] instanceof \Illuminate\Http\UploadedFile) {
                    // Remove old file using FileRemover
                    FileRemover::delete($campaign->file_path);
                    $campaignData['file_path'] = FileUploader::upload('marketing/brochures', $data['file']);
                }
                
                if (isset($data['thumbnail_file']) && $data['thumbnail_file'] instanceof \Illuminate\Http\UploadedFile) {
                    // Remove old thumbnail using FileRemover
                    FileRemover::delete($campaign->thumbnail);
                    $campaignData['thumbnail'] = FileUploader::upload('marketing/thumbnails', $data['thumbnail_file']);
                }
            }

            $campaign->update($campaignData);
            return $campaign;
        });
    }

    /**
     * Delete a campaign and its associated files.
     */
    public function delete(MarketingCampaign $campaign): bool
    {
        FileRemover::delete($campaign->file_path);
        FileRemover::delete($campaign->thumbnail);
        
        return $campaign->delete();
    }
}
