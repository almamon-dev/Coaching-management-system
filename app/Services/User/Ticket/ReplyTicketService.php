<?php

declare(strict_types=1);

namespace App\Services\User\Ticket;

use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\TicketAttachment;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ReplyTicketService
{
    /**
     * Add a reply to a ticket thread.
     */
    public function execute(User $user, Ticket $ticket, array $data, ?array $attachments = null): void
    {
        DB::transaction(function () use ($user, $ticket, $data, $attachments) {
            // Append Message
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

            // Mark ticket status back to open if it was resolved/in_progress
            if ($ticket->status !== 'open') {
                $ticket->update(['status' => 'open']);
            } else {
                // Touch ticket to update 'updated_at' timestamp
                $ticket->touch();
            }
        });
    }
}
