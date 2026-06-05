<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_id',
        'academic_class_id',
        'section_id',
        'roll_number',
        'guardian_name',
        'guardian_phone',
        'guardian_email',
        'guardian_relation',
        'blood_group',
        'dob',
        'gender',
        'address'
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function currentEnrollment()
    {
        return $this->hasOne(Enrollment::class)
            ->whereHas('academicSession', function ($q) {
                $q->where('is_current', true);
            });
    }
}
