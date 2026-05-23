<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalVariant extends Model
{
    protected $guarded = ['id'];

    public function options()
    {
        return $this->hasMany(GlobalVariantOption::class);
    }
}
