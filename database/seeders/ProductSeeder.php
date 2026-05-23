<?php

namespace Database\Seeders;

import App\Models\Category;
import App\Models\Product;
import App\Models\ProductImage;
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
        DB::table('product_categories')->truncate();
        DB::table('product_variants')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Load all categories
        $categories = Category::all()->keyBy('slug');
        $categorySlugs = $categories->keys()->toArray();

        if (empty($categorySlugs)) {
            $this->command->error("No categories found. Please run Category, SubCategory and SubSubCategory seeders first.");
            return;
        }

        // ── Grocery Products Templates ──────────────────────────────────────────
        $templates = [
            ['name' => 'Premium Miniket Rice', 'price' => 390, 'cat' => 'baking-needs'],
            ['name' => 'Deshi Potato (আলু)', 'price' => 50, 'cat' => 'fresh-vegetables'],
            ['name' => 'Deshi Red Onion (পেঁয়াজ)', 'price' => 85, 'cat' => 'fresh-vegetables'],
            ['name' => 'Rupchanda Soybean Oil', 'price' => 830, 'cat' => 'baking-needs'],
            ['name' => 'Fresh Green Lemon (লেবু)', 'price' => 30, 'cat' => 'fresh-vegetables'],
            ['name' => 'Broiler Chicken (dressed)', 'price' => 210, 'cat' => 'chicken-poultry'],
            ['name' => 'Beef Bone-in (গরুর মাংস)', 'price' => 780, 'cat' => 'beef'],
            ['name' => 'Fresh Rui Fish (রুই মাছ)', 'price' => 380, 'cat' => 'fresh-water-fish'],
            ['name' => 'Aarong Liquid Milk', 'price' => 90, 'cat' => 'milk'],
            ['name' => 'Organic Eggs 12 Pcs', 'price' => 145, 'cat' => 'eggs'],
            ['name' => 'Ispahani Mirzapore Tea Bag', 'price' => 165, 'cat' => 'tea-coffee'],
            ['name' => 'Coca-Cola 1.25L', 'price' => 95, 'cat' => 'soft-drinks'],
            ['name' => 'Pran Chanachur Spicy', 'price' => 70, 'cat' => 'snacks'],
            ['name' => 'Dettol Soap Original', 'price' => 95, 'cat' => 'soap-body-wash'],
            ['name' => 'Vim Liquid Dishwash', 'price' => 135, 'cat' => 'dishwashing'],
            ['name' => 'Surf Excel Quick Wash', 'price' => 260, 'cat' => 'laundry'],
            ['name' => 'Fuji Apples Premium', 'price' => 260, 'cat' => 'fresh-fruits'],
            ['name' => 'Pampers Diapers Pants L', 'price' => 1450, 'cat' => 'baby-diapers'],
            ['name' => 'Premium Cashew Nuts (কাজুবাদাম)', 'price' => 450, 'cat' => 'dry-fruits'],
            ['name' => 'Ajwa Dates Premium (আজওয়া খেজুর)', 'price' => 950, 'cat' => 'dry-fruits'],
        ];

        $suffixes = ['Premium', 'Fresh Selection', 'Standard', 'Eco Pack', 'Family Size', 'Budget Selection'];
        $warrantys = ['Freshness Guaranteed', '100% Organic', 'Guaranteed Quality'];

        $count = 0;
        $target = 150; // Seed 150 products for a nice variety
        $tplCount = count($templates);

        while ($count < $target) {
            $tpl = $templates[$count % $tplCount];
            $suffix = $suffixes[rand(0, count($suffixes) - 1)];
            
            // Generate a clean variety name
            $name = $tpl['name'] . ' ' . $suffix;
            if ($count < $tplCount) {
                // Keep the first round exactly as in templates for predictability
                $name = $tpl['name'];
            }
            
            $price = $tpl['price'] + rand(-5, 15);
            $price = max(10, $price); // Ensure it's never too cheap
            $discount = rand(0, 4) === 0 ? (int)($price * 0.9) : null; // 20% chance of 10% discount

            $catSlug = $tpl['cat'];
            $targetCategory = $categories->get($catSlug);

            if (!$targetCategory) {
                // Fallback to random category if template slug is invalid
                $catSlug = $categorySlugs[array_rand($categorySlugs)];
                $targetCategory = $categories->get($catSlug);
            }

            // Resolve Category Hierarchy: Category -> Sub -> Sub-sub
            $categoryId = null;
            $subCategoryId = null;
            $subSubCategoryId = null;

            if ($targetCategory) {
                if ($targetCategory->parent_id !== null) {
                    $parent = Category::find($targetCategory->parent_id);
                    if ($parent && $parent->parent_id !== null) {
                        // This is a sub-subcategory
                        $subSubCategoryId = $targetCategory->id;
                        $subCategoryId = $parent->id;
                        $categoryId = $parent->parent_id;
                    } else {
                        // This is a subcategory
                        $subSubCategoryId = null;
                        $subCategoryId = $targetCategory->id;
                        $categoryId = $targetCategory->parent_id;
                    }
                } else {
                    // This is a root category
                    $subSubCategoryId = null;
                    $subCategoryId = null;
                    $categoryId = $targetCategory->id;
                }
            }

            $product = Product::create([
                'name'                => $name,
                'slug'                => Str::slug($name) . '-' . $count . '-' . Str::random(4),
                'sku'                 => 'GRO-' . strtoupper(Str::random(8)),
                'brand_id'            => null, // Brands not required for Grocery Management System
                'category_id'         => $categoryId,
                'sub_category_id'     => $subCategoryId,
                'sub_sub_category_id' => $subSubCategoryId,
                'description'         => "Buy fresh and authentic {$name} online. Selected carefully for the best quality and value.",
                'price'               => $price,
                'discount_price'      => $discount,
                'stock'               => rand(50, 500),
                'status'              => 1,
                'is_featured'         => rand(0, 5) === 0, // 1 in 6 is featured
                'warranty'            => $warrantys[array_rand($warrantys)],
            ]);

            // Sync categories pivot
            $syncIds = array_filter([$categoryId, $subCategoryId, $subSubCategoryId]);
            $product->categories()->sync($syncIds);

            // Set placeholder image
            ProductImage::create([
                'product_id' => $product->id,
                'image'      => "https://placehold.co/500x500/2e7d32/ffffff?text=" . urlencode(Str::limit($name, 20)),
                'is_primary' => 1,
            ]);



            // Create Variants for some products randomly
            if (rand(0, 1) === 1) {
                $product->variants()->createMany([
                    ['name' => 'Weight - 500g', 'price' => $price * 0.5, 'stock' => rand(10, 50), 'sku' => $product->sku . '-500G'],
                    ['name' => 'Weight - 1kg', 'price' => $price, 'stock' => rand(10, 50), 'sku' => $product->sku . '-1KG'],
                ]);
            }

            $count++;
        }

        $this->command->info("✅ Seeded {$count} grocery products successfully.");
    }
}
