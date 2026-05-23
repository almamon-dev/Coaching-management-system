<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'address',
        'phone',
        'is_active',
    ];

    /**
     * The products that belong to the warehouse.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_warehouse')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
