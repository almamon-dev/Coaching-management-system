<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairPart extends Model
{
    protected $fillable = [
        'repair_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price'
    ];

    /**
     * Get the repair job this part belongs to.
     */
    public function repair()
    {
        return $this->belongsTo(Repair::class);
    }

    /**
     * Get the products catalog model for this spare part.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
