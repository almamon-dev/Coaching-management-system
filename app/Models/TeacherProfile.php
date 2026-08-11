<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'teacher_id',
        'name',
        'phone',
        'email',
        'qualification',
        'designation',
        'specialization',
        'address',
        'status',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class, 'teacher_id');
    }

    public function routines()
    {
        return $this->hasMany(ClassRoutine::class, 'teacher_id');
    }
}
