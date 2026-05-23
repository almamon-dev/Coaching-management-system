<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = ['product_id', 'image', 'is_primary'];
    protected $appends = ['full_url'];

    public function getFullUrlAttribute()
    {
        return \App\Support\Media\FileUrlGenerator::generate($this->image);
    }
}
