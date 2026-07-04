<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
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
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'registration_deadline' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
