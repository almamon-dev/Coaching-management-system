<?php

declare(strict_types=1);

namespace App\Services\Admin\Product;

use App\Models\Product;
use App\Models\ProductAttributeValue;
use App\Models\AttributeValue;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;

class UpdateProductService
{
    /**
     * Update an existing product and its relationships.
     */
    public function execute(Product $product, array $data, $request): Product
    {
        return DB::transaction(function () use ($product, $data, $request) {
            // 1. Core Product Data
            $productData = collect($data)->only([
                'name', 'slug', 'sku', 'brand_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'description',
                'price', 'discount_price', 'discount_type', 'discount_value', 'discount_start_date', 'discount_end_date', 'status', 'is_featured', 'warranty'
            ])->toArray();

            $product->update($productData);

            // 2. Category Update
            if (isset($data['category_id'])) {
                $product->categories()->sync($data['category_id']);
            }

            // 3. Variants Update
            $product->variants()->delete();
            if (!empty($data['variants'])) {
                $this->handleVariants($product, $data['variants']);
            }



            // 4. Product Details
            $product->detail()->updateOrCreate([], [
                'benefits'     => $data['benefits'] ?? null,
                'side_effects' => $data['side_effects'] ?? null,
                'formula'      => $data['formula'] ?? null,
            ]);

            // 5. SEO Update
            $product->seo()->updateOrCreate([], [
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'tags' => $data['tags'] ?? null,
            ]);

            // 7. Thumbnail & Gallery Replacement
            $this->handleThumbnailReplacement($product, $data);
            $this->handleGalleryAddition($product, $data);

            // 8. Warehouse Stocks (Inventory)
            $this->handleWarehouseStocks($product, $data['warehouse_stocks'] ?? []);

            return $product;
        });
    }

    /**
     * Handle saving product variants.
     */
    protected function handleVariants(Product $product, array $variants): void
    {
        $toInsert = [];

        foreach ($variants as $variant) {
            if (empty($variant['name'])) continue;

            $toInsert[] = [
                'product_id' => $product->id,
                'name'       => $variant['name'],
                'sku'        => $variant['sku'] ?? null,
                'price'      => $variant['price'] ?: $product->price,
                'stock'      => (int) ($variant['stock'] ?? 0),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($toInsert)) {
            $product->variants()->insert($toInsert);
        }
    }

    /**
     * Handle primary thumbnail replacement.
     */
    protected function handleThumbnailReplacement(Product $product, array $data): void
    {
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
            $oldPrimary = $product->images()->where('is_primary', 1)->first();
            if ($oldPrimary) {
                FileRemover::delete($oldPrimary->image);
                $oldPrimary->delete();
            }
            $path = FileUploader::upload('products', $data['thumbnail']);
            $product->images()->create(['image' => $path, 'is_primary' => 1]);
        }
    }

    /**
     * Handle gallery image additions.
     */
    protected function handleGalleryAddition(Product $product, array $data): void
    {
        if (isset($data['gallery']) && is_array($data['gallery'])) {
            foreach ($data['gallery'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = FileUploader::upload('products/gallery', $image);
                    $product->images()->create(['image' => $path, 'is_primary' => 0]);
                }
            }
        }
    }

    /**
     * Handle warehouse stock synchronization and total stock calculation.
     */
    protected function handleWarehouseStocks(Product $product, array $stocks): void
    {
        if (empty($stocks)) return;

        $syncData = [];
        $totalStock = 0;

        foreach ($stocks as $stock) {
            $warehouseId = $stock['warehouse_id'] ?? null;
            $quantity = (int) ($stock['quantity'] ?? 0);
            $threshold = (int) ($stock['low_stock_threshold'] ?? 5);

            if ($warehouseId) {
                $syncData[$warehouseId] = [
                    'quantity' => $quantity,
                    'low_stock_threshold' => $threshold,
                ];
                $totalStock += $quantity;
            }
        }

        // 1. Sync the relationship
        $product->warehouses()->sync($syncData);

        // 2. Update the main product stock with the total sum
        $product->update(['stock' => $totalStock]);
    }
}
