<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'assigned_to',
        'subject',
        'category',
        'priority',
        'status'
    ];

    /**
     * Get the customer who created this ticket.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the staff member currently assigned to this ticket.
     */
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get all messages / replies in this ticket's thread.
     */
    public function messages()
    {
        return $this->hasMany(TicketMessage::class, 'ticket_id');
    }

    /**
     * Scope query to only show tickets visible to a specific user/staff.
     */
    public function scopeForUser($query, User $user)
    {
        if ($user->user_type === 'admin') {
            // Support staff can see assigned tickets, Super Admin can see everything
            if ($user->hasRole('Super Admin')) {
                return $query;
            }
            return $query->where('assigned_to', $user->id);
        }
        
        // Customers can only see their own tickets
        return $query->where('user_id', $user->id);
    }
}
