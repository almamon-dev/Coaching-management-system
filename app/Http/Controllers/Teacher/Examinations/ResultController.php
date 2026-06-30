<?php

namespace App\Http\Controllers\Teacher\Examinations;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Mark;
use App\Models\Result;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ResultController extends Controller
{
    // Result Generation UI
    public function generation(Request $request)
    {
        $teacherId = auth()->id();
        $assigned = DB::table('subject_teacher')
            ->where('user_id', $teacherId)
            ->get();
            
        $classIds = $assigned->pluck('academic_class_id')->unique();
        $sectionIds = $assigned->pluck('section_id')->unique();

        $exams = Exam::orderBy('start_date', 'desc')->get();
        $classes = AcademicClass::whereIn('id', $classIds)->orderBy('numeric_value')->get();
        
        $sections = [];
        if ($request->class_id) {
            $sections = Section::whereIn('id', $sectionIds)->where('academic_class_id', $request->class_id)->get();
        }

        // Check if results exist and their publication status
        $existingResults = false;
        $isPublished = false;
        $previewData = [];
        $subjectsList = [];

        if ($request->exam_id && $request->class_id && $request->section_id) {
            $resultsQuery = Result::where('exam_id', $request->exam_id)
                ->where('academic_class_id', $request->class_id)
                ->where('section_id', $request->section_id);
            
            $existingResults = $resultsQuery->exists();
            if ($existingResults) {
                $isPublished = $resultsQuery->where('is_published', true)->exists();
            }

            // Fetch marks for preview
            $marks = Mark::with(['student:id,name,email', 'subject:id,name,code'])
                ->where('exam_id', $request->exam_id)
                ->where('academic_class_id', $request->class_id)
                ->where('section_id', $request->section_id)
                ->get();
            
            if ($marks->isNotEmpty()) {
                // Get unique subjects
                $subjectsList = $marks->pluck('subject')->unique('id')->values();

                // Group by student_id
                $grouped = $marks->groupBy('student_id');
                $previewData = [];
                
                foreach ($grouped as $student_id => $studentMarks) {
                    $studentInfo = $studentMarks->first()->student;
                    $subjectMarks = [];
                    $totalRawMarks = 0;
                    
                    foreach ($studentMarks as $m) {
                        $subjectMarks[$m->subject_id] = $m->mark;
                        $totalRawMarks += $m->mark;
                    }
                    
                    $previewData[] = [
                        'student' => $studentInfo,
                        'marks' => $subjectMarks,
                        'total_raw_marks' => $totalRawMarks
                    ];
                }

                // Sort by total raw marks descending
                usort($previewData, function ($a, $b) {
                    return $b['total_raw_marks'] <=> $a['total_raw_marks'];
                });
            }
        }

        return Inertia::render('Teacher/Examinations/Results/Generation', [
            'exams' => $exams,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => $request->only(['exam_id', 'class_id', 'section_id']),
            'existingResults' => $existingResults,
            'isPublished' => $isPublished,
            'previewData' => $previewData,
            'subjectsList' => $subjectsList,
        ]);
    }

    // Process Result Generation
    public function generate(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $exam_id = $request->exam_id;
        $class_id = $request->class_id;
        $section_id = $request->section_id;

        // Fetch all grades ordered by min_mark desc to easily calculate grade
        $grades = Grade::orderBy('min_mark', 'desc')->get();

        // Fetch all marks for this criteria
        $marks = Mark::where('exam_id', $exam_id)
            ->where('academic_class_id', $class_id)
            ->where('section_id', $section_id)
            ->get();

        if ($marks->isEmpty()) {
            return redirect()->back()->with('error', 'No marks found for the selected criteria. Please enter marks first.');
        }

        // Group marks by student
        $studentMarks = $marks->groupBy('student_id');

        DB::beginTransaction();
        try {
            // Delete existing unpublished results for this criteria to regenerate
            Result::where('exam_id', $exam_id)
                ->where('academic_class_id', $class_id)
                ->where('section_id', $section_id)
                ->where('is_published', false)
                ->delete();

            foreach ($studentMarks as $student_id => $marksForStudent) {
                $totalMarks = 0;
                $totalGpa = 0;
                $subjectCount = $marksForStudent->count();
                $hasFailedSubject = false;

                foreach ($marksForStudent as $markEntry) {
                    $mark = $markEntry->marks;
                    $totalMarks += $mark;

                    // Calculate grade and GPA for this subject
                    $subjectGrade = $grades->firstWhere('min_mark', '<=', $mark);
                    
                    if (!$subjectGrade) {
                        $subjectGrade = $grades->last(); // F grade usually
                    }

                    $totalGpa += $subjectGrade->grade_point;

                    if (in_array(strtoupper($subjectGrade->name), ['F', 'FAIL'])) {
                        $hasFailedSubject = true;
                    }
                }

                $cgpa = $subjectCount > 0 ? ($totalGpa / $subjectCount) : 0;
                $cgpa = round($cgpa, 2);

                if ($hasFailedSubject) {
                    $finalGrade = 'F';
                    $status = 'Failed';
                    $cgpa = 0.00;
                } else {
                    $status = 'Passed';
                    // Find the grade where grade_point <= $cgpa
                    $finalGradeObj = Grade::where('grade_point', '<=', $cgpa)->orderBy('grade_point', 'desc')->first();
                    $finalGrade = $finalGradeObj ? $finalGradeObj->name : 'F';
                }

                Result::create([
                    'exam_id' => $exam_id,
                    'academic_class_id' => $class_id,
                    'section_id' => $section_id,
                    'student_id' => $student_id,
                    'total_marks' => $totalMarks,
                    'gpa' => $cgpa,
                    'grade' => $finalGrade,
                    'status' => $status,
                    'is_published' => false,
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Results generated successfully. You can now review and publish them.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'An error occurred while generating results: ' . $e->getMessage());
        }
    }

    // Result Publish UI
    public function publishIndex(Request $request)
    {
        $teacherId = auth()->id();
        $assigned = DB::table('subject_teacher')
            ->where('user_id', $teacherId)
            ->get();
            
        $classIds = $assigned->pluck('academic_class_id')->unique();
        $sectionIds = $assigned->pluck('section_id')->unique();

        $exams = Exam::orderBy('start_date', 'desc')->get();
        $classes = AcademicClass::whereIn('id', $classIds)->orderBy('numeric_value')->get();
        
        $sections = [];
        if ($request->class_id) {
            $sections = Section::whereIn('id', $sectionIds)->where('academic_class_id', $request->class_id)->get();
        }

        $results = [];
        $isPublished = false;

        if ($request->exam_id && $request->class_id && $request->section_id) {
            $results = Result::with(['student'])
                ->where('exam_id', $request->exam_id)
                ->where('academic_class_id', $request->class_id)
                ->where('section_id', $request->section_id)
                ->get();
                
            if ($results->isNotEmpty()) {
                $isPublished = $results->first()->is_published;
            }
        }

        return Inertia::render('Teacher/Examinations/Results/Publish', [
            'exams' => $exams,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => $request->only(['exam_id', 'class_id', 'section_id']),
            'results' => $results,
            'isPublished' => $isPublished,
        ]);
    }

    // Process Result Publishing
    public function publish(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        Result::where('exam_id', $request->exam_id)
            ->where('academic_class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->update(['is_published' => true]);
        return redirect()->back()->with('success', 'Results have been successfully published and are now visible to students and parents.');
    }

    // Render Report Card
    public function reportCard(Result $result)
    {
        $result->load(['student', 'exam', 'academicClass', 'section']);
        
        $marks = Mark::with(['subject'])
            ->where('exam_id', $result->exam_id)
            ->where('academic_class_id', $result->academic_class_id)
            ->where('section_id', $result->section_id)
            ->where('student_id', $result->student_id)
            ->get();
            
        $grades = Grade::orderBy('min_mark', 'desc')->get();

        return Inertia::render('Teacher/Examinations/Results/ReportCard', [
            'result' => $result,
            'marks' => $marks,
            'grades' => $grades,
        ]);
    }
}
