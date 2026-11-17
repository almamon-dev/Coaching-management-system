<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::truncate();

        $testimonials = [
            [
                'name' => 'Ariful Islam',
                'batch' => 'HSC Science Batch',
                'institution' => 'Dhaka College',
                'badge' => 'GPA 5.00 (Golden A+)',
                'quote' => 'ফিজিক্স ও হায়ার ম্যাথের কঠিন বিষয়গুলো এত সহজভাবে বুঝিয়ে দেওয়া হয়েছিল যে পরীক্ষার সময় কোনো সমস্যাই হয়নি। রেগুলার মডেল টেস্ট আমাকে বোর্ড পরীক্ষায় আত্মবিশ্বাসী করে তোলে।',
                'initials' => 'AI',
                'color' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'name' => 'Tasmia Rahman',
                'batch' => 'SSC Science Batch',
                'institution' => 'Viqarunnisa Noon School',
                'badge' => 'GPA 5.00 & Board Top',
                'quote' => 'স্যারের পার্সোনাল কেয়ার আর প্রশ্ন সমাধানের শর্টকাট টেকনিকগুলো অসাধারণ ছিল। প্রতিটি ক্লাসের পর প্রবলেম সলভিং সেশন আমাকে গণিতে শতভাগ নম্বর পেতে দারুণ সাহায্য করেছে।',
                'initials' => 'TR',
                'color' => 'bg-purple-100 text-purple-800 border-purple-300',
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'name' => 'Farhan Ahmed',
                'batch' => 'HSC Special Batch',
                'institution' => 'Notre Dame College',
                'badge' => 'GPA 5.00 (Golden A+)',
                'quote' => 'কেমিস্ট্রি ও আইসিটির গোছানো লেকচার শিট এবং নিয়মিত উইকলি টেস্ট আমার প্রস্তুতিকে সম্পূর্ণ করে দিয়েছিল। রেজাল্ট ভালো করার পেছনে উল্লাস কোচিংয়ের অবদান সবসময় মনে থাকবে।',
                'initials' => 'FA',
                'color' => 'bg-blue-100 text-blue-800 border-blue-300',
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'name' => 'Sumaiya Akter',
                'batch' => 'Class 10 Intensive Batch',
                'institution' => 'Holy Cross College',
                'badge' => 'GPA 5.00 Achiever',
                'quote' => 'কোচিংয়ের নিয়মিত হাজিরা ট্র্যাকিং এবং রেজাল্ট ফিডব্যাক সিস্টেম আমাকে নিয়মানুবর্তী হতে সাহায্য করেছিল। কঠিন বিষয়গুলো খুব সহজে আনন্দের সাথে সমাধান শিখিয়ে দিতেন স্যার।',
                'initials' => 'SA',
                'color' => 'bg-rose-100 text-rose-800 border-rose-300',
                'sort_order' => 4,
                'status' => 'published',
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}

