<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StudentProfile;
use App\Models\AcademicClass;
use App\Models\AcademicSession;
use App\Models\Section;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Subject;
use App\Models\Result;
use App\Models\Mark;

class StudentHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = StudentProfile::take(10)->get();
        $classes = AcademicClass::orderBy('numeric_value')->get();
        $section = Section::first();
        
        if ($classes->isEmpty() || !$section) {
            $this->command->error('No classes or sections found.');
            return;
        }

        $subjects = Subject::take(12)->get();
        if ($subjects->isEmpty()) {
            $this->command->error('No subjects found.');
            return;
        }

        // We will simulate years 2022 to 2026 for the 5 classes
        $startYear = 2022;

        foreach ($students as $student) {
            // Delete existing history to avoid duplicates
            Enrollment::where('student_profile_id', $student->id)->delete();
            Result::where('student_id', $student->user_id)->delete();
            Mark::where('student_id', $student->user_id)->delete();

            foreach ($classes as $index => $class) {
                $year = $startYear + $index;
                $isCurrentYear = ($year == 2026 || $index == $classes->count() - 1);

                $session = AcademicSession::firstOrCreate(
                    ['name' => $year . ' Session'],
                    [
                        'start_date' => $year . '-01-01',
                        'end_date' => $year . '-12-31',
                        'is_current' => $isCurrentYear
                    ]
                );

                // Enrollment
                $enrollment = Enrollment::create([
                    'student_profile_id' => $student->id,
                    'academic_session_id' => $session->id,
                    'academic_class_id' => $class->id,
                    'section_id' => $section->id,
                    'roll_number' => $student->id,
                    'status' => $isCurrentYear ? 'active' : 'promoted',
                    'created_at' => $year . '-01-10 10:00:00'
                ]);

                // Create Exams & Results if not current year (or even for current year to test)
                $exam = Exam::firstOrCreate([
                    'academic_session_id' => $session->id,
                    'name' => 'Final Exam ' . $year,
                ], [
                    'start_date' => $year . '-11-01',
                    'end_date' => $year . '-11-15'
                ]);

                $totalMarks = 0;
                foreach ($subjects as $subject) {
                    $obtainedMarks = rand(60, 95);
                    $totalMarks += $obtainedMarks;

                    Mark::create([
                        'exam_id' => $exam->id,
                        'academic_class_id' => $class->id,
                        'section_id' => $section->id,
                        'subject_id' => $subject->id,
                        'student_id' => $student->user_id,
                        'marks' => $obtainedMarks,
                        'comments' => 'Good'
                    ]);
                }

                $gpa = round(($totalMarks / ($subjects->count() * 100)) * 5, 2);
                $grade = $gpa >= 4 ? 'A+' : ($gpa >= 3 ? 'A' : 'B');

                Result::create([
                    'student_id' => $student->user_id,
                    'exam_id' => $exam->id,
                    'academic_class_id' => $class->id,
                    'section_id' => $section->id,
                    'total_marks' => $totalMarks,
                    'gpa' => $gpa,
                    'grade' => $grade,
                    'status' => 'Passed'
                ]);
            }
        }
        $this->command->info('Seeded academic history for first 10 students.');
    }
}
