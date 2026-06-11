<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AcademicClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\DB;

class SubjectAllocationController extends Controller
{
    public function index(Request $request)
    {
        $classes = AcademicClass::all();
        
        $selectedClassId = $request->get('class_id');
        $selectedSectionId = $request->get('section_id');

        $sections = [];
        if ($selectedClassId) {
            $sections = Section::where('academic_class_id', $selectedClassId)->get();
        }

        $subjects = Subject::all();
        
        // Get teachers from TeacherProfile with specializations
        $teachers = TeacherProfile::with('user')->get()->map(function($profile) {
            return [
                'id' => $profile->user_id,
                'name' => $profile->user ? $profile->user->name : 'Unknown',
                'specializations' => $profile->specializations ?? [],
            ];
        });

        $allocations = [];
        if ($selectedClassId && $selectedSectionId) {
            $allocations = DB::table('subject_teacher')
                ->where('academic_class_id', $selectedClassId)
                ->where('section_id', $selectedSectionId)
                ->get()
                ->keyBy('subject_id')
                ->map(function($item) {
                    return $item->user_id;
                })
                ->toArray();
        }

        return Inertia::render('Admin/SubjectAllocation/Index', [
            'classes' => $classes,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'allocations' => (object)$allocations, // Ensure empty object if no allocations
            'filters' => [
                'class_id' => $selectedClassId,
                'section_id' => $selectedSectionId,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'allocations' => 'array', // [subject_id => teacher_id]
        ]);

        $classId = $request->class_id;
        $sectionId = $request->section_id;
        $allocations = $request->allocations ?? [];

        DB::transaction(function () use ($classId, $sectionId, $allocations) {
            // Remove existing allocations for this class and section
            DB::table('subject_teacher')
                ->where('academic_class_id', $classId)
                ->where('section_id', $sectionId)
                ->delete();

            $insertData = [];
            foreach ($allocations as $subjectId => $teacherId) {
                if ($teacherId) {
                    $insertData[] = [
                        'academic_class_id' => $classId,
                        'section_id' => $sectionId,
                        'subject_id' => $subjectId,
                        'user_id' => $teacherId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            if (!empty($insertData)) {
                DB::table('subject_teacher')->insert($insertData);
            }
        });

        return redirect()->back()->with('success', 'Subject allocations updated successfully.');
    }
}
