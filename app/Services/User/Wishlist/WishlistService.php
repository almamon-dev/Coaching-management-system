<?php

declare(strict_types=1);

namespace App\Services\User\Wishlist;

use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;

class WishlistService
{
    /**
     * Get the authenticated user's wishlist products.
     */
    public function getUserWishlist()
    {
        return Wishlist::where('user_id', Auth::id())
            ->with([
                'product' => function ($query) {
                    $query->select(['id', 'name', 'price', 'status']);
                },
                'product.primaryImage' => function ($query) {
                    $query->select(['id', 'product_id', 'image']);
                }
            ])
            ->latest()
            ->get()
            ->pluck('product')
            ->filter();
    }

    /**
     * Toggle a product in the user's wishlist.
     */
    public function toggle($productId)
    {
        $userId = Auth::id();
        $wishlist = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return ['status' => 'removed', 'message' => 'Product removed from wishlist.'];
        }

        Wishlist::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        return ['status' => 'added', 'message' => 'Product added to wishlist.'];
    }

    /**
     * Remove a product from the user's wishlist.
     */
    public function remove($productId)
    {
        Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();
    }
}
