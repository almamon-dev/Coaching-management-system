<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_id',
        'subject_id',
        'teacher_id',
        'room',
        'start_date',
        'end_date',
        'class_days',
        'class_time',
        'max_students',
        'status',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(TeacherProfile::class, 'teacher_id');
    }

    public function students()
    {
        return $this->hasMany(StudentProfile::class);
    }

    public function routines()
    {
        return $this->hasMany(ClassRoutine::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
