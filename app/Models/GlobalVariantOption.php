<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalVariantOption extends Model
{
    protected $guarded = ['id'];

    public function variant()
    {
        return $this->belongsTo(GlobalVariant::class, 'global_variant_id');
    }

}
