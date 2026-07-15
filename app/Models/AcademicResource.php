<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicResource extends Model
{
    protected $fillable = [
        'title',
        'type',
        'academic_class_id',
        'year',
        'file_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class);
    }
}
