<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketingCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'code',
        'discount_type',
        'discount_value',
        'min_purchase',
        'expires_at',
        'usage_limit',
        'used_count',
        'file_path',
        'thumbnail',
        'download_count',
        'status',
        'applies_to',
        'target_ids',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'discount_value' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'status' => 'boolean',
        'target_ids' => 'array',
    ];

    public function scopeCoupons($query)
    {
        return $query->where('type', 'coupon');
    }

    public function scopeBrochures($query)
    {
        return $query->where('type', 'brochure');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeForProductRaw($query)
    {
        return $query->where(function($q) {
            $q->where('applies_to', 'all')
              ->orWhere(function($sq) {
                  $sq->where('applies_to', 'product')
                     ->whereRaw('JSON_CONTAINS(target_ids, CAST(products.id AS CHAR))');
              })
              ->orWhere(function($sq) {
                  $sq->where('applies_to', 'category')
                     ->where(function($ssq) {
                         $ssq->whereRaw('JSON_CONTAINS(target_ids, CAST(products.category_id AS CHAR))')
                             ->orWhereRaw('JSON_CONTAINS(target_ids, CAST(products.sub_category_id AS CHAR))')
                             ->orWhereRaw('JSON_CONTAINS(target_ids, CAST(products.sub_sub_category_id AS CHAR))');
                     });
              });
        });
    }

    /**
     * Scope to filter campaigns applicable to a specific product instance
     */
    public function scopeForProduct($query, $product)
    {
        return $query->where(function($q) use ($product) {
            $q->where('applies_to', 'all')
              ->orWhere(function($sq) use ($product) {
                  $sq->where('applies_to', 'product')
                     ->whereJsonContains('target_ids', (string)$product->id);
              })
              ->orWhere(function($sq) use ($product) {
                  $sq->where('applies_to', 'category')
                     ->where(function($ssq) use ($product) {
                         if ($product->category_id) $ssq->orWhereJsonContains('target_ids', (string)$product->category_id);
                         if ($product->sub_category_id) $ssq->orWhereJsonContains('target_ids', (string)$product->sub_category_id);
                         if ($product->sub_sub_category_id) $ssq->orWhereJsonContains('target_ids', (string)$product->sub_sub_category_id);
                     });
              });
        });
    }

    public function isCoupon(): bool
    {
        return $this->type === 'coupon';
    }

    /**
     * চেক করা: এটি কি একটি ব্রোশিওর?
     */
    public function isBrochure(): bool
    {
        return $this->type === 'brochure';
    }
}
