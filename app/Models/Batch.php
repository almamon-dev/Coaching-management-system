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
        'image',
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
        return $this->belongsToMany(StudentProfile::class, 'batch_student', 'batch_id', 'student_id')
            ->withPivot(['course_id', 'monthly_fee', 'roll_number', 'status', 'enrolled_at'])
            ->withTimestamps();
    }

    public function routines()
    {
        return $this->hasMany(ClassRoutine::class);
    }

    public function classRoutines()
    {
        return $this->hasMany(ClassRoutine::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
