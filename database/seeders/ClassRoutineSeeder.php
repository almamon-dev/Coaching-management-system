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
        $classes = AcademicClass::all();
        $subjects = Subject::all();
        $teachers = User::where('user_type', 'teacher')->get();
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        if ($classes->isEmpty() || $subjects->isEmpty() || $teachers->isEmpty()) {
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

        foreach ($classes as $class) {
            $sections = Section::where('academic_class_id', $class->id)->get();
            foreach ($sections as $section) {
                foreach ($days as $day) {
                    // Create 4 random periods per day per section
                    $dailyPeriods = collect($periods)->random(4);
                    
                    foreach ($dailyPeriods as $period) {
                        $subject = $subjects->random();
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
