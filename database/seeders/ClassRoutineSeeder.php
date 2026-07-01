<?php

namespace Database\Seeders;

use App\Models\AcademicClass;
use App\Models\ClassRoutine;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClassRoutineSeeder extends Seeder
{
    public function run(): void
    {
        // Only generate for Class 6 to 10
        $classes = AcademicClass::whereBetween('numeric_value', [6, 10])->get();
        
        $commonSubjects = Subject::where('group', 'Common')->get();
        $allSubjects = Subject::all();

        // Fetch teachers properly via TeacherProfile as user_type is 'admin' for them
        $teachers = \App\Models\TeacherProfile::with('user')->get()->map(function($p) { return $p->user; })->filter();
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        if ($classes->isEmpty() || $allSubjects->isEmpty() || $teachers->isEmpty()) {
            return;
        }

        $periods = [
            ['08:00:00', '08:45:00'],
            ['08:45:00', '09:30:00'],
            ['09:45:00', '10:30:00'],
            ['10:30:00', '11:15:00'],
            ['11:30:00', '12:15:00'],
            ['12:15:00', '13:00:00'],
        ];

        // Clear existing routines
        ClassRoutine::truncate();

        foreach ($classes as $class) {
            $sections = Section::where('academic_class_id', $class->id)->get();
            
            // For Class 6 to 8, they only get Common subjects. Class 9 and 10 get a mix.
            $classSubjects = ($class->numeric_value <= 8) ? $commonSubjects : $allSubjects;

            foreach ($sections as $section) {
                foreach ($days as $day) {
                    // Create 4 random periods per day per section
                    $dailyPeriods = collect($periods)->random(4)->sort();
                    
                    foreach ($dailyPeriods as $period) {
                        $subject = $classSubjects->random();
                        $teacher = $teachers->random();

                        ClassRoutine::create([
                            'academic_class_id' => $class->id,
                            'section_id' => $section->id,
                            'subject_id' => $subject->id,
                            'teacher_id' => $teacher->id,
                            'day' => $day,
                            'start_time' => $period[0],
                            'end_time' => $period[1],
                            'room_number' => 'Room ' . rand(100, 500),
                        ]);
                    }
                }
            }
        }
    }
}
