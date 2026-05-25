<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GroginDummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('Creating 500 REALISTIC Grocery Products...');
        
        // Clear old dummy products
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        ProductImage::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [1, 2, 3]; // Assuming some categories exist
        $brands = [1, 2, 3]; // Assuming some brands exist

        // Real Grocery/Food Images from Unsplash
        $groceryItems = [
            [
                'name' => 'Fresh Organic Apples',
                'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Organic Orange Pack',
                'image' => 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Yellow Bananas Bunch',
                'image' => 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Fresh Green Vegetables',
                'image' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Premium Raw Beef',
                'image' => 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Fresh Baked Bread',
                'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Roasted Coffee Beans',
                'image' => 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Fresh Dairy Milk',
                'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Organic Strawberries',
                'image' => 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Mixed Nuts & Almonds',
                'image' => 'https://images.unsplash.com/photo-1536584754829-12214d404f52?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Extra Virgin Olive Oil',
                'image' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Organic Raw Honey',
                'image' => 'https://images.unsplash.com/photo-1587049352847-81a56d773c16?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Fresh Red Tomatoes',
                'image' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Green Avocados',
                'image' => 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'
            ],
            [
                'name' => 'Whole Wheat Pasta',
                'image' => 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'
            ]
        ];

        for ($i = 1; $i <= 500; $i++) {
            $item = $groceryItems[array_rand($groceryItems)];
            $name = $item['name'] . ' ' . rand(100, 999) . 'g';
            
            $price = rand(50, 1500);
            $hasDiscount = rand(0, 1) === 1;
            $discountPrice = $hasDiscount ? $price - rand(10, 30) : null;

            // Create Product
            $product = Product::create([
                'name' => $name,
                'slug' => Str::slug($name) . '-' . Str::random(5),
                'sku' => 'GRG-' . strtoupper(Str::random(6)),
                'brand_id' => $brands[array_rand($brands)],
                'category_id' => $categories[array_rand($categories)],
                'description' => '<p>This high-quality grocery product is freshly sourced and designed to meet your everyday dietary needs. Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora.</p>',
                'price' => $price,
                'discount_price' => $discountPrice,
                'stock' => rand(20, 500),
                'status' => 1,
            ]);

            // Add Primary Image
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $item['image'],
                'is_primary' => 1,
            ]);
            
            // Progress output every 50 products
            if ($i % 50 === 0) {
                $this->command->info("Generated {$i}/500 products...");
            }
        }

        $this->command->info('Successfully seeded 500 grocery products!');
    }
}
