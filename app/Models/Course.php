<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'category',
        'fee',
        'admission_fee',
        'duration',
        'total_lectures',
        'total_lessons',
        'description',
        'syllabus_details',
        'status',
    ];

    protected $attributes = [
        'admission_fee' => 0,
        'fee' => 0,
        'status' => 'active',
    ];

    public function setAdmissionFeeAttribute($value)
    {
        $this->attributes['admission_fee'] = ($value !== null && $value !== '') ? (float)$value : 0;
    }

    public function setFeeAttribute($value)
    {
        $this->attributes['fee'] = ($value !== null && $value !== '') ? (float)$value : 0;
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function students()
    {
        return $this->hasMany(StudentProfile::class);
    }
}
