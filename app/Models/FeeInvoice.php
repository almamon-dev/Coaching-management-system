<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeInvoice extends Model
{
    //
    protected $guarded = [];
    
    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
    ];
    
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class);
    }
    
    public function feeGroup()
    {
        return $this->belongsTo(FeeGroup::class);
    }
    
    public function items()
    {
        return $this->hasMany(FeeInvoiceItem::class);
    }
    
    public function payments()
    {
        return $this->hasMany(FeePayment::class);
    }
}
