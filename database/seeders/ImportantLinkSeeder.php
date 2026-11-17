<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImportantLink;

class ImportantLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ImportantLink::truncate();

        $links = [
            [
                'title' => 'Notice Board',
                'url' => '/notices-board',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Academic Courses & Programs',
                'url' => '/#courses',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Admission Instructions',
                'url' => '/admissions',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Campus Events & Seminars',
                'url' => '/events',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => 'Student Success Stories',
                'url' => '/success-stories',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Photo Gallery',
                'url' => '/gallery',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'title' => 'About Our Coaching',
                'url' => '/about-us',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'title' => 'Student & Guardian Portal',
                'url' => '/student-login',
                'is_active' => true,
                'order' => 8,
            ],
            [
                'title' => 'Sexual Harassment & Safety Help',
                'url' => '/complaints/create',
                'is_active' => true,
                'order' => 9,
            ],
        ];

        foreach ($links as $link) {
            ImportantLink::create($link);
        }
    }
}
