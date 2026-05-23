<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\StoreProductQuestionRequest;
use App\Http\Requests\Frontend\StoreProductReviewRequest;
use App\Models\Product;
use App\Models\ProductQuestion;
use App\Models\Review;
use App\Models\User;
use App\Notifications\NewProductQuestionNotification;
use App\Notifications\NewProductReviewNotification;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Services\User\Wishlist\WishlistService;

class ProductInteractionController extends Controller
{
    protected WishlistService $wishlistService;

    public function __construct(WishlistService $wishlistService)
    {
        $this->wishlistService = $wishlistService;
    }

    /**
     * Store a product question.
     */
    public function storeQuestion(StoreProductQuestionRequest $request, Product $product)
    {
        $question = ProductQuestion::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'question' => $request->question,
            'status' => 0, // Pending
        ]);

        // Notify admins
        $admins = User::where('user_type', 'admin')->get();
        Notification::send($admins, new NewProductQuestionNotification($question, $product, Auth::user()));

        return back()->with('success', 'Your question has been submitted and is awaiting an answer.');
    }

    /**
     * Store a product review.
     */
    public function storeReview(StoreProductReviewRequest $request, Product $product)
    {
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = FileUploader::upload('reviews/images', $file);
                if ($path) {
                    $imagePaths[] = $path;
                }
            }
        }

        $videoPaths = [];
        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $file) {
                $path = FileUploader::upload('reviews/videos', $file);
                if ($path) {
                    $videoPaths[] = $path;
                }
            }
        }

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => $imagePaths,
            'videos' => $videoPaths,
            'status' => 1,
        ]);

        // Notify admin
        $admin = User::where('user_type', 'admin')->first();
        if ($admin) {
            $admin->notify(new NewProductReviewNotification($product, $review, Auth::user()));
        }

        return back()->with('success', 'Thank you for your review!');
    }

    public function toggleWishlist(Product $product)
    {
        $result = $this->wishlistService->toggle($product->id);

        return back()->with('success', $result['message']);
    }
}
