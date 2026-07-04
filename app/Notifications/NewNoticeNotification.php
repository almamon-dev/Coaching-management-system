<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewNoticeNotification extends Notification
{
    use Queueable;

    protected $notice;

    /**
     * Create a new notification instance.
     */
    public function __construct($notice)
    {
        $this->notice = $notice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'notice_id' => $this->notice->id,
            'title' => $this->notice->title,
            'type' => $this->notice->type,
            'message' => 'A new ' . $this->notice->type . ' has been published: ' . $this->notice->title,
        ];
    }
}
