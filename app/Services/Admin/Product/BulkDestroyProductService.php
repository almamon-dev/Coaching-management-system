<?php

declare(strict_types=1);

namespace App\Services\Admin\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class BulkDestroyProductService
{
    public function __construct(
        protected DestroyProductService $destroyer,
    ) {}

    /**
     * Delete multiple products and their associated media.
     * ProductObserver::deleted() flushes TAG_PRODUCTS for each deletion automatically.
     */
    public function execute(array $ids, bool $all, ?string $search = null): void
    {
        DB::transaction(function () use ($ids, $all, $search) {
            $query = Product::query();

            if ($all) {
                if ($search) {
                    $query->where('name', 'like', "%{$search}%");
                }
            } else {
                $query->whereIn('id', $ids);
            }

            $query->with('images')->each(
                fn (Product $product) => $this->destroyer->execute($product)
            );
        });
    }
}
