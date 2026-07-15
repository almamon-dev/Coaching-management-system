<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HarassmentComplaint extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'description',
        'attachment',
        'status',
    ];
}
