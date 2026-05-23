<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Support\Facades\URL;
use App\Models\User;

class StaffInvitationNotification extends Notification
{
    use Queueable;

    protected $inviter;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $inviter)
    {
        $this->inviter = $inviter;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = URL::temporarySignedRoute(
            'admin.invitations.accept',
            now()->addDays(3),
            ['user' => $notifiable->id]
        );

        return (new MailMessage)
            ->subject('Staff Invitation - Access Control Portal')
            ->view('emails.invitation', [
                'name' => $notifiable->name,
                'inviter_name' => $this->inviter->name,
                'inviter_email' => $this->inviter->email,
                'acceptUrl' => $acceptUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
