<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Blog;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $blogs = [
            [
                'title' => 'Top 10 Laptops for Programming in 2024',
                'slug' => 'top-10-laptops-for-programming-in-2024',
                'content' => 'Programming requires a reliable laptop with good processing power, comfortable keyboard, and sufficient RAM. Here is our curated list of the top 10 laptops for developers this year...',
                'is_active' => true,
                'meta_title' => 'Best Laptops for Coders 2024',
                'meta_description' => 'Find the best laptop for your programming needs with our top 10 guide.'
            ],
            [
                'title' => 'How to Choose the Right Graphics Card',
                'slug' => 'how-to-choose-the-right-graphics-card',
                'content' => 'Building a PC? Upgrading your rig? Choosing the right GPU is critical for gaming and rendering tasks. We compare NVIDIA and AMD latest offerings...',
                'is_active' => true,
                'meta_title' => 'GPU Buying Guide',
                'meta_description' => 'A complete guide to choosing the best graphics card for your budget.'
            ],
            [
                'title' => 'The Future of AI in E-commerce',
                'slug' => 'future-of-ai-in-ecommerce',
                'content' => 'Artificial intelligence is reshaping how we shop online. From personalized recommendations to automated customer support, see what the future holds...',
                'is_active' => true,
                'meta_title' => 'AI in Online Shopping',
                'meta_description' => 'Discover how AI is changing the landscape of e-commerce and retail.'
            ]
        ];

        foreach ($blogs as $blog) {
            Blog::updateOrCreate(['slug' => $blog['slug']], $blog);
        }
    }
}
