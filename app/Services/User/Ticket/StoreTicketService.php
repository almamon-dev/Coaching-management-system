<?php

declare(strict_types=1);

namespace App\Services\User\Ticket;

use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\TicketAttachment;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class StoreTicketService
{
    /**
     * Store a newly created ticket and its first message in storage.
     */
    public function execute(User $user, array $data, ?array $attachments = null): Ticket
    {
        return DB::transaction(function () use ($user, $data, $attachments) {
            // Generate a unique Ticket Tracking ID (e.g. SUP-58194)
            do {
                $ticketId = 'SUP-' . rand(10000, 99999);
            } while (Ticket::where('ticket_id', $ticketId)->exists());

            // Create Ticket
            $ticket = Ticket::create([
                'ticket_id' => $ticketId,
                'user_id' => $user->id,
                'subject' => $data['subject'],
                'category' => $data['category'],
                'priority' => $data['priority'],
                'status' => 'open',
            ]);

            // Create First Message in Thread
            $message = TicketMessage::create([
                'ticket_id' => $ticket->id,
                'sender_id' => $user->id,
                'message' => $data['message'],
                'is_internal' => false
            ]);

            // Save attachments if present
            if (!empty($attachments)) {
                foreach ($attachments as $file) {
                    $originalName = $file->getClientOriginalName();
                    $fileSize = $file->getSize();
                    $mimeType = $file->getClientMimeType();
                    
                    // Store locally under public disk
                    $path = FileUploader::upload('tickets', $file);

                    TicketAttachment::create([
                        'message_id' => $message->id,
                        'file_path' => $path,
                        'file_name' => $originalName,
                        'file_size' => $fileSize,
                        'mime_type' => $mimeType,
                    ]);
                }
            }

            return $ticket;
        });
    }
}
