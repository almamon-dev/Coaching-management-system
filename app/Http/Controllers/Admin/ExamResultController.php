<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Result;
use App\Models\Batch;
use App\Models\Course;
use App\Models\Subject;
use App\Models\StudentProfile;
use App\Models\ActivityLog;

class ExamResultController extends Controller
{
    public function index()
    {
        $exams = Exam::with(['course', 'batch', 'results'])->latest()->get();
        $courses = Course::where('status', 'active')->get();
        $batches = Batch::where('status', 'active')->get();

        return Inertia::render('Admin/Exams/Index', [
            'exams' => $exams,
            'courses' => $courses,
            'batches' => $batches,
        ]);
    }

    public function storeExam(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'course_id' => 'nullable|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'exam_date' => 'required|date',
            'total_marks' => 'required|numeric|min:1',
            'pass_marks' => 'required|numeric|min:0',
        ]);

        $exam = Exam::create([
            'title' => $validated['title'],
            'course_id' => $validated['course_id'],
            'batch_id' => $validated['batch_id'],
            'exam_date' => $validated['exam_date'],
            'total_marks' => $validated['total_marks'],
            'pass_marks' => $validated['pass_marks'],
            'status' => 'upcoming',
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Exam Created',
            'module' => 'Exams',
            'description' => "Created exam {$exam->title} for Batch #{$exam->batch_id}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Exam created successfully.');
    }

    public function marksEntry($examId)
    {
        $exam = Exam::with(['course', 'batch'])->findOrFail($examId);
        $students = StudentProfile::where('batch_id', $exam->batch_id)->where('status', 'active')->get();
        $subjects = Subject::where('course_id', $exam->course_id)->get();

        $existingMarks = Mark::where('exam_id', $examId)
            ->get()
            ->keyBy(fn($m) => $m->student_id . '_' . ($m->subject_id ?? '0'));

        return Inertia::render('Admin/Exams/MarksEntry', [
            'exam' => $exam,
            'students' => $students,
            'subjects' => $subjects,
            'existingMarks' => $existingMarks,
        ]);
    }

    public function saveMarks(Request $request, $examId)
    {
        $exam = Exam::findOrFail($examId);

        $validated = $request->validate([
            'marks' => 'required|array', // key: student_id, val: obtained_marks
        ]);

        foreach ($validated['marks'] as $studentId => $obtained) {
            $obtainedVal = (float)($obtained['obtained_marks'] ?? 0);
            $isAbsent = !empty($obtained['is_absent']);

            Mark::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $studentId,
                ],
                [
                    'obtained_marks' => $isAbsent ? 0 : $obtainedVal,
                    'is_absent' => $isAbsent,
                ]
            );

            // Compute Grade, GPA, Percentage
            $total = (float)$exam->total_marks;
            $finalObtained = $isAbsent ? 0 : $obtainedVal;
            $percentage = $total > 0 ? ($finalObtained / $total) * 100 : 0;

            $grade = 'F';
            $gpa = 0.00;
            $passStatus = 'fail';

            if (!$isAbsent && $finalObtained >= $exam->pass_marks) {
                $passStatus = 'pass';
                if ($percentage >= 80) { $grade = 'A+'; $gpa = 5.00; }
                elseif ($percentage >= 70) { $grade = 'A'; $gpa = 4.00; }
                elseif ($percentage >= 60) { $grade = 'A-'; $gpa = 3.50; }
                elseif ($percentage >= 50) { $grade = 'B'; $gpa = 3.00; }
                elseif ($percentage >= 40) { $grade = 'C'; $gpa = 2.00; }
                elseif ($percentage >= 33) { $grade = 'D'; $gpa = 1.00; }
            }

            Result::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $studentId,
                ],
                [
                    'total_marks' => $total,
                    'obtained_marks' => $finalObtained,
                    'percentage' => round($percentage, 2),
                    'grade' => $grade,
                    'gpa' => $gpa,
                    'pass_status' => $passStatus,
                ]
            );
        }

        $exam->update(['status' => 'published']);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Exam Results Published',
            'module' => 'Exams',
            'description' => "Published results for exam {$exam->title}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->route('admin.exams.results', $exam->id)->with('success', 'Marks saved and results generated!');
    }

    public function togglePublish($examId)
    {
        $exam = Exam::findOrFail($examId);
        $newStatus = $exam->status === 'published' ? 'upcoming' : 'published';
        $exam->update(['status' => $newStatus]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => $newStatus === 'published' ? 'Exam Results Published' : 'Exam Results Unpublished',
            'module' => 'Exams',
            'description' => "Changed status of exam {$exam->title} to {$newStatus}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', $newStatus === 'published' 
            ? 'Results successfully published! Students can now see their results on their portal.' 
            : 'Results unpublished. They are now hidden from student portals.');
    }

    public function showResults($examId)
    {
        $exam = Exam::with(['course', 'batch'])->findOrFail($examId);
        $results = Result::with(['student.course', 'student.batch'])
            ->where('exam_id', $examId)
            ->orderBy('obtained_marks', 'desc')
            ->get();

        return Inertia::render('Admin/Exams/Results', [
            'exam' => $exam,
            'results' => $results,
        ]);
    }
}
