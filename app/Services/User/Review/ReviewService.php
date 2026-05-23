<?php

declare(strict_types=1);

namespace App\Services\User\Review;

use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewService
{
    /**
     * Get all reviews for the authenticated user.
     */
    public function getUserReviews()
    {
        return Auth::user()->reviews()
            ->with('product')
            ->latest()
            ->get();
    }
}
