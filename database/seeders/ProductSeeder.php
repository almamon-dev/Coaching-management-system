<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Support\Media\FileUploader;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        ProductImage::truncate();
        DB::table('product_categories')->truncate();
        DB::table('product_variants')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = Category::all()->keyBy('id');
        $brands = \App\Models\Brand::pluck('id')->toArray();

        if ($categories->isEmpty()) {
            $this->command->error("No categories found. Please run Category seeders first.");
            return;
        }

        $warrantys = ['Freshness Guaranteed', '100% Organic', 'Guaranteed Quality'];
        
        $modifiers = ['Premium', 'Fresh', 'Organic', 'Deshi', 'Farm Fresh', 'High Quality', 'Standard'];
        $weights = ['500g', '1kg', '250g', '1 Dozen', '1L', '500ml'];

        $count = 0;

        foreach ($categories as $category) {
            $categoryId = null;
            $subCategoryId = null;
            $subSubCategoryId = null;

            if ($category->parent_id !== null) {
                $parent = $categories->get($category->parent_id);
                if ($parent && $parent->parent_id !== null) {
                    $subSubCategoryId = $category->id;
                    $subCategoryId = $parent->id;
                    $categoryId = $parent->parent_id;
                } else {
                    $subSubCategoryId = null;
                    $subCategoryId = $category->id;
                    $categoryId = $category->parent_id;
                }
            } else {
                $subSubCategoryId = null;
                $subCategoryId = null;
                $categoryId = $category->id;
            }

            // Parse category name (handling JSON if it is stored as JSON for translations)
            $catNameRaw = is_string($category->name) && str_starts_with($category->name, '{') 
                ? json_decode($category->name, true)['en'] ?? $category->name 
                : $category->name;
            
            // Clean up the name
            if (is_array($catNameRaw)) {
                $catNameRaw = $catNameRaw['en'] ?? 'Product';
            }

            // Create 10 products for this category node
            for ($i = 1; $i <= 10; $i++) {
                $modifier = $modifiers[array_rand($modifiers)];
                $weight = $weights[array_rand($weights)];
                
                $name = "{$modifier} {$catNameRaw} ({$weight}) - Item {$i}";
                
                $price = rand(40, 1200);
                $hasDiscount = rand(0, 3) === 0;
                $discountPrice = $hasDiscount ? (int)($price * 0.85) : null;
                $discountType = $hasDiscount ? 'percentage' : null;
                $discountValue = $hasDiscount ? 15 : null;
                
                $product = Product::create([
                    'name'                => $name,
                    'slug'                => Str::slug($name) . '-' . $category->id . '-' . $i . '-' . Str::random(4),
                    'sku'                 => 'GRO-' . strtoupper(Str::random(8)),
                    'brand_id'            => empty($brands) ? null : $brands[array_rand($brands)],
                    'category_id'         => $categoryId,
                    'sub_category_id'     => $subCategoryId,
                    'sub_sub_category_id' => $subSubCategoryId,
                    'description'         => "Buy {$modifier} {$catNameRaw} online. Selected carefully for the best quality and value. Guaranteed freshness delivered to your door.",
                    'price'               => $price,
                    'discount_price'      => $discountPrice,
                    'discount_type'       => $discountType,
                    'discount_value'      => $discountValue,
                    'stock'               => rand(20, 200),
                    'status'              => 1,
                    'is_featured'         => rand(0, 5) === 0,
                    'warranty'            => $warrantys[array_rand($warrantys)],
                ]);

                // Sync categories pivot
                $syncIds = array_filter([$categoryId, $subCategoryId, $subSubCategoryId]);
                $product->categories()->sync($syncIds);

                // Image and Gallery based on category matching
                $nodeId = $category->id;
                
                // Try specific category first
                $imageFiles = glob(public_path("images/products/cat_{$nodeId}_*.png"));
                
                // Fallback to sub-category parent
                if (empty($imageFiles) && $subCategoryId) {
                    $imageFiles = glob(public_path("images/products/cat_{$subCategoryId}_*.png"));
                }
                
                // Fallback to root category parent
                if (empty($imageFiles) && $categoryId) {
                    $imageFiles = glob(public_path("images/products/cat_{$categoryId}_*.png"));
                }
                
                // Final fallback to any PNG or WebP
                if (empty($imageFiles)) {
                    $imageFiles = glob(public_path('images/products/*.{png,jpg,jpeg,webp}'), GLOB_BRACE);
                }
                if (count($imageFiles) > 0) {
                    shuffle($imageFiles); // Randomize images
                    
                    // Primary image
                    $primaryFile = array_shift($imageFiles);
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => \App\Support\Media\FileUploader::saveFromPath('products', $primaryFile),
                        'is_primary' => 1,
                    ]);

                    // Gallery images (assign up to 3 more images as gallery)
                    $galleryCount = min(rand(1, 3), count($imageFiles));
                    for ($g = 0; $g < $galleryCount; $g++) {
                        $galleryFile = array_shift($imageFiles);
                        ProductImage::create([
                            'product_id' => $product->id,
                            'image'      => \App\Support\Media\FileUploader::saveFromPath('products', $galleryFile),
                            'is_primary' => 0,
                        ]);
                    }
                } else {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => "https://placehold.co/500x500/10b981/ffffff?text=" . urlencode(Str::limit($catNameRaw, 10)),
                        'is_primary' => 1,
                    ]);
                }

                // Variants
                if (rand(0, 2) === 0) {
                    $product->variants()->createMany([
                        ['name' => 'Small Pack', 'price' => $price * 0.5, 'stock' => rand(10, 50), 'sku' => $product->sku . '-SML'],
                        ['name' => 'Family Pack', 'price' => $price * 1.5, 'stock' => rand(10, 50), 'sku' => $product->sku . '-FAM'],
                    ]);
                }

                $count++;
            }
        }

        $this->command->info("✅ Seeded {$count} grocery products (10 per category node) successfully.");
    }
}
