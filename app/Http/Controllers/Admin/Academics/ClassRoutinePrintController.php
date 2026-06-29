<?php

namespace App\Http\Controllers\Admin\Academics;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\ClassRoutine;
use App\Models\Section;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassRoutinePrintController extends Controller
{
    public function index(Request $request)
    {
        $classId = $request->get('class_id');
        $sectionId = $request->get('section_id');
        $teacherId = $request->get('teacher_id');

        $query = ClassRoutine::with(['academicClass', 'section', 'subject', 'teacher']);

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        } elseif ($classId && $sectionId) {
            $query->where('academic_class_id', $classId)
                  ->where('section_id', $sectionId);
        }

        $routines = $query->orderBy('start_time')->get();

        $info = null;
        if ($teacherId) {
            $teacher = \App\Models\User::find($teacherId);
            $info = $teacher ? 'Routine for Teacher: ' . $teacher->name : 'Teacher Routine';
        } elseif ($classId && $sectionId) {
            $aclass = AcademicClass::find($classId);
            $section = Section::find($sectionId);
            $info = 'Routine for Class: ' . ($aclass->name ?? '') . ' | Section: ' . ($section->name ?? '');
        }

        return Inertia::render('Admin/ClassRoutines/Print', [
            'routines' => $routines,
            'info' => $info,
            'filters' => $request->only(['class_id', 'section_id', 'teacher_id'])
        ]);
    }
}
