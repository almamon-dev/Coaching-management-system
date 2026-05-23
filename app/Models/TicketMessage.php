<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketMessage extends Model
{
    protected $fillable = [
        'ticket_id',
        'sender_id',
        'message',
        'is_internal'
    ];

    protected $casts = [
        'is_internal' => 'boolean',
    ];

    /**
     * Get the ticket that owns this message.
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    /**
     * Get the sender of this message.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the attachments for this message.
     */
    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class, 'message_id');
    }
}
