<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            [
                'name' => 'A+',
                'grade_point' => 5.00,
                'min_mark' => 80,
                'max_mark' => 100,
                'remarks' => 'Outstanding',
            ],
            [
                'name' => 'A',
                'grade_point' => 4.00,
                'min_mark' => 70,
                'max_mark' => 79.99,
                'remarks' => 'Excellent',
            ],
            [
                'name' => 'A-',
                'grade_point' => 3.50,
                'min_mark' => 60,
                'max_mark' => 69.99,
                'remarks' => 'Very Good',
            ],
            [
                'name' => 'B',
                'grade_point' => 3.00,
                'min_mark' => 50,
                'max_mark' => 59.99,
                'remarks' => 'Good',
            ],
            [
                'name' => 'C',
                'grade_point' => 2.00,
                'min_mark' => 40,
                'max_mark' => 49.99,
                'remarks' => 'Satisfactory',
            ],
            [
                'name' => 'D',
                'grade_point' => 1.00,
                'min_mark' => 33,
                'max_mark' => 39.99,
                'remarks' => 'Pass',
            ],
            [
                'name' => 'F',
                'grade_point' => 0.00,
                'min_mark' => 0,
                'max_mark' => 32.99,
                'remarks' => 'Fail',
            ],
        ];

        foreach ($grades as $grade) {
            Grade::updateOrCreate(
                ['name' => $grade['name']],
                $grade
            );
        }
    }
}
