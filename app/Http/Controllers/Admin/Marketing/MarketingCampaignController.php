<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Marketing\StoreCampaignRequest;
use App\Models\MarketingCampaign;
use App\Services\Admin\Marketing\IndexCampaignService;
use App\Services\Admin\Marketing\StoreCampaignService;
use App\Services\Admin\Marketing\UpdateCampaignService;
use App\Http\Resources\Admin\Marketing\CampaignResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketingCampaignController extends Controller
{
    /**
     * Display a listing of coupons.
     */
    public function coupons(Request $request, IndexCampaignService $service)
    {
        $result = $service->execute($request, 'coupon');

        return Inertia::render('Admin/Marketing/Coupons/List/CouponListPage', [
            'campaigns' => CampaignResource::collection($result['campaigns'])->response()->getData(true),
            'filters' => $request->only(['search', 'status', 'sort_by', 'per_page', 'discount_type']),
            'stats' => $result['stats'],
        ]);
    }

    /**
     * Show the form for creating a new campaign.
     */
    public function create(Request $request)
    {
        $data = [
            'type' => 'coupon',
            'categories' => \App\Models\Category::select('id', 'name', 'parent_id')->where('status', 1)->get(),
            'brands' => \App\Models\Brand::select('id', 'name')->get(),
            'products' => \App\Models\Product::select('id', 'name as title', 'sku', 'brand_id')
                ->with(['categories:id'])
                ->where('status', 1)
                ->latest()
                ->limit(300)
                ->get()
                ->map(function($p) {
                    $p->category_ids = $p->categories->pluck('id');
                    unset($p->categories);
                    return $p;
                })
        ];

        return Inertia::render('Admin/Marketing/Coupons/Create/CouponCreatePage', $data);
    }

    /**
     * Store a newly created campaign in storage.
     */
    public function store(StoreCampaignRequest $request, StoreCampaignService $service)
    {
        $service->execute($request->validated());

        return redirect()->route('admin.marketing.coupons.index')->with('success', 'Coupon created successfully.');
    }

    /**
     * Show the form for editing the specified campaign.
     */
    public function edit(MarketingCampaign $campaign)
    {
        // Safety check
        if ($campaign->type !== 'coupon') {
            return redirect()->route('admin.marketing.coupons.index');
        }

        $data = [
            'campaign' => CampaignResource::make($campaign),
            'categories' => \App\Models\Category::select('id', 'name', 'parent_id')->where('status', 1)->get(),
            'brands' => \App\Models\Brand::select('id', 'name')->get(),
            'products' => \App\Models\Product::select('id', 'name as title', 'sku', 'brand_id')
                ->with(['categories:id'])
                ->where('status', 1)
                ->latest()
                ->limit(300)
                ->get()
                ->map(function($p) {
                    $p->category_ids = $p->categories->pluck('id');
                    unset($p->categories);
                    return $p;
                })
        ];

        return Inertia::render('Admin/Marketing/Coupons/Edit/CouponEditPage', $data);
    }

    /**
     * Update the specified campaign in storage.
     */
    public function update(StoreCampaignRequest $request, MarketingCampaign $campaign, UpdateCampaignService $service)
    {
        $service->execute($campaign, $request->validated());

        return redirect()->route('admin.marketing.coupons.index')->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified campaign from storage.
     */
    public function destroy(MarketingCampaign $campaign, UpdateCampaignService $service)
    {
        $service->delete($campaign);

        return redirect()->back()->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Update the status of the campaign.
     */
    public function updateStatus(Request $request, MarketingCampaign $campaign)
    {
        $status = $request->has('status') ? $request->status : !$campaign->status;
        $campaign->update(['status' => $status]);
        
        return redirect()->back()->with('success', 'Status updated successfully.');
    }

    /**
     * Bulk update status for coupons.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
            'status' => 'required|integer|in:0,1'
        ]);

        $query = MarketingCampaign::where('type', 'coupon');

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                        ->orWhere('code', 'like', '%'.$request->search.'%');
                });
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
        }

        $query->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Selected coupons updated successfully.');
    }

    /**
     * Bulk delete coupons.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'all' => 'required|boolean',
        ]);

        $query = MarketingCampaign::where('type', 'coupon');

        if (!$request->all) {
            $query->whereIn('id', $request->ids);
        } else {
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                        ->orWhere('code', 'like', '%'.$request->search.'%');
                });
            }
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
        }

        $query->delete();

        return redirect()->back()->with('success', 'Selected coupons deleted successfully.');
    }
}
