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
        $classes = AcademicClass::orderBy('numeric_value')->get();
        
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

        $search = $request->get('search');
        $teacherFilterId = $request->get('teacher_id');

        $allAllocations = DB::table('subject_teacher')
            ->join('academic_classes', 'subject_teacher.academic_class_id', '=', 'academic_classes.id')
            ->join('sections', 'subject_teacher.section_id', '=', 'sections.id')
            ->join('subjects', 'subject_teacher.subject_id', '=', 'subjects.id')
            ->join('users', 'subject_teacher.user_id', '=', 'users.id')
            ->select(
                'subject_teacher.id',
                'subject_teacher.academic_class_id',
                'subject_teacher.section_id',
                'academic_classes.name as class_name',
                'sections.name as section_name',
                'subjects.name as subject_name',
                'subjects.code as subject_code',
                'users.name as teacher_name'
            )
            ->when($teacherFilterId, function ($query, $teacherFilterId) {
                $query->where('subject_teacher.user_id', $teacherFilterId);
            })
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('subjects.name', 'like', "%{$search}%")
                      ->orWhere('users.name', 'like', "%{$search}%")
                      ->orWhere('academic_classes.name', 'like', "%{$search}%");
                });
            })
            ->orderBy('academic_classes.numeric_value')
            ->orderBy('sections.name')
            ->orderBy('subjects.name')
            ->paginate($request->per_page ?? 15)
            ->withQueryString();

        return Inertia::render('Admin/SubjectAllocation/Index', [
            'classes' => $classes,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'allocations' => (object)$allocations,
            'all_allocations' => $allAllocations,
            'filters' => [
                'class_id' => $selectedClassId,
                'section_id' => $selectedSectionId,
                'search' => $search,
                'teacher_id' => $teacherFilterId,
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

    public function destroy($id)
    {
        DB::table('subject_teacher')->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Allocation removed successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        DB::table('subject_teacher')->whereIn('id', $request->ids)->delete();
        return redirect()->back()->with('success', 'Selected allocations removed successfully.');
    }
}
