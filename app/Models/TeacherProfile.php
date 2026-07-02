<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_id',
        'designation',
        'department',
        'joining_date',
        'qualifications',
        'specializations'
    ];

    protected $casts = [
        'joining_date' => 'date',
        'specializations' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function promotions()
    {
        return $this->hasMany(TeacherPromotion::class);
    }
}
