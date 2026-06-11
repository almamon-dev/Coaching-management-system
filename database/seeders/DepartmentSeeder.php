<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Science', 'description' => 'Focuses on physics, chemistry, and biology subjects.'],
            ['name' => 'Arts', 'description' => 'Covers humanities, history, and social sciences.'],
            ['name' => 'Commerce', 'description' => 'Deals with business, accounting, and economics.'],
            ['name' => 'Mathematics', 'description' => 'Dedicated to advanced mathematical studies.'],
            ['name' => 'Languages', 'description' => 'Focuses on literature and language learning.'],
            ['name' => 'Physical Education', 'description' => 'Handles sports and physical wellness.'],
            ['name' => 'Administration', 'description' => 'Manages school operations and staff.'],
            ['name' => 'Library', 'description' => 'Manages books and reading materials.']
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['name' => $department['name']],
                ['description' => $department['description'], 'status' => true]
            );
        }
    }
}
