<?php

namespace Database\Seeders;

use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\TeacherProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectAllocationSeeder extends Seeder
{
    public function run(): void
    {
        $classes = AcademicClass::whereBetween('numeric_value', [6, 10])->get();
        $teachers = TeacherProfile::with('user')->get();
        $commonSubjects = Subject::where('group', 'Common')->get();
        $scienceSubjects = Subject::where('group', 'Science')->get();
        $businessSubjects = Subject::where('group', 'Business Studies')->get();
        $humanitiesSubjects = Subject::where('group', 'Humanities')->get();
        
        if ($teachers->isEmpty()) {
            return;
        }

        $teacherIds = $teachers->pluck('user_id')->toArray();
        $allocations = [];
        
        // Clear existing allocations to prevent duplicates
        DB::table('subject_teacher')->delete();

        foreach ($classes as $class) {
            $sections = Section::with('academicGroup')->where('academic_class_id', $class->id)->get();
            
            foreach ($sections as $section) {
                $classSubjects = collect();
                
                // Add common subjects for all classes
                $classSubjects = $classSubjects->merge($commonSubjects);
                
                // Add group specific subjects for classes 9 and 10
                if ($class->numeric_value >= 9 && $section->academicGroup) {
                    $groupName = $section->academicGroup->name;
                    if ($groupName === 'Science') {
                        $classSubjects = $classSubjects->merge($scienceSubjects);
                    } elseif ($groupName === 'Business Studies') {
                        $classSubjects = $classSubjects->merge($businessSubjects);
                    } elseif ($groupName === 'Humanities') {
                        $classSubjects = $classSubjects->merge($humanitiesSubjects);
                    }
                }

                foreach ($classSubjects as $index => $subject) {
                    $teacherId = $teacherIds[($class->id + $section->id + $index) % count($teacherIds)];
                    
                    $allocations[] = [
                        'academic_class_id' => $class->id,
                        'section_id' => $section->id,
                        'subject_id' => $subject->id,
                        'user_id' => $teacherId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Insert in chunks to handle many records
        $chunks = array_chunk($allocations, 100);
        foreach ($chunks as $chunk) {
            DB::table('subject_teacher')->insert($chunk);
        }
    }
}
