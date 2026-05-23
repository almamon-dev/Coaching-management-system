<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class PaymentMethod extends Model
{
    use HasFactory;
 
    protected $fillable = [
        'user_id',
        'card_holder',
        'card_number',
        'expiry_date',
        'card_type',
        'is_default',
    ];
 
    protected $casts = [
        'card_number' => 'encrypted',
        'is_default' => 'boolean',
    ];
 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
