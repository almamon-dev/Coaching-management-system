<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Counter extends Model
{
    protected $guarded = ['id'];

    /**
     * Scope to only include active counters.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
