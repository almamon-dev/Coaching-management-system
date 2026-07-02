<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    //
    protected $guarded = [];
    
    protected $casts = [
        'payment_date' => 'date',
    ];
    
    public function invoice()
    {
        return $this->belongsTo(FeeInvoice::class, 'fee_invoice_id');
    }
    
    public function collectedBy()
    {
        return $this->belongsTo(User::class, 'collected_by');
    }
}
