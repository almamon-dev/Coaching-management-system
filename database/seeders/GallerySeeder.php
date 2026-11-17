<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gallery::truncate();

        $data = [
            [
                'title' => 'Smart Academic Library & Focused Study Zone',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_01.jpg',
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'title' => 'Admission Information & Academic Counseling Desk',
                'category' => 'Facilities',
                'image' => '/images/coaching/coaching_02.jpg',
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'title' => 'Annual Merit Award & Achievers Recognition Ceremony',
                'category' => 'Events',
                'image' => '/images/coaching/coaching_03.jpg',
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'title' => 'Central Model Test & Examination Session',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_04.jpg',
                'sort_order' => 4,
                'status' => 'published',
            ],
            [
                'title' => 'Interactive Peer Discussion & Problem Solving',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_05.jpg',
                'sort_order' => 5,
                'status' => 'published',
            ],
            [
                'title' => 'University Admission Guideline & Career Seminar',
                'category' => 'Seminars',
                'image' => '/images/coaching/coaching_06.jpg',
                'sort_order' => 6,
                'status' => 'published',
            ],
            [
                'title' => 'Physics & Higher Math Conceptual Lecture Session',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_07.jpg',
                'sort_order' => 7,
                'status' => 'published',
            ],
            [
                'title' => 'Dedicated Exam Revision & Practice Desk',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_08.jpg',
                'sort_order' => 8,
                'status' => 'published',
            ],
            [
                'title' => 'Engaging Classroom Teaching & Student Q&A',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_09.jpg',
                'sort_order' => 9,
                'status' => 'published',
            ],
            [
                'title' => 'Advanced Problem Solving on Board',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_10.jpg',
                'sort_order' => 10,
                'status' => 'published',
            ],
            [
                'title' => 'ICT & Computer Programming Practical Lab',
                'category' => 'Facilities',
                'image' => '/images/coaching/coaching_11.jpg',
                'sort_order' => 11,
                'status' => 'published',
            ],
            [
                'title' => 'Science Lab & Practical Experimentation Demonstration',
                'category' => 'Academics',
                'image' => '/images/coaching/coaching_12.jpg',
                'sort_order' => 12,
                'status' => 'published',
            ],
            [
                'title' => 'Ullash Coaching Academic Care & Lecture Hall',
                'category' => 'Campus',
                'image' => '/images/fb_photo_01.jpg',
                'sort_order' => 13,
                'status' => 'published',
            ],
            [
                'title' => 'Ullash Coaching Batch Classroom Activities',
                'category' => 'Campus',
                'image' => '/images/fb_photo_02.jpg',
                'sort_order' => 14,
                'status' => 'published',
            ],
            [
                'title' => 'Ullash Coaching Student Guidance & Mentoring',
                'category' => 'Campus',
                'image' => '/images/fb_photo_03.jpg',
                'sort_order' => 15,
                'status' => 'published',
            ],
            [
                'title' => 'Ullash Coaching Campus Environment & Students',
                'category' => 'Campus',
                'image' => '/images/fb_photo_04.jpg',
                'sort_order' => 16,
                'status' => 'published',
            ],
        ];

        foreach ($data as $item) {
            Gallery::create($item);
        }
    }
}
