<?php

declare(strict_types=1);

namespace App\Services\Admin\Product;

use App\Models\Product;

class UpdateProductStatusService
{
    /**
     * Update status for a product.
     * ProductObserver::saved() flushes TAG_PRODUCTS automatically.
     */
    public function execute(Product $product, int $status): bool
    {
        return $product->update(['status' => $status]);
    }
}
