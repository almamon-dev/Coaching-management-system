<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $guarded = ['id'];

    /**
     * Scope to only include active pages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    protected static function booted()
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('global_pages_list');
        });
        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('global_pages_list');
        });
    }
}
