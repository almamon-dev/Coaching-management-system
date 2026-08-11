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
        'name',
        'photo',
        'dob',
        'gender',
        'phone',
        'email',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_id',
        'school_college',
        'course_id',
        'batch_id',
        'admission_date',
        'status',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function guardian()
    {
        return $this->belongsTo(GuardianProfile::class, 'guardian_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function feeInvoices()
    {
        return $this->hasMany(FeeInvoice::class, 'student_id');
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class, 'student_id');
    }

    public function marks()
    {
        return $this->hasMany(Mark::class, 'student_id');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'student_id');
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class, 'student_id');
    }
}
