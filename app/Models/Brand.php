<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $guarded = ['id'];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        $clearCache = function () {
            \Illuminate\Support\Facades\Cache::forget('global_brands_list');
        };

        static::saved($clearCache);
        static::deleted($clearCache);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope to only include active brands.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
