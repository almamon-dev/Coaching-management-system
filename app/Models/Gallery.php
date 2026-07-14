<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Gallery extends Model
{
    protected $fillable = [
        'title',
        'category',
        'image',
        'is_featured',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    protected $appends = ['image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => \App\Support\Media\FileUrlGenerator::generate($this->image),
        );
    }
}
