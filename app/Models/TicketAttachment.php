<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketAttachment extends Model
{
    protected $fillable = [
        'message_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type'
    ];

    /**
     * Get the ticket message that owns this attachment.
     */
    public function message()
    {
        return $this->belongsTo(TicketMessage::class, 'message_id');
    }
}
