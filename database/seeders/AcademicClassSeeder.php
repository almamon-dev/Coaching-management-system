<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\AcademicGroup;

class AcademicClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['name' => 'Class Six', 'numeric_value' => 6],
            ['name' => 'Class Seven', 'numeric_value' => 7],
            ['name' => 'Class Eight', 'numeric_value' => 8],
            ['name' => 'Class Nine', 'numeric_value' => 9],
            ['name' => 'Class Ten', 'numeric_value' => 10],
        ];

        foreach ($classes as $classData) {

            $class = AcademicClass::updateOrCreate(
                ['numeric_value' => $classData['numeric_value']],
                [
                    'name' => $classData['name'],
                ]
            );

            // If class is grouped, create groups and sections for each group
            if ($class->is_grouped) {
                // For classes that have groups
                $groups = [
                    ['name' => 'Science', 'code' => 'SCI'],
                    ['name' => 'Business Studies', 'code' => 'BUS'],
                    ['name' => 'Humanities', 'code' => 'HUM'],
                ];
                
                foreach ($groups as $groupData) {
                    $group = \App\Models\AcademicGroup::firstOrCreate(
                        ['academic_class_id' => $class->id, 'code' => $groupData['code']],
                        ['name' => $groupData['name']]
                    );
                    
                    // Create a single default section under this group
                    Section::firstOrCreate([
                        'academic_class_id' => $class->id,
                        'academic_group_id' => $group->id,
                        'name' => 'A',
                    ], [
                        'capacity' => 40
                    ]);
                }
            } else {
                // Not grouped, just create a single default section
                Section::firstOrCreate([
                    'academic_class_id' => $class->id,
                    'name' => 'A',
                ], [
                    'capacity' => 40
                ]);
            }

        }
    }
}
