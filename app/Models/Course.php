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
