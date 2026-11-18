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
                'title' => 'Model Test Examination Session in AC Classroom',
                'category' => 'Academics',
                'image' => '/images/ullash_classroom_model_test_01.jpg',
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'title' => 'HSC-2026 Batch Grand Farewell & Gift Pack Presentation',
                'category' => 'Events',
                'image' => '/images/ullash_farewell_gift_ceremony.jpg',
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'title' => 'Merit Crest Award Presentation to Top Achievers',
                'category' => 'Events',
                'image' => '/images/ullash_award_crest_01.jpg',
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'title' => 'Faculty Mentorship & Guidance in Front of Campus',
                'category' => 'Campus',
                'image' => '/images/ullash_campus_mentorship.jpg',
                'sort_order' => 4,
                'status' => 'published',
            ],
            [
                'title' => 'Female Students Academic Group Study on Campus',
                'category' => 'Campus',
                'image' => '/images/ullash_campus_female_batch.jpg',
                'sort_order' => 5,
                'status' => 'published',
            ],
            [
                'title' => 'Interactive Farewell Celebration & Student Gathering',
                'category' => 'Events',
                'image' => '/images/ullash_farewell_classroom_celebration.jpg',
                'sort_order' => 6,
                'status' => 'published',
            ],
            [
                'title' => 'Model Test Hall Examination with Attentive Students',
                'category' => 'Academics',
                'image' => '/images/ullash_classroom_model_test_02.jpg',
                'sort_order' => 7,
                'status' => 'published',
            ],
            [
                'title' => 'Merit Crest Presentation to Female Achiever',
                'category' => 'Events',
                'image' => '/images/ullash_award_crest_06.jpg',
                'sort_order' => 8,
                'status' => 'published',
            ],
            [
                'title' => 'Campus Roof Garden Student Study Group',
                'category' => 'Campus',
                'image' => '/images/ullash_roof_garden_batch.jpg',
                'sort_order' => 9,
                'status' => 'published',
            ],
            [
                'title' => 'Academic Guidance & Concept Discussion Session',
                'category' => 'Academics',
                'image' => '/images/ullash_guideline_seminar_session.jpg',
                'sort_order' => 10,
                'status' => 'published',
            ],
            [
                'title' => 'HSC-2026 Batch Celebration Cake Cutting',
                'category' => 'Events',
                'image' => '/images/ullash_farewell_cake_hsc26.jpg',
                'sort_order' => 11,
                'status' => 'published',
            ],
            [
                'title' => 'Merit Award Presentation to Board Examinee',
                'category' => 'Events',
                'image' => '/images/ullash_award_crest_02.jpg',
                'sort_order' => 12,
                'status' => 'published',
            ],
            [
                'title' => 'Focused Model Test Practice Session',
                'category' => 'Academics',
                'image' => '/images/ullash_classroom_model_test_03.jpg',
                'sort_order' => 13,
                'status' => 'published',
            ],
            [
                'title' => 'New HSC ICT Batch Academic Launch',
                'category' => 'Academics',
                'image' => '/images/ullash_ict_batch_poster.jpg',
                'sort_order' => 14,
                'status' => 'published',
            ],
            [
                'title' => 'Merit Crest Presentation to Outstanding Student',
                'category' => 'Events',
                'image' => '/images/ullash_award_crest_03.jpg',
                'sort_order' => 15,
                'status' => 'published',
            ],
            [
                'title' => 'Special Recognition Crest by Director Md. Faruk Hossain',
                'category' => 'Events',
                'image' => '/images/ullash_award_crest_05.jpg',
                'sort_order' => 16,
                'status' => 'published',
            ],
            [
                'title' => 'Merit Crest Award Ceremony in Reception Wing',
                'category' => 'Facilities',
                'image' => '/images/ullash_award_crest_04.jpg',
                'sort_order' => 17,
                'status' => 'published',
            ],
            [
                'title' => 'Farewell Session & Batch Memories Gathering',
                'category' => 'Events',
                'image' => '/images/ullash_farewell_session_01.jpg',
                'sort_order' => 18,
                'status' => 'published',
            ],
            [
                'title' => 'Official Ullash Coaching Center Banner',
                'category' => 'Campus',
                'image' => '/images/ullash_center_banner.jpg',
                'sort_order' => 19,
                'status' => 'published',
            ],
            [
                'title' => 'Official Ullash Coaching Center Monogram Logo',
                'category' => 'Campus',
                'image' => '/images/ullash_logo_symbol.jpg',
                'sort_order' => 20,
                'status' => 'published',
            ],
        ];

        foreach ($data as $item) {
            Gallery::create($item);
        }
    }
}
