<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Assignment;
use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Carbon\Carbon;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all teachers
        $teachers = User::role('Teacher')->get();
        
        if ($teachers->isEmpty()) {
            $this->command->info('No teachers found. Please run TeacherSeeder first.');
            return;
        }

        $classes = AcademicClass::with('sections')->get();
        $allSubjects = Subject::all();
        
        if ($classes->isEmpty()) {
            $this->command->info('No classes found. Please run Academic data seeders first.');
            return;
        }

        if ($allSubjects->isEmpty()) {
            $this->command->info('No subjects found. Please run Subject data seeders first.');
            return;
        }

        $assignmentTopics = [
            'Math' => [
                'Algebra Equations Practice',
                'Geometry Area & Perimeter',
                'Fractions Homework',
                'Trigonometry Basics'
            ],
            'Science' => [
                'Physics Lab Report',
                'Chemical Reactions Worksheet',
                'Biology Cell Structure',
                'Periodic Table Research'
            ],
            'English' => [
                'Creative Writing Essay',
                'Grammar and Syntax Quiz',
                'Literature Review: Macbeth',
                'Poetry Analysis'
            ],
            'History' => [
                'World War II Timeline',
                'Ancient Civilizations Project',
                'Industrial Revolution Essay',
                'Historical Figure Biography'
            ],
            'General' => [
                'Mid-term Preparation Sheet',
                'End of Chapter Review',
                'Weekly Quiz Assignment',
                'Group Project Submission'
            ]
        ];

        $count = 0;

        foreach ($teachers as $teacher) {
            // Assign 2-5 assignments per teacher
            $numAssignments = rand(2, 5);
            
            for ($i = 0; $i < $numAssignments; $i++) {
                // Pick a random class
                $class = $classes->random();
                
                // Pick a random section
                if ($class->sections->isEmpty()) continue;
                $section = $class->sections->random();
                
                // Pick a random subject
                $subject = $allSubjects->random();
                
                // Find a relevant topic based on subject name (heuristic)
                $category = 'General';
                $subjectName = strtolower($subject->name);
                if (str_contains($subjectName, 'math')) $category = 'Math';
                elseif (str_contains($subjectName, 'sci') || str_contains($subjectName, 'phy') || str_contains($subjectName, 'bio') || str_contains($subjectName, 'chem')) $category = 'Science';
                elseif (str_contains($subjectName, 'eng')) $category = 'English';
                elseif (str_contains($subjectName, 'hist') || str_contains($subjectName, 'soc')) $category = 'History';
                
                $topics = $assignmentTopics[$category];
                $title = $topics[array_rand($topics)];

                Assignment::create([
                    'title' => $title . ' - ' . $class->name . ' (' . $section->name . ')',
                    'description' => 'Please complete this assignment by the due date. Ensure all questions are answered and upload your final document in PDF format if applicable.',
                    'academic_class_id' => $class->id,
                    'section_id' => $section->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'due_date' => Carbon::now()->addDays(rand(1, 14))->format('Y-m-d'),
                    'file_path' => null, // We won't attach files for dummy data
                ]);
                
                $count++;
            }
        }

        $this->command->info("Successfully seeded $count assignments for teachers.");
    }
}
