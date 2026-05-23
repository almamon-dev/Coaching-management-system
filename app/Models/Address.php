<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'name',
        'address',
        'city',
        'area',
        'post_code',
        'is_primary',
    ];
}
