<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [

            /*
            |--------------------------------------------------------------------------
            | Common Subjects (Class 6-8 & All Groups in 9-10)
            |--------------------------------------------------------------------------
            */

            ['name' => 'Bangla 1st Paper (বাংলা ১ম পত্র)', 'code' => 'BAN1', 'group' => 'Common'],
            ['name' => 'Bangla 2nd Paper (বাংলা ২য় পত্র)', 'code' => 'BAN2', 'group' => 'Common'],

            ['name' => 'English 1st Paper (ইংরেজি ১ম পত্র)', 'code' => 'ENG1', 'group' => 'Common'],
            ['name' => 'English 2nd Paper (ইংরেজি ২য় পত্র)', 'code' => 'ENG2', 'group' => 'Common'],

            ['name' => 'Mathematics (গণিত)', 'code' => 'MAT', 'group' => 'Common'],

            ['name' => 'Science (বিজ্ঞান)', 'code' => 'SCI', 'group' => 'Common'], // Class 6-8

            ['name' => 'History and Social Science (ইতিহাস ও সামাজিক বিজ্ঞান)', 'code' => 'HSS', 'group' => 'Common'],

            ['name' => 'Information and Communication Technology (তথ্য ও যোগাযোগ প্রযুক্তি)', 'code' => 'ICT', 'group' => 'Common'],

            ['name' => 'Religious Studies (ধর্ম ও নৈতিক শিক্ষা)', 'code' => 'REL', 'group' => 'Common'],

            ['name' => 'Physical Education and Health (শারীরিক শিক্ষা ও স্বাস্থ্য)', 'code' => 'PEH', 'group' => 'Common'],

          


            /*
            |--------------------------------------------------------------------------
            | Science Group (Class 9-10)
            |--------------------------------------------------------------------------
            */

            ['name' => 'Physics (পদার্থবিজ্ঞান)', 'code' => 'PHY', 'group' => 'Science'],
            ['name' => 'Chemistry (রসায়ন)', 'code' => 'CHE', 'group' => 'Science'],
            ['name' => 'Biology (জীববিজ্ঞান)', 'code' => 'BIO', 'group' => 'Science'],
          

            /*
            |--------------------------------------------------------------------------
            | Business Studies Group (Class 9-10)
            |--------------------------------------------------------------------------
            */

            ['name' => 'Accounting (হিসাববিজ্ঞান)', 'code' => 'ACC', 'group' => 'Business Studies'],
            ['name' => 'Finance and Banking (ফিন্যান্স ও ব্যাংকিং)', 'code' => 'FAB', 'group' => 'Business Studies'],
            ['name' => 'Business Entrepreneurship (ব্যবসায় উদ্যোগ)', 'code' => 'BE', 'group' => 'Business Studies'],


            /*
            |--------------------------------------------------------------------------
            | Humanities Group (Class 9-10)
            |--------------------------------------------------------------------------
            */

            ['name' => 'Economics (অর্থনীতি)', 'code' => 'ECO', 'group' => 'Humanities'],
            ['name' => 'History (ইতিহাস)', 'code' => 'HIS', 'group' => 'Humanities'],
            ['name' => 'Geography and Environment (ভূগোল ও পরিবেশ)', 'code' => 'GEO', 'group' => 'Humanities'],
            ['name' => 'Civics and Citizenship (পৌরনীতি ও নাগরিকতা)', 'code' => 'CIV', 'group' => 'Humanities'],


            /*
            |--------------------------------------------------------------------------
            | Optional Subjects
            |--------------------------------------------------------------------------
            */

            ['name' => 'Agriculture Studies (কৃষি শিক্ষা)', 'code' => 'AGR', 'group' => 'Optional'],
            ['name' => 'Higher Mathematics (উচ্চতর গণিত)', 'code' => 'HM', 'group' => 'Optional'],


        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(
                ['code' => $subject['code']],
                $subject
            );
        }
    }
}
