<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\ProductImage;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Row;
use Illuminate\Support\Facades\Log;

class ProductsImport implements OnEachRow, WithHeadingRow, WithChunkReading
{
    protected $imagePath;

    protected $mapping;

    public function __construct($imagePath = null, $mapping = [])
    {
        $this->imagePath = $imagePath;
        $this->mapping = $mapping;
    }

    public function chunkSize(): int
    {
        return 200;
    }

    public function onRow(Row $row)
    {
        $rowData = $row->toArray();

        // Helper to get value from row based on mapping
        $getMappedValue = function ($field) use ($rowData) {
            $mappedCol = $this->mapping[$field] ?? null;

            return $mappedCol ? ($rowData[$mappedCol] ?? null) : null;
        };

        // Validate basic required fields to prevent DB crashes
        $name = $getMappedValue('name');
        $sku = $getMappedValue('sku');
        $categoryId = $getMappedValue('category_id');

        if (empty($name) || empty($sku) || empty($categoryId)) {
            Log::warning("Skipped row {$row->getIndex()} in Product Import due to missing required fields (name, sku, or category_id).", $rowData);
            return;
        }

        try {
            $product = Product::create([
                'name'                   => $name,
                'slug'                   => $getMappedValue('slug') ?? Str::slug($name . '-' . $sku),
            'sku'                    => $getMappedValue('sku'),
            'brand_id'               => $getMappedValue('brand_id') ?: null,
            'category_id'            => $getMappedValue('category_id') ?: null,
            'sub_category_id'        => $getMappedValue('sub_category_id') ?: null,
            'sub_sub_category_id'    => $getMappedValue('sub_sub_category_id') ?: null,
            'description'            => $getMappedValue('description'),
            'price'                  => $getMappedValue('price'),
            'discount_price'         => $getMappedValue('discount_price'),
            'discount_type'          => $getMappedValue('discount_type'),
            'discount_value'         => $getMappedValue('discount_value'),
            'discount_start_date'    => $getMappedValue('discount_start_date'),
            'discount_end_date'      => $getMappedValue('discount_end_date'),   
            'stock'                  => $getMappedValue('stock') ?? 0,
            'warranty'               => $getMappedValue('warranty'),
            'status'                 => $getMappedValue('status') ?? 1,
            'is_featured'            => $getMappedValue('is_featured') ?? 0,
        ]);

        // 1. Sync Categories Pivot (Keep for compatibility if needed)
        $categoryIds = array_filter([
            $getMappedValue('category_id'),
            $getMappedValue('sub_category_id'),
            $getMappedValue('sub_sub_category_id'),
        ]);

        if (! empty($categoryIds)) {
            $product->categories()->sync($categoryIds);
        }

        // 2. SEO Data
        if ($getMappedValue('meta_title') || $getMappedValue('meta_description') || $getMappedValue('tags')) {
            $product->seo()->create([
                'meta_title' => $getMappedValue('meta_title'),
                'meta_description' => $getMappedValue('meta_description'),
                'tags' => $getMappedValue('tags'),
            ]);
        }

        // 3. Product Details
        if ($getMappedValue('benefits') || $getMappedValue('side_effects') || $getMappedValue('formula')) {
            $product->detail()->create([
                'benefits' => $getMappedValue('benefits'),
                'side_effects' => $getMappedValue('side_effects'),
                'formula' => $getMappedValue('formula'),
            ]);
        }

        // 5. Variants (Format: Name:Price:Stock:SKU,Name2:Price2:Stock2:SKU2)
        $variants = $getMappedValue('variants');
        if (! empty($variants)) {
            $variantItems = explode(',', $variants);
            $toInsert = [];
            foreach ($variantItems as $item) {
                if (trim($item)) {
                    $parts = explode(':', $item);
                    $vName = trim($parts[0] ?? '');
                    if ($vName) {
                        $toInsert[] = [
                            'product_id' => $product->id,
                            'name'       => $vName,
                            'price'      => isset($parts[1]) && trim($parts[1]) !== '' ? (float) trim($parts[1]) : $product->price,
                            'stock'      => isset($parts[2]) && trim($parts[2]) !== '' ? (int) trim($parts[2]) : 0,
                            'sku'        => trim($parts[3] ?? ''),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
            if (!empty($toInsert)) {
                $product->variants()->insert($toInsert);
            }
        }

        // 6. Handle Warehouse Stocks (Format: ID:Qty:LowStock,ID:Qty:LowStock)
        $warehouseStocks = $getMappedValue('warehouse_stocks');
        if (! empty($warehouseStocks)) {
            $stockItems = explode(',', $warehouseStocks);
            $syncData = [];
            $totalStock = 0;

            foreach ($stockItems as $item) {
                if (strpos($item, ':') !== false) {
                    $parts = explode(':', $item);
                    $warehouseId = trim($parts[0] ?? '');
                    $quantity = (int) trim($parts[1] ?? '0');
                    $lowStock = (int) trim($parts[2] ?? '5');

                    if ($warehouseId) {
                        $syncData[$warehouseId] = [
                            'quantity' => $quantity,
                            'low_stock_threshold' => $lowStock,
                        ];
                        $totalStock += $quantity;
                    }
                }
            }

            if (!empty($syncData)) {
                $product->warehouses()->sync($syncData);
                $product->update(['stock' => $totalStock]);
            }
        }

        // 7. Handle Images (From CSV columns or ZIP)
        $primaryImage = $getMappedValue('primary_image');
        $galleryImages = $getMappedValue('gallery_images');
        $sku = $getMappedValue('sku');

        // Helper to find image in ZIP recursively
        $findInZip = function ($filename) {
            if (!$this->imagePath || empty($filename)) return null;
            
            $directPath = $this->imagePath . '/' . $filename;
            if (\Illuminate\Support\Facades\File::exists($directPath)) {
                return $directPath;
            }

            // Search recursively
            $files = \Illuminate\Support\Facades\File::allFiles($this->imagePath);
            foreach ($files as $file) {
                if ($file->getFilename() === $filename) {
                    return $file->getPathname();
                }
            }
            return null;
        };

        // Process Primary Image
        if (! empty($primaryImage)) {
            $foundPath = $findInZip($primaryImage);
            
            if ($foundPath) {
                $savedPath = \App\Support\Media\FileUploader::saveFromPath('products', $foundPath);
                if ($savedPath) {
                    $product->images()->create(['image' => $savedPath, 'is_primary' => 1]);
                }
            } else {
                // Assume it's a URL or direct path
                $product->images()->create(['image' => $primaryImage, 'is_primary' => 1]);
            }
        } elseif ($this->imagePath && ! empty($sku)) {
            // Fallback to SKU matching from ZIP
            $this->attachImagesFromZip($product, $sku);
        }

        // Process Gallery Images
        if (! empty($galleryImages)) {
            $galleryList = explode(',', $galleryImages);
            foreach ($galleryList as $img) {
                $img = trim($img);
                if (empty($img)) continue;

                $foundGalleryPath = $findInZip($img);
                if ($foundGalleryPath) {
                    $savedPath = \App\Support\Media\FileUploader::saveFromPath('products', $foundGalleryPath);
                    if ($savedPath) {
                        $product->images()->create(['image' => $savedPath, 'is_primary' => 0]);
                    }
                } else {
                    $product->images()->create(['image' => $img, 'is_primary' => 0]);
                }
            }
        }
        
        } catch (\Exception $e) {
            Log::error("Failed to import product row {$row->getIndex()}: " . $e->getMessage(), $rowData);
            // We catch the error so that the rest of the import can continue
        }
    }

    protected function attachImagesFromZip($product, $sku)
    {
        $extensions = ['jpg', 'jpeg', 'png', 'webp'];

        foreach ($extensions as $ext) {
            $fileName = $sku.'.'.$ext;
            $filePath = $this->imagePath.'/'.$fileName;

            if (File::exists($filePath)) {
                $savedPath = FileUploader::saveFromPath('products', $filePath);
                if ($savedPath) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $savedPath,
                        'is_primary' => 1,
                    ]);
                }
                break;
            }
        }
    }
}
