<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Gallery::truncate(); // Clear existing data if any

        $data = [
            [
                'title' => 'Annual Athletics Meet',
                'category' => 'Sports',
                'image' => 'galleries/campus_sports.png',
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'title' => 'Spring Cultural Fest',
                'category' => 'Culture',
                'image' => 'galleries/campus_culture.png',
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'title' => 'Outdoor Learning',
                'category' => 'Academics',
                'image' => 'galleries/campus_academics.png',
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'title' => 'Green Campus',
                'category' => 'Facilities',
                'image' => 'galleries/campus_facilities.png',
                'sort_order' => 4,
                'status' => 'published',
            ],
        ];

        foreach ($data as $item) {
            \App\Models\Gallery::create($item);
        }
    }
}
