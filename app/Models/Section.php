<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['academic_class_id', 'name', 'capacity', 'class_teacher_id'];

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class);
    }

    public function classTeacher()
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }
}
