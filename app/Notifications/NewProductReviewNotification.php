<?php
 
namespace App\Notifications;
 
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
 
class NewProductReviewNotification extends Notification
{
    use Queueable;
 
    protected $review;
    protected $product;
    protected $user;
 
    /**
     * Create a new notification instance.
     */
    public function __construct($review, $product, $user)
    {
        $this->review = $review;
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
            'type' => 'review',
            'title' => 'New Product Review',
            'message' => "{$this->user->name} gave a {$this->review->rating}-star review for {$this->product->name}",
            'content' => $this->review->comment,
            'images_count' => count($this->review->images ?? []),
            'videos_count' => count($this->review->videos ?? []),
            'review_id' => $this->review->id,
            'product_id' => $this->product->id,
            'user_name' => $this->user->name,
            'action_url' => route('admin.reviews.index'),
        ];
    }
}
