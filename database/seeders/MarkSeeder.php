<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Mark;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exams = Exam::all();
        $subjects = Subject::all();
        
        $enrollments = DB::table('enrollments')
            ->join('student_profiles', 'enrollments.student_profile_id', '=', 'student_profiles.id')
            ->where('enrollments.status', 'active')
            ->select(
                'student_profiles.user_id as student_id', 
                'enrollments.academic_class_id', 
                'enrollments.section_id'
            )
            ->get();

        if ($exams->isEmpty() || $subjects->isEmpty() || $enrollments->isEmpty()) {
            return;
        }

        $marksData = [];

        foreach ($exams as $exam) {
            foreach ($enrollments as $enrollment) {
                // Get 3 random subjects for this student
                $randomSubjects = $subjects->random(min(3, $subjects->count()));
                
                foreach ($randomSubjects as $subject) {
                    $marksData[] = [
                        'exam_id' => $exam->id,
                        'academic_class_id' => $enrollment->academic_class_id,
                        'section_id' => $enrollment->section_id,
                        'subject_id' => $subject->id,
                        'student_id' => $enrollment->student_id,
                        'marks' => rand(40, 100),
                        'comments' => rand(0, 1) ? 'Good performance' : 'Keep it up',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($marksData, 500) as $chunk) {
            Mark::insertOrIgnore($chunk);
        }
    }
}
