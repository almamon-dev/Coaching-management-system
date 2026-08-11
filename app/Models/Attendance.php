<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'batch_id',
        'class_routine_id',
        'date',
        'status',
        'remark',
    ];

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function classRoutine()
    {
        return $this->belongsTo(ClassRoutine::class, 'class_routine_id');
    }
}
