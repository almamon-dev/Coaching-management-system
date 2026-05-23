<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repair extends Model
{
    protected $fillable = [
        'ticket_number', 'user_id', 'technician_id', 'is_purchased_device',
        'product_id', 'order_id', 'device_type', 'brand', 'model_name',
        'serial_number', 'issue_description', 'diagnostics_notes',
        'customer_notes', 'service_charge', 'parts_cost', 'total_cost',
        'is_paid', 'payment_method', 'payment_status', 'status',
        'pickup_method', 'shipping_address', 'tracking_number',
        'warranty_ends_at', 'delivered_at'
    ];

    protected $casts = [
        'is_purchased_device' => 'boolean',
        'is_paid' => 'boolean',
        'warranty_ends_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Boot function to automatically generate a unique, sequential ticket number
     * (e.g. REP-2026-0001, REP-2026-0002) when a repair ticket is created.
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($repair) {
            $latest = self::latest('id')->first();
            $nextId = $latest ? $latest->id + 1 : 1;
            $repair->ticket_number = 'REP-' . date('Y') . '-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        });
    }

    /**
     * Get the customer who requested the repair.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the technician assigned to this repair.
     */
    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * Get the purchased product reference (if this device was bought from our store).
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the order reference (if this device was bought from our store).
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Get the spare parts used during this repair.
     */
    public function parts()
    {
        return $this->hasMany(RepairPart::class);
    }
}
