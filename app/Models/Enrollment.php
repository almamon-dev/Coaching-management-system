<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_profile_id',
        'academic_session_id',
        'academic_class_id',
        'section_id',
        'roll_number',
        'status',
    ];

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
