<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Food', 
                'image' => 'https://api.iconify.design/lucide:shopping-bag.svg',
                'children' => [
                    [
                        'name' => 'Fruits & Vegetables',
                        'children' => [
                            ['name' => 'Fresh Fruits'],
                            ['name' => 'Fresh Vegetables'],
                            ['name' => 'Dry Fruits'],
                            ['name' => 'Dry Vegetables'],
                        ]
                    ],
                    [
                        'name' => 'Meat & Fish',
                        'children' => [
                            ['name' => 'Chicken & Poultry'],
                            ['name' => 'Beef'],
                            ['name' => 'Mutton & Lamb'],
                            ['name' => 'Fresh Water Fish'],
                            ['name' => 'Sea Fish'],
                            ['name' => 'Dry Fish'],
                        ]
                    ],
                    [
                        'name' => 'Baking Needs',
                        'children' => [
                            ['name' => 'Flour'],
                            ['name' => 'Sugar'],
                            ['name' => 'Baking Powder & Yeast'],
                            ['name' => 'Food Color & Essence'],
                        ]
                    ],
                    [
                        'name' => 'Drinks',
                        'children' => [
                            ['name' => 'Water'],
                            ['name' => 'Juice'],
                            ['name' => 'Soft Drinks'],
                            ['name' => 'Tea & Coffee'],
                        ]
                    ],
                    [
                        'name' => 'Dairy',
                        'children' => [
                            ['name' => 'Milk'],
                            ['name' => 'Butter & Sour Cream'],
                            ['name' => 'Cheese'],
                            ['name' => 'Yogurt'],
                        ]
                    ],
                    [
                        'name' => 'Breakfast', 
                        'children' => [
                            ['name' => 'Breads'],
                            ['name' => 'Cereals'],
                            ['name' => 'Oats'],
                            ['name' => 'Honey & Spreads'],
                        ]
                    ],
                    [
                        'name' => 'Frozen', 
                        'children' => [
                            ['name' => 'Frozen Fish & Meat'],
                            ['name' => 'Frozen Snacks'],
                            ['name' => 'Frozen Vegetables'],
                        ]
                    ],
                    ['name' => 'Snacks', 'image' => 'https://api.iconify.design/lucide:cookie.svg'],
                    ['name' => 'Canned Food', 'image' => 'https://api.iconify.design/lucide:container.svg'],
                    ['name' => 'Candy & Chocolate', 'image' => 'https://api.iconify.design/lucide:candy.svg'],
                    ['name' => 'Eggs', 'image' => 'https://api.iconify.design/lucide:egg.svg'],
                    ['name' => 'Ice Cream', 'image' => 'https://api.iconify.design/lucide:ice-cream.svg'],
                ]
            ],
            [
                'name' => 'Baby Food & Care', 
                'image' => 'https://api.iconify.design/lucide:baby.svg',
                'children' => [
                    ['name' => 'Baby Food', 'image' => 'https://api.iconify.design/lucide:baby.svg'],
                    ['name' => 'Baby Skincare', 'image' => 'https://api.iconify.design/lucide:sparkles.svg'],
                    ['name' => 'Baby Oral Care', 'image' => 'https://api.iconify.design/lucide:smile.svg'],
                    ['name' => 'Baby Accessories', 'image' => 'https://api.iconify.design/lucide:stroller.svg'],
                ]
            ],
            [
                'name' => 'Home Cleaning', 
                'image' => 'https://api.iconify.design/lucide:brush.svg',
                'children' => [
                    ['name' => 'Dishwashing', 'image' => 'https://api.iconify.design/lucide:droplet.svg'],
                    ['name' => 'Laundry', 'image' => 'https://api.iconify.design/lucide:shirt.svg'],
                    ['name' => 'Floor Cleaners', 'image' => 'https://api.iconify.design/lucide:brush.svg'],
                    ['name' => 'Toilet Cleaners'],
                    ['name' => 'Pest Control'],
                ]
            ],
            [
                'name' => 'Beauty & Health', 
                'image' => 'https://api.iconify.design/lucide:sparkles.svg',
                'children' => [
                    [
                        'name' => 'Hair Care', 
                        'children' => [
                            ['name' => 'Shampoo'],
                            ['name' => 'Conditioner'],
                            ['name' => 'Hair Oil'],
                            ['name' => 'Hair Color'],
                        ]
                    ],
                    [
                        'name' => 'Skin Care', 
                        'children' => [
                            ['name' => 'Face Wash'],
                            ['name' => 'Lotions & Creams'],
                            ['name' => 'Soap & Body Wash'],
                        ]
                    ],
                    [
                        'name' => 'Oral Care', 
                        'children' => [
                            ['name' => 'Toothpaste'],
                            ['name' => 'Toothbrush'],
                            ['name' => 'Mouthwash'],
                        ]
                    ],
                    [
                        'name' => 'Healthcare', 
                        'children' => [
                            ['name' => 'First Aid'],
                            ['name' => 'Antiseptics'],
                            ['name' => 'Supplements'],
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Pet Care', 
                'image' => 'https://api.iconify.design/lucide:dog.svg',
                'children' => [
                    ['name' => 'Cat Food'],
                    ['name' => 'Dog Food'],
                    ['name' => 'Pet Accessories'],
                ]
            ],
            [
                'name' => 'Stationeries', 
                'image' => 'https://api.iconify.design/lucide:pen-tool.svg',
                'children' => [
                    ['name' => 'Pens & Pencils'],
                    ['name' => 'Notebooks & Papers'],
                    ['name' => 'Art Supplies'],
                    ['name' => 'Office Supplies'],
                ]
            ],
            [
                'name' => 'Gadget', 
                'image' => 'https://api.iconify.design/lucide:smartphone.svg',
                'children' => [
                    ['name' => 'Mobile Accessories'],
                    ['name' => 'Headphones'],
                    ['name' => 'Smartwatches'],
                ]
            ],
            [
                'name' => 'Diapers', 
                'image' => 'https://api.iconify.design/lucide:baby.svg',
                'children' => [
                    ['name' => 'Baby Diapers'],
                    ['name' => 'Adult Diapers'],
                    ['name' => 'Wipes'],
                ]
            ],
            [
                'name' => 'Fashion & Lifestyle', 
                'image' => 'https://api.iconify.design/lucide:shirt.svg',
                'children' => [
                    [
                        'name' => 'Mens Fashion',
                        'children' => [
                            ['name' => 'Shirts & T-shirts'],
                            ['name' => 'Pants & Jeans'],
                            ['name' => 'Shoes'],
                        ]
                    ],
                    [
                        'name' => 'Womens Fashion',
                        'children' => [
                            ['name' => 'Dresses'],
                            ['name' => 'Sarees & Kurtis'],
                            ['name' => 'Bags & Accessories'],
                        ]
                    ],
                    ['name' => 'Kids Fashion'],
                    ['name' => 'Watches & Jewelry'],
                ]
            ],
            [
                'name' => 'Home & Kitchen', 
                'image' => 'https://api.iconify.design/lucide:utensils.svg',
                'children' => [
                    ['name' => 'Cookware', 'image' => 'https://api.iconify.design/lucide:chef-hat.svg', 'children' => [
                        ['name' => 'Pots & Pans'],
                        ['name' => 'Kitchen Tools'],
                    ]],
                    ['name' => 'Tableware', 'image' => 'https://api.iconify.design/lucide:utensils.svg', 'children' => [
                        ['name' => 'Plates & Bowls'],
                        ['name' => 'Glasses & Mugs'],
                    ]],
                    ['name' => 'Home Decor'],
                    ['name' => 'Bed & Bath'],
                ]
            ],
            [
                'name' => 'Toys & Sports', 
                'image' => 'https://api.iconify.design/lucide:gamepad-2.svg',
                'children' => [
                    ['name' => 'Action Figures'],
                    ['name' => 'Board Games'],
                    ['name' => 'Dolls'],
                    ['name' => 'Outdoor Sports', 'image' => 'https://api.iconify.design/lucide:tent.svg', 'children' => [
                        ['name' => 'Cricket'],
                        ['name' => 'Football'],
                        ['name' => 'Badminton'],
                    ]],
                    ['name' => 'Fitness Accessories'],
                ]
            ],
        ];

        // Recursive function to create categories
        $createCategory = function ($categoryData, $parentId = null) use (&$createCategory) {
            // Default icon for sub and sub-sub categories if not explicitly set
            $fallbackIcon = 'https://api.iconify.design/lucide:circle-dot.svg';

            $cat = Category::updateOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'], 
                    'status' => 1, 
                    'parent_id' => $parentId,
                    'image' => $categoryData['image'] ?? $fallbackIcon
                ]
            );

            if (isset($categoryData['children'])) {
                foreach ($categoryData['children'] as $childData) {
                    $createCategory($childData, $cat->id);
                }
            }
        };

        foreach ($categories as $cat) {
            $createCategory($cat);
        }
    }
}


