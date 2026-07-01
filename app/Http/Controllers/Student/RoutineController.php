<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassRoutine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoutineController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $studentProfile = $user->studentProfile;
        
        $enrollment = $studentProfile ? ($studentProfile->currentEnrollment ?? $studentProfile->latestEnrollment) : null;

        if (!$enrollment) {
            $routines = [];
            $studentInfo = null;
        } else {
            $classId = $enrollment->academic_class_id;
            $sectionId = $enrollment->section_id;
            
            $routines = ClassRoutine::with(['subject', 'teacher', 'academicClass', 'section'])
                ->where('academic_class_id', $classId)
                ->where('section_id', $sectionId)
                // Order by day of week then time. MySQL order by field could be tricky, 
                // but since we will render it as a single table, let's just orderBy raw day or let frontend sort.
                ->orderByRaw("FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
                ->orderBy('start_time')
                ->get();
                
            $studentInfo = [
                'name' => $user->name,
                'student_id' => $studentProfile->student_id,
                'program' => $enrollment->academicClass->name,
                'batch' => $enrollment->academicSession->name ?? 'N/A',
                'section' => $enrollment->section->name,
                'status' => 'Active',
            ];
        }

        return Inertia::render('Student/Routine/Index', [
            'routines' => $routines,
            'studentInfo' => $studentInfo
        ]);
    }
}
