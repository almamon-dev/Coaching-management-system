<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherPromotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_profile_id',
        'previous_designation',
        'new_designation',
        'previous_department',
        'new_department',
        'promotion_date',
        'note',
    ];

    protected $casts = [
        'promotion_date' => 'date',
    ];

    public function teacher_profile()
    {
        return $this->belongsTo(TeacherProfile::class);
    }
}
