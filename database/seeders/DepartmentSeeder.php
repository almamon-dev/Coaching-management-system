<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Science (বিজ্ঞান)', 'description' => 'Focuses on physics, chemistry, and biology subjects. (পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞান বিষয়সমূহের উপর আলোকপাত করে।)'],
            ['name' => 'Arts (মানবিক)', 'description' => 'Covers humanities, history, and social sciences. (মানবিক, ইতিহাস এবং সামাজিক বিজ্ঞান অন্তর্ভুক্ত করে।)'],
            ['name' => 'Commerce (ব্যবসায় শিক্ষা)', 'description' => 'Deals with business, accounting, and economics. (ব্যবসা, হিসাববিজ্ঞান এবং অর্থনীতি নিয়ে কাজ করে।)'],
            ['name' => 'Mathematics (গণিত)', 'description' => 'Dedicated to advanced mathematical studies. (উচ্চতর গণিত শিক্ষার জন্য নিবেদিত।)'],
            ['name' => 'Languages (ভাষা)', 'description' => 'Focuses on literature and language learning. (সাহিত্য এবং ভাষা শিক্ষার উপর আলোকপাত করে।)'],
            ['name' => 'Physical Education (শারীরিক শিক্ষা)', 'description' => 'Handles sports and physical wellness. (খেলাধুলা এবং শারীরিক সুস্থতা পরিচালনা করে।)'],
            ['name' => 'Administration (প্রশাসন)', 'description' => 'Manages school operations and staff. (বিদ্যালয়ের কার্যক্রম এবং কর্মচারী পরিচালনা করে।)'],
            ['name' => 'Library (গ্রন্থাগার)', 'description' => 'Manages books and reading materials. (বই এবং পঠন সামগ্রী পরিচালনা করে।)']
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['name' => $department['name']],
                ['description' => $department['description'], 'status' => true]
            );
        }
    }
}
