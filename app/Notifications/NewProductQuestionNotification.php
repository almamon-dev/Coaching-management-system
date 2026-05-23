<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewProductQuestionNotification extends Notification
{
    use Queueable;

    protected $question;

    protected $product;

    protected $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($question, $product, $user)
    {
        $this->question = $question;
        $this->product = $product;
        $this->user = $user;
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
            'type' => 'question',
            'title' => 'New Product Question',
            'message' => "{$this->user->name} asked a question about {$this->product->name}",
            'content' => $this->question->question,
            'question_id' => $this->question->id,
            'product_id' => $this->product->id,
            'user_name' => $this->user->name,
            'action_url' => route('admin.questions.index'),
        ];
    }
}
