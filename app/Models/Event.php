<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'image',
        'date',
        'time',
        'location',
        'contact_person',
        'contact_phone',
        'registration_required',
        'registration_deadline',
        'color',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'registration_deadline' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

