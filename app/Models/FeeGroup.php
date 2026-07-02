<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_class_id',
        'name',
        'description',
        'is_active',
    ];

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(FeeGroupItem::class);
    }
}
