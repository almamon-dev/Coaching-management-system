<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PCBuild extends Model
{
    protected $table = 'pc_builds';

    protected $fillable = [
        'uuid',
        'user_id',
        'components',
        'total_price',
    ];

    protected $casts = [
        'components' => 'array',
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
