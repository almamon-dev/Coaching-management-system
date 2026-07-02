<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeGroupItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_group_id',
        'fee_type_id',
        'amount',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(FeeGroup::class, 'fee_group_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(FeeType::class, 'fee_type_id');
    }
}
