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
                'name' => ['en' => 'Food', 'bn' => 'খাদ্য'], 
                'image' => 'https://api.iconify.design/lucide:shopping-bag.svg',
                'children' => [
                    [
                        'name' => ['en' => 'Fruits & Vegetables', 'bn' => 'ফল ও শাকসবজি'],
                        'children' => [
                            ['name' => ['en' => 'Fresh Fruits', 'bn' => 'তাজা ফল']],
                            ['name' => ['en' => 'Fresh Vegetables', 'bn' => 'তাজা শাকসবজি']],
                            ['name' => ['en' => 'Dry Fruits', 'bn' => 'শুকনো ফল']],
                            ['name' => ['en' => 'Dry Vegetables', 'bn' => 'শুকনো শাকসবজি']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Meat & Fish', 'bn' => 'মাংস ও মাছ'],
                        'children' => [
                            ['name' => ['en' => 'Chicken & Poultry', 'bn' => 'মুরগি ও পোলট্রি']],
                            ['name' => ['en' => 'Beef', 'bn' => 'গরুর মাংস']],
                            ['name' => ['en' => 'Mutton & Lamb', 'bn' => 'খাসির মাংস']],
                            ['name' => ['en' => 'Fresh Water Fish', 'bn' => 'মিঠা পানির মাছ']],
                            ['name' => ['en' => 'Sea Fish', 'bn' => 'সামুদ্রিক মাছ']],
                            ['name' => ['en' => 'Dry Fish', 'bn' => 'শুঁটকি মাছ']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Baking Needs', 'bn' => 'বেকিং আইটেম'],
                        'children' => [
                            ['name' => ['en' => 'Flour', 'bn' => 'আটা ও ময়দা']],
                            ['name' => ['en' => 'Sugar', 'bn' => 'চিনি']],
                            ['name' => ['en' => 'Baking Powder & Yeast', 'bn' => 'বেকিং পাউডার ও ইস্ট']],
                            ['name' => ['en' => 'Food Color & Essence', 'bn' => 'ফুড কালার ও এসেন্স']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Drinks', 'bn' => 'পানীয়'],
                        'children' => [
                            ['name' => ['en' => 'Water', 'bn' => 'পানি']],
                            ['name' => ['en' => 'Juice', 'bn' => 'জুস']],
                            ['name' => ['en' => 'Soft Drinks', 'bn' => 'সফট ড্রিংকস']],
                            ['name' => ['en' => 'Tea & Coffee', 'bn' => 'চা ও কফি']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Dairy', 'bn' => 'ডেইরি'],
                        'children' => [
                            ['name' => ['en' => 'Milk', 'bn' => 'দুধ']],
                            ['name' => ['en' => 'Butter & Sour Cream', 'bn' => 'মাখন ও টক দই']],
                            ['name' => ['en' => 'Cheese', 'bn' => 'পনির']],
                            ['name' => ['en' => 'Yogurt', 'bn' => 'দই']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Breakfast', 'bn' => 'সকালের নাস্তা'], 
                        'children' => [
                            ['name' => ['en' => 'Breads', 'bn' => 'পাউরুটি']],
                            ['name' => ['en' => 'Cereals', 'bn' => 'সিরিয়াল']],
                            ['name' => ['en' => 'Oats', 'bn' => 'ওটস']],
                            ['name' => ['en' => 'Honey & Spreads', 'bn' => 'মধু ও স্প্রেড']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Frozen', 'bn' => 'ফ্রোজেন'], 
                        'children' => [
                            ['name' => ['en' => 'Frozen Fish & Meat', 'bn' => 'ফ্রোজেন মাছ ও মাংস']],
                            ['name' => ['en' => 'Frozen Snacks', 'bn' => 'ফ্রোজেন স্ন্যাকস']],
                            ['name' => ['en' => 'Frozen Vegetables', 'bn' => 'ফ্রোজেন শাকসবজি']],
                        ]
                    ],
                    ['name' => ['en' => 'Snacks', 'bn' => 'স্ন্যাকস'], 'image' => 'https://api.iconify.design/lucide:cookie.svg'],
                    ['name' => ['en' => 'Canned Food', 'bn' => 'ক্যানড ফুড'], 'image' => 'https://api.iconify.design/lucide:container.svg'],
                    ['name' => ['en' => 'Candy & Chocolate', 'bn' => 'ক্যান্ডি ও চকলেট'], 'image' => 'https://api.iconify.design/lucide:candy.svg'],
                    ['name' => ['en' => 'Eggs', 'bn' => 'ডিম'], 'image' => 'https://api.iconify.design/lucide:egg.svg'],
                    ['name' => ['en' => 'Ice Cream', 'bn' => 'আইসক্রিম'], 'image' => 'https://api.iconify.design/lucide:ice-cream.svg'],
                ]
            ],
            [
                'name' => ['en' => 'Baby Food & Care', 'bn' => 'বেবি ফুড ও কেয়ার'], 
                'image' => 'https://api.iconify.design/lucide:baby.svg',
                'children' => [
                    ['name' => ['en' => 'Baby Food', 'bn' => 'বেবি ফুড'], 'image' => 'https://api.iconify.design/lucide:baby.svg'],
                    ['name' => ['en' => 'Baby Skincare', 'bn' => 'বেবি স্কিনকেয়ার'], 'image' => 'https://api.iconify.design/lucide:sparkles.svg'],
                    ['name' => ['en' => 'Baby Oral Care', 'bn' => 'বেবি ওরাল কেয়ার'], 'image' => 'https://api.iconify.design/lucide:smile.svg'],
                    ['name' => ['en' => 'Baby Accessories', 'bn' => 'বেবি অ্যাকসেসরিজ'], 'image' => 'https://api.iconify.design/lucide:stroller.svg'],
                ]
            ],
            [
                'name' => ['en' => 'Home Cleaning', 'bn' => 'হোম ক্লিনিং'], 
                'image' => 'https://api.iconify.design/lucide:brush.svg',
                'children' => [
                    ['name' => ['en' => 'Dishwashing', 'bn' => 'ডিশওয়াশিং'], 'image' => 'https://api.iconify.design/lucide:droplet.svg'],
                    ['name' => ['en' => 'Laundry', 'bn' => 'লন্ড্রি'], 'image' => 'https://api.iconify.design/lucide:shirt.svg'],
                    ['name' => ['en' => 'Floor Cleaners', 'bn' => 'ফ্লোর ক্লিনার'], 'image' => 'https://api.iconify.design/lucide:brush.svg'],
                    ['name' => ['en' => 'Toilet Cleaners', 'bn' => 'টয়লেট ক্লিনার']],
                    ['name' => ['en' => 'Pest Control', 'bn' => 'পেস্ট কন্ট্রোল']],
                ]
            ],
            [
                'name' => ['en' => 'Beauty & Health', 'bn' => 'রূপচর্চা ও স্বাস্থ্য'], 
                'image' => 'https://api.iconify.design/lucide:sparkles.svg',
                'children' => [
                    [
                        'name' => ['en' => 'Hair Care', 'bn' => 'হেয়ার কেয়ার'], 
                        'children' => [
                            ['name' => ['en' => 'Shampoo', 'bn' => 'শ্যাম্পু']],
                            ['name' => ['en' => 'Conditioner', 'bn' => 'কন্ডিশনার']],
                            ['name' => ['en' => 'Hair Oil', 'bn' => 'হেয়ার অয়েল']],
                            ['name' => ['en' => 'Hair Color', 'bn' => 'হেয়ার কালার']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Skin Care', 'bn' => 'স্কিন কেয়ার'], 
                        'children' => [
                            ['name' => ['en' => 'Face Wash', 'bn' => 'ফেসওয়াশ']],
                            ['name' => ['en' => 'Lotions & Creams', 'bn' => 'লোশন ও ক্রিম']],
                            ['name' => ['en' => 'Soap & Body Wash', 'bn' => 'সাবান ও বডি ওয়াশ']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Oral Care', 'bn' => 'ওরাল কেয়ার'], 
                        'children' => [
                            ['name' => ['en' => 'Toothpaste', 'bn' => 'টুথপেস্ট']],
                            ['name' => ['en' => 'Toothbrush', 'bn' => 'টুথব্রাশ']],
                            ['name' => ['en' => 'Mouthwash', 'bn' => 'মাউথওয়াশ']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Healthcare', 'bn' => 'স্বাস্থ্যসেবা'], 
                        'children' => [
                            ['name' => ['en' => 'First Aid', 'bn' => 'ফার্স্ট এইড']],
                            ['name' => ['en' => 'Antiseptics', 'bn' => 'অ্যান্টিসেপটিকস']],
                            ['name' => ['en' => 'Supplements', 'bn' => 'সাপ্লিমেন্টস']],
                        ]
                    ],
                ]
            ],
            [
                'name' => ['en' => 'Pet Care', 'bn' => 'পেট কেয়ার'], 
                'image' => 'https://api.iconify.design/lucide:dog.svg',
                'children' => [
                    ['name' => ['en' => 'Cat Food', 'bn' => 'ক্যাট ফুড']],
                    ['name' => ['en' => 'Dog Food', 'bn' => 'ডগ ফুড']],
                    ['name' => ['en' => 'Pet Accessories', 'bn' => 'পেট অ্যাকসেসরিজ']],
                ]
            ],
            [
                'name' => ['en' => 'Stationeries', 'bn' => 'স্টেশনারি'], 
                'image' => 'https://api.iconify.design/lucide:pen-tool.svg',
                'children' => [
                    ['name' => ['en' => 'Pens & Pencils', 'bn' => 'কলম ও পেন্সিল']],
                    ['name' => ['en' => 'Notebooks & Papers', 'bn' => 'নোটবুক ও কাগজ']],
                    ['name' => ['en' => 'Art Supplies', 'bn' => 'আর্ট সাপ্লাই']],
                    ['name' => ['en' => 'Office Supplies', 'bn' => 'অফিস সাপ্লাই']],
                ]
            ],
            [
                'name' => ['en' => 'Gadget', 'bn' => 'গ্যাজেট'], 
                'image' => 'https://api.iconify.design/lucide:smartphone.svg',
                'children' => [
                    ['name' => ['en' => 'Mobile Accessories', 'bn' => 'মোবাইল অ্যাকসেসরিজ']],
                    ['name' => ['en' => 'Headphones', 'bn' => 'হেডফোন']],
                    ['name' => ['en' => 'Smartwatches', 'bn' => 'স্মার্টওয়াচ']],
                ]
            ],
            [
                'name' => ['en' => 'Diapers', 'bn' => 'ডায়াপার'], 
                'image' => 'https://api.iconify.design/lucide:baby.svg',
                'children' => [
                    ['name' => ['en' => 'Baby Diapers', 'bn' => 'বেবি ডায়াপার']],
                    ['name' => ['en' => 'Adult Diapers', 'bn' => 'অ্যাডাল্ট ডায়াপার']],
                    ['name' => ['en' => 'Wipes', 'bn' => 'ওয়াইপস']],
                ]
            ],
            [
                'name' => ['en' => 'Fashion & Lifestyle', 'bn' => 'ফ্যাশন ও লাইফস্টাইল'], 
                'image' => 'https://api.iconify.design/lucide:shirt.svg',
                'children' => [
                    [
                        'name' => ['en' => 'Mens Fashion', 'bn' => 'ছেলেদের ফ্যাশন'],
                        'children' => [
                            ['name' => ['en' => 'Shirts & T-shirts', 'bn' => 'শার্ট ও টি-শার্ট']],
                            ['name' => ['en' => 'Pants & Jeans', 'bn' => 'প্যান্ট ও জিন্স']],
                            ['name' => ['en' => 'Shoes', 'bn' => 'জুতো']],
                        ]
                    ],
                    [
                        'name' => ['en' => 'Womens Fashion', 'bn' => 'মেয়েদের ফ্যাশন'],
                        'children' => [
                            ['name' => ['en' => 'Dresses', 'bn' => 'পোশাক']],
                            ['name' => ['en' => 'Sarees & Kurtis', 'bn' => 'শাড়ি ও কুর্তি']],
                            ['name' => ['en' => 'Bags & Accessories', 'bn' => 'ব্যাগ ও অ্যাকসেসরিজ']],
                        ]
                    ],
                    ['name' => ['en' => 'Kids Fashion', 'bn' => 'বাচ্চাদের ফ্যাশন']],
                    ['name' => ['en' => 'Watches & Jewelry', 'bn' => 'ঘড়ি ও গহনা']],
                ]
            ],
            [
                'name' => ['en' => 'Home & Kitchen', 'bn' => 'হোম ও কিচেন'], 
                'image' => 'https://api.iconify.design/lucide:utensils.svg',
                'children' => [
                    ['name' => ['en' => 'Cookware', 'bn' => 'কুকওয়্যার'], 'image' => 'https://api.iconify.design/lucide:chef-hat.svg', 'children' => [
                        ['name' => ['en' => 'Pots & Pans', 'bn' => 'হাঁড়ি ও কড়াই']],
                        ['name' => ['en' => 'Kitchen Tools', 'bn' => 'রান্নাঘরের সরঞ্জাম']],
                    ]],
                    ['name' => ['en' => 'Tableware', 'bn' => 'টেবিলওয়্যার'], 'image' => 'https://api.iconify.design/lucide:utensils.svg', 'children' => [
                        ['name' => ['en' => 'Plates & Bowls', 'bn' => 'প্লেট ও বাটি']],
                        ['name' => ['en' => 'Glasses & Mugs', 'bn' => 'গ্লাস ও মগ']],
                    ]],
                    ['name' => ['en' => 'Home Decor', 'bn' => 'হোম ডেকোর']],
                    ['name' => ['en' => 'Bed & Bath', 'bn' => 'বিছানা ও বাথরুম']],
                ]
            ],
            [
                'name' => ['en' => 'Toys & Sports', 'bn' => 'খেলনা ও খেলাধুলা'], 
                'image' => 'https://api.iconify.design/lucide:gamepad-2.svg',
                'children' => [
                    ['name' => ['en' => 'Action Figures', 'bn' => 'অ্যাকশন ফিগার']],
                    ['name' => ['en' => 'Board Games', 'bn' => 'বোর্ড গেম']],
                    ['name' => ['en' => 'Dolls', 'bn' => 'পুতুল']],
                    ['name' => ['en' => 'Outdoor Sports', 'bn' => 'আউটডোর স্পোর্টস'], 'image' => 'https://api.iconify.design/lucide:tent.svg', 'children' => [
                        ['name' => ['en' => 'Cricket', 'bn' => 'ক্রিকেট']],
                        ['name' => ['en' => 'Football', 'bn' => 'ফুটবল']],
                        ['name' => ['en' => 'Badminton', 'bn' => 'ব্যাডমিন্টন']],
                    ]],
                    ['name' => ['en' => 'Fitness Accessories', 'bn' => 'ফিটনেস অ্যাকসেসরিজ']],
                ]
            ],
        ];

        // Recursive function to create categories
        $createCategory = function ($categoryData, $parentId = null) use (&$createCategory) {
            // Default icon for sub and sub-sub categories if not explicitly set
            $fallbackIcon = 'https://api.iconify.design/lucide:circle-dot.svg';
            
            // Extract English name for the slug
            $englishName = is_array($categoryData['name']) ? $categoryData['name']['en'] : $categoryData['name'];

            $cat = Category::updateOrCreate(
                ['slug' => Str::slug($englishName)],
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
