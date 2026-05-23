<?php

declare(strict_types=1);

namespace App\Services\Admin\Product;

use App\Models\Product;
use App\Support\Media\FileRemover;
use Illuminate\Support\Facades\DB;

class DestroyProductService
{
    /**
     * Delete a single product and its associated media.
     * ProductObserver::deleted() flushes TAG_PRODUCTS automatically.
     */
    public function execute(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                FileRemover::delete($image->image);
            }

            return (bool) $product->delete();
        });
    }
}
