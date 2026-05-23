<?php

namespace App\Services\Admin\Marketing;

use App\Models\MarketingCampaign;
use Illuminate\Http\Request;

class IndexCampaignService
{
    /**
     * Get filtered marketing campaigns and statistics.
     */
    public function execute(Request $request, string $type): array
    {
        $query = MarketingCampaign::where('type', $type);

        // Search Filter
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        // Status & Usage Tabs
        if ($request->filled('status')) {
            if ($request->status === 'usage') {
                $query->where('used_count', '>', 0);
            } elseif ($request->status !== 'all') {
                $query->where('status', $request->status);
            }
        }

        // Discount Type Filter
        if ($request->filled('discount_type') && $request->discount_type !== 'all') {
            $query->where('discount_type', $request->discount_type);
        }

        // Sorting logic
        $sort = $request->get('sort_by', 'latest');
        match($sort) {
            'name_az' => $query->orderBy('title', 'asc'),
            'name_za' => $query->orderBy('title', 'desc'),
            'value_high' => $query->orderBy('discount_value', 'desc'),
            'value_low' => $query->orderBy('discount_value', 'asc'),
            default => $query->latest()
        };

        $campaigns = $query->cursorPaginate($request->per_page ?? 10)->withQueryString();

        return [
            'campaigns' => $campaigns,
            'stats' => [
                'total'     => MarketingCampaign::where('type', $type)->count(),
                'active'    => MarketingCampaign::where('type', $type)->where('status', 1)->count(),
                'inactive'  => MarketingCampaign::where('type', $type)->where('status', 0)->count(),
                'popular'   => MarketingCampaign::where('type', $type)->where('used_count', '>', 0)->count(),
            ]
        ];
    }
}
