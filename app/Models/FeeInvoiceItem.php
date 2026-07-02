<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeInvoiceItem extends Model
{
    //
    protected $guarded = [];
    
    public function invoice()
    {
        return $this->belongsTo(FeeInvoice::class, 'fee_invoice_id');
    }
    
    public function feeType()
    {
        return $this->belongsTo(FeeType::class);
    }
}
