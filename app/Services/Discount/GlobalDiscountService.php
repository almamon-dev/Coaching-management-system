<?php

namespace App\Services\Discount;

use App\Models\GlobalDiscount;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class GlobalDiscountService
{
    /**
     * Get all currently active global discounts.
     * Cached for performance since it applies to every product.
     */
    public function getActiveDiscounts()
    {
        return Cache::remember('active_global_discounts', 3600, function () {
            return GlobalDiscount::where('status', 1)
                ->where(function ($q) {
                    $q->whereNull('start_date')->orWhere('start_date', '<=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('end_date')->orWhere('end_date', '>=', now());
                })
                ->get();
        });
    }

    /**
     * Calculate the effective discount for a product.
     * Returns an array with the best discount details or null if no discount applies.
     */
    public function calculateBestDiscount(Product $product): ?array
    {
        $basePrice = (float) $product->price;
        $bestDiscountAmount = 0;
        $bestDiscountDetails = null;

        // 1. Check Product's Individual Discount
        if ($this->isProductDiscountActive($product)) {
            $productDiscountAmount = $this->calculateAmount(
                $basePrice,
                $product->discount_type,
                (float) $product->discount_value
            );

            if ($productDiscountAmount > 0) {
                $bestDiscountAmount = $productDiscountAmount;
                $bestDiscountDetails = [
                    'source' => 'product',
                    'type' => $product->discount_type,
                    'value' => (float) $product->discount_value,
                    'price' => max(0, $basePrice - $productDiscountAmount),
                ];
            }
        }

        // 2. Check Global Discounts
        $activeGlobalDiscounts = $this->getActiveDiscounts();

        foreach ($activeGlobalDiscounts as $campaign) {
            if ($this->isCampaignApplicable($campaign, $product)) {
                $campaignDiscountAmount = $this->calculateAmount(
                    $basePrice,
                    $campaign->discount_type,
                    (float) $campaign->discount_value
                );

                // If global campaign offers a better discount, override!
                if ($campaignDiscountAmount > $bestDiscountAmount) {
                    $bestDiscountAmount = $campaignDiscountAmount;
                    $bestDiscountDetails = [
                        'source' => 'campaign',
                        'campaign_id' => $campaign->id,
                        'campaign_name' => $campaign->name,
                        'type' => $campaign->discount_type,
                        'value' => (float) $campaign->discount_value,
                        'price' => max(0, $basePrice - $campaignDiscountAmount),
                    ];
                }
            }
        }

        return $bestDiscountDetails;
    }

    /**
     * Determine if a product's individual discount is currently active based on dates.
     */
    protected function isProductDiscountActive(Product $product): bool
    {
        if (!$product->discount_type || !$product->discount_value) {
            return false;
        }

        $now = now();

        if ($product->discount_start_date && $product->discount_start_date > $now) {
            return false;
        }

        if ($product->discount_end_date && $product->discount_end_date < $now) {
            return false;
        }

        return true;
    }

    /**
     * Determine if a global campaign is applicable to the given product.
     */
    protected function isCampaignApplicable(GlobalDiscount $campaign, Product $product): bool
    {
        return match ($campaign->target_type) {
            'all' => true,
            'category' => $product->category_id === $campaign->target_id,
            'sub_category' => $product->sub_category_id === $campaign->target_id,
            'sub_sub_category' => $product->sub_sub_category_id === $campaign->target_id,
            'brand' => $product->brand_id === $campaign->target_id,
            default => false,
        };
    }

    /**
     * Helper to calculate the flat discount amount based on type.
     */
    protected function calculateAmount(float $price, string $type, float $value): float
    {
        if ($type === 'percentage') {
            return $price * ($value / 100);
        }

        // Fixed amount
        return min($price, $value);
    }
}
