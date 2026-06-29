<?php

namespace App\Http\Controllers\Admin\Examinations;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MarksEntryController extends Controller
{
    public function index(Request $request)
    {
        $exams = Exam::orderBy('start_date', 'desc')->get();
        $classes = AcademicClass::orderBy('numeric_value')->get();
        $sections = Section::orderBy('name')->get();
        $subjects = Subject::orderBy('name')->get();

        $students = [];
        $existingMarks = [];

        if ($request->filled(['exam_id', 'academic_class_id', 'section_id', 'subject_id'])) {
            $students = DB::table('enrollments')
                ->join('student_profiles', 'enrollments.student_profile_id', '=', 'student_profiles.id')
                ->join('users', 'student_profiles.user_id', '=', 'users.id')
                ->where('enrollments.academic_class_id', $request->academic_class_id)
                ->where('enrollments.section_id', $request->section_id)
                ->where('enrollments.status', 'active')
                ->select('users.id', 'users.name', 'users.email', 'enrollments.roll_number')
                ->orderBy('enrollments.roll_number')
                ->get();

            $existingMarks = Mark::query()->where('exam_id', $request->exam_id)
                ->where('academic_class_id', $request->academic_class_id)
                ->where('section_id', $request->section_id)
                ->where('subject_id', $request->subject_id)
                ->get()
                ->keyBy('student_id');
        }

        return Inertia::render('Admin/Examinations/MarksEntry', [
            'exams' => $exams,
            'classes' => $classes,
            'sections' => $sections,
            'subjects' => $subjects,
            'students' => $students,
            'existingMarks' => $existingMarks,
            'filters' => $request->only(['exam_id', 'academic_class_id', 'section_id', 'subject_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:users,id',
            'marks.*.marks' => 'nullable|numeric|min:0',
            'marks.*.comments' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['marks'] as $markData) {
                if ($markData['marks'] !== null && $markData['marks'] !== '') {
                    Mark::updateOrCreate(
                        [
                            'exam_id' => $validated['exam_id'],
                            'academic_class_id' => $validated['academic_class_id'],
                            'section_id' => $validated['section_id'],
                            'subject_id' => $validated['subject_id'],
                            'student_id' => $markData['student_id'],
                        ],
                        [
                            'marks' => $markData['marks'],
                            'comments' => $markData['comments'] ?? null,
                        ]
                    );
                }
            }
        });

        return redirect()->back()->with('success', 'Marks saved successfully.');
    }
}
