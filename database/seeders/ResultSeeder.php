<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Result;
use App\Models\AcademicClass;
use App\Models\Section;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class ResultSeeder extends Seeder
{
    public function run(): void
    {
        $enrollments = DB::table('enrollments')
            ->join('student_profiles', 'enrollments.student_profile_id', '=', 'student_profiles.id')
            ->where('enrollments.status', 'active')
            ->select(
                'student_profiles.user_id as student_id',
                'enrollments.academic_class_id',
                'enrollments.section_id'
            )
            ->get();

        $exams = Exam::all();

        if ($exams->isEmpty() || $enrollments->isEmpty()) {
            $this->command->warn('No exams or enrollments found. Skipping ResultSeeder.');
            return;
        }

        // GPA & Grade mapping
        $gradeMap = [
            [80, 100, '5.00', 'A+'],
            [70, 79,  '4.00', 'A'],
            [60, 69,  '3.50', 'A-'],
            [50, 59,  '3.00', 'B'],
            [40, 49,  '2.00', 'C'],
            [33, 39,  '1.00', 'D'],
            [0,  32,  '0.00', 'F'],
        ];

        $data = [];

        foreach ($exams as $exam) {
            foreach ($enrollments as $en) {
                $totalMarks = rand(80, 900);
                $percentage = rand(20, 98);

                $gpa   = '0.00';
                $grade = 'F';
                $status = 'Failed';

                foreach ($gradeMap as [$min, $max, $g, $gr]) {
                    if ($percentage >= $min && $percentage <= $max) {
                        $gpa   = $g;
                        $grade = $gr;
                        $status = ($percentage >= 33) ? 'Passed' : 'Failed';
                        break;
                    }
                }

                $data[] = [
                    'exam_id'           => $exam->id,
                    'academic_class_id' => $en->academic_class_id,
                    'section_id'        => $en->section_id,
                    'student_id'        => $en->student_id,
                    'total_marks'       => $totalMarks,
                    'gpa'               => $gpa,
                    'grade'             => $grade,
                    'status'            => $status,
                    'is_published'      => 1,
                    'remarks'           => Arr::random(['Excellent', 'Good', 'Average', 'Needs Improvement', null]),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];
            }
        }

        foreach (array_chunk($data, 500) as $chunk) {
            Result::insertOrIgnore($chunk);
        }

        $this->command->info('ResultSeeder: ' . count($data) . ' results seeded.');
    }
}
