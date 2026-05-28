<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
        'price' => 'float',
        'discount_price' => 'float',
        'is_featured' => 'boolean',
        'discount_type' => 'string',
        'discount_value' => 'float',
    ];
    /**
     * Scope to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope to filter products by price range.
     *
     * @param  float|null  $min
     * @param  float|null  $max
     */
    public function scopeFilterPrice($query, $min, $max)
    {
        if ($min) {
            $query->where('price', '>=', $min);
        }
        if ($max) {
            $query->where('price', '<=', $max);
        }

        return $query;
    }

    /**
     * Scope to filter products by status (comma-separated).
     *
     * @param  string|null  $status
     */
    public function scopeFilterStatus($query, $status)
    {
        if ($status) {
            $query->whereIn('status', explode(',', $status));
        }

        return $query;
    }

    /**
     * Scope to filter products by multiple categories.
     * Uses a non-correlated IN subquery for maximum index utilisation.
     * Avoids JOIN to prevent column ambiguity with eager-loaded selects.
     *
     * @param  array|int|null  $categoryIds
     */
    public function scopeFilterCategories($query, $categoryIds)
    {
        if ($categoryIds) {
            $ids = (array) $categoryIds;
            $query->whereIn('products.id', function ($sub) use ($ids) {
                $sub->select('product_id')
                    ->from('product_categories')
                    ->whereIn('category_id', $ids);
            });
        }

        return $query;
    }

    /**
     * Scope to filter products by multiple brands.
     *
     * @param  array|int|null  $brandIds
     */
    public function scopeFilterBrands($query, $brandIds)
    {
        if ($brandIds) {
            $query->whereIn('brand_id', (array) $brandIds);
        }

        return $query;
    }



    /**
     * Scope to sort products by different criteria.
     *
     * @param  string  $type  (price_low, price_high, name_az, default)
     */
    public function scopeSort($query, $type)
    {
        return match ($type) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'name_az' => $query->orderBy('name', 'asc'),
            default => $query->latest()
        };
    }

    protected $appends = ['status_label'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(Category::class, 'sub_category_id');
    }

    public function subSubCategory()
    {
        return $this->belongsTo(Category::class, 'sub_sub_category_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', 1);
    }



    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function seo()
    {
        return $this->hasOne(ProductSeo::class);
    }

    public function detail()
    {
        return $this->hasOne(ProductDetail::class);
    }



    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            1 => 'In Stock',
            2 => 'Out of Stock',
            3 => 'Pre Order',
            4 => 'Up Coming',
            default => 'Unknown'
        };
    }

    public function questions()
    {
        return $this->hasMany(ProductQuestion::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'product_warehouse')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    /**
     * Get the dynamically calculated best discount details.
     */
    public function getCalculatedDiscountAttribute(): ?array
    {
        return app(\App\Services\Discount\GlobalDiscountService::class)->calculateBestDiscount($this);
    }

    /**
     * Get the effective price after the best discount is applied.
     */
    public function getEffectivePriceAttribute(): float
    {
        $discount = $this->calculated_discount;
        return $discount ? $discount['price'] : (float) $this->price;
    }
}
