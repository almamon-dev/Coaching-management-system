<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicClass;
use App\Models\Section;

class AcademicClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['name' => 'Class One', 'numeric_value' => 1],
            ['name' => 'Class Two', 'numeric_value' => 2],
            ['name' => 'Class Three', 'numeric_value' => 3],
            ['name' => 'Class Four', 'numeric_value' => 4],
            ['name' => 'Class Five', 'numeric_value' => 5],
            ['name' => 'Class Six', 'numeric_value' => 6],
            ['name' => 'Class Seven', 'numeric_value' => 7],
            ['name' => 'Class Eight', 'numeric_value' => 8],
            ['name' => 'Class Nine', 'numeric_value' => 9],
            ['name' => 'Class Ten', 'numeric_value' => 10],
        ];

        foreach ($classes as $classData) {
            $class = AcademicClass::updateOrCreate(
                ['numeric_value' => $classData['numeric_value']],
                ['name' => $classData['name']]
            );

            // Add sections A and B to each class if they don't exist
            $sections = ['A', 'B'];
            foreach ($sections as $sectionName) {
                Section::firstOrCreate([
                    'academic_class_id' => $class->id,
                    'name' => $sectionName,
                ], [
                    'capacity' => 40
                ]);
            }
        }
    }
}
