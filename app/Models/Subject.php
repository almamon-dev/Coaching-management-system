<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'type'];

    public function teachers()
    {
        return $this->belongsToMany(User::class, 'subject_teacher', 'subject_id', 'user_id')
                    ->withPivot('academic_class_id', 'section_id')
                    ->withTimestamps();
    }
}
