<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [

            ['name' => 'Bangla', 'code' => 'BAN'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Mathematics', 'code' => 'MAT'],
            ['name' => 'Science', 'code' => 'SCI'],
            ['name' => 'Bangladesh and Global Studies', 'code' => 'BGS'],
            ['name' => 'Religion and Moral Education', 'code' => 'REL'],
            ['name' => 'ICT', 'code' => 'ICT'],
            ['name' => 'Physical Education', 'code' => 'PED'],
            ['name' => 'Arts and Crafts', 'code' => 'ART'],

            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHE'],
            ['name' => 'Biology', 'code' => 'BIO'],
            ['name' => 'Higher Mathematics', 'code' => 'HMAT'],

            ['name' => 'Accounting', 'code' => 'ACC'],
            ['name' => 'Finance and Banking', 'code' => 'FIN'],
            ['name' => 'Business Entrepreneurship', 'code' => 'BUS'],

            ['name' => 'History', 'code' => 'HIS'],
            ['name' => 'Geography', 'code' => 'GEO'],
            ['name' => 'Civics', 'code' => 'CIV'],
            ['name' => 'Economics', 'code' => 'ECO'],
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(
                ['code' => $subject['code']],
                $subject
            );
        }
    }
}