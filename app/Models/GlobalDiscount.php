<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalDiscount extends Model
{
    protected $fillable = [
        'name',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'target_type',
        'target_id',
        'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'status' => 'boolean',
        'discount_value' => 'decimal:2',
    ];
}
