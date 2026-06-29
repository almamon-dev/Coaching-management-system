<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Mark;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Ensure user is a student (user_type = 'user')
        if ($user->user_type !== 'user' && $user->user_type !== 'student') {
            abort(403, 'Unauthorized access.');
        }

        // Fetch published results for this student
        $results = Result::with(['exam', 'academicClass', 'section'])
            ->where('student_id', $user->id)
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $grades = Grade::orderBy('min_mark', 'desc')->get();
        
        $formattedResults = $results->map(function ($result) use ($user, $grades) {
            $marksData = Mark::with('subject')
                ->where('student_id', $user->id)
                ->where('exam_id', $result->exam_id)
                ->where('academic_class_id', $result->academic_class_id)
                ->get()
                ->map(function ($mark) use ($grades) {
                    $grade = $grades->firstWhere('min_mark', '<=', $mark->marks) ?? $grades->last();
                    return [
                        'subject_name' => $mark->subject->name ?? 'Unknown',
                        'marks' => $mark->marks,
                        'grade' => $grade->name ?? 'F',
                        'grade_point' => $grade->grade_point ?? 0.00,
                    ];
                });

            return [
                'id' => $result->id,
                'total_marks' => $result->total_marks,
                'gpa' => $result->gpa,
                'grade' => $result->grade,
                'exam' => $result->exam,
                'academic_class' => $result->academicClass,
                'section' => $result->section,
                'marks_data' => $marksData,
            ];
        });

        return Inertia::render('Student/Results/Index', [
            'results' => $formattedResults,
        ]);
    }

    public function reportCard(Result $result)
    {
        $user = auth()->user();

        // Ensure user owns this result and it is published
        if ($result->student_id !== $user->id || !$result->is_published) {
            abort(403, 'Unauthorized access or result not published yet.');
        }

        $result->load(['student', 'exam', 'academicClass', 'section']);
        
        $marks = Mark::with(['subject'])
            ->where('exam_id', $result->exam_id)
            ->where('academic_class_id', $result->academic_class_id)
            ->where('section_id', $result->section_id)
            ->where('student_id', $result->student_id)
            ->get();
            
        $grades = Grade::orderBy('min_mark', 'desc')->get();

        // We can reuse the same ReportCard React component used in Admin
        return Inertia::render('Admin/Examinations/Results/ReportCard', [
            'result' => $result,
            'marks' => $marks,
            'grades' => $grades,
            'isUserPanel' => true,
        ]);
    }
}
