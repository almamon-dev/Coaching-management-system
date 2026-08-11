<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'student_id',
        'fee_type_id',
        'title',
        'amount',
        'discount',
        'net_amount',
        'paid_amount',
        'due_amount',
        'due_date',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function feeType()
    {
        return $this->belongsTo(FeeType::class);
    }

    public function payments()
    {
        return $this->hasMany(FeePayment::class, 'invoice_id');
    }
}
