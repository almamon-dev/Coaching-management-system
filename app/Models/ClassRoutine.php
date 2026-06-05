<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoutine extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_class_id',
        'section_id',
        'subject_id',
        'teacher_id',
        'day',
        'start_time',
        'end_time',
        'room_number',
    ];

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class, 'academic_class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
