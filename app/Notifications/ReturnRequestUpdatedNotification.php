<?php

namespace App\Notifications;

use App\Models\OrderReturn;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnRequestUpdatedNotification extends Notification
{
    use Queueable;

    protected $returnRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(OrderReturn $returnRequest)
    {
        $this->returnRequest = $returnRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $orderNumber = $this->returnRequest->order?->order_number ?? 'N/A';

        return (new MailMessage)
            ->subject('Return Request Status Updated - #' . $orderNumber)
            ->view('emails.return_updated', [
                'user' => $notifiable,
                'returnRequest' => $this->returnRequest
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        $orderNumber = $this->returnRequest->order?->order_number ?? 'N/A';

        return [
            'return_id' => $this->returnRequest->id,
            'order_id' => $this->returnRequest->order_id,
            'order_number' => $orderNumber,
            'status' => $this->returnRequest->status,
            'message' => 'Your return request for order #' . $orderNumber . ' has been updated to: ' . ucfirst($this->returnRequest->status) . '.',
            'admin_note' => $this->returnRequest->admin_note,
            'type' => 'return_updated'
        ];
    }
}
