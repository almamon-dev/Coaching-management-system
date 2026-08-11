<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationalExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_no',
        'category',
        'title',
        'amount',
        'expense_date',
        'payment_method',
        'notes',
        'receipt_ref',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
