<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'course_id',
        'total_lectures',
        'total_lessons',
        'description',
        'syllabus_details',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }
}
