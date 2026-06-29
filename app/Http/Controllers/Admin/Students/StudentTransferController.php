<?php

namespace App\Http\Controllers\Admin\Students;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AcademicClass;
use App\Models\AcademicSession;
use App\Models\Section;
use App\Models\StudentProfile;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class StudentTransferController extends Controller
{
    public function index(Request $request)
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');

        $classes = AcademicClass::with('sections')->orderBy('numeric_value')->get();
        $sections = Section::all();
        $sessions = AcademicSession::orderBy('start_date', 'desc')->get();

        $students = [];
        if ($classId && $sectionId) {
            $students = StudentProfile::with(['user', 'latestEnrollment.academicClass', 'latestEnrollment.section'])
                ->whereHas('latestEnrollment', function ($q) use ($classId, $sectionId) {
                    $q->where('academic_class_id', $classId)
                      ->where('section_id', $sectionId)
                      ->where('status', 'active');
                })
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'student_id' => $student->student_id,
                        'name' => $student->user->name,
                        'enrollment_id' => $student->latestEnrollment->id,
                        'roll_number' => $student->latestEnrollment->roll_number,
                    ];
                });
        }

        return Inertia::render('Admin/StudentTransfer/Index', [
            'classes' => $classes,
            'sections' => $sections,
            'sessions' => $sessions,
            'students' => $students,
            'filters' => $request->only(['class_id', 'section_id'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'enrollment_ids' => 'required|array|min:1',
            'enrollment_ids.*' => 'exists:enrollments,id',
            'transfer_reason' => 'nullable|string|max:255',
            'transfer_date' => 'required|date',
        ]);

        DB::transaction(function () use ($validated) {
            Enrollment::whereIn('id', $validated['enrollment_ids'])
                ->update(['status' => 'transferred']);
        });

        return redirect()->back()->with('success', 'Students have been transferred successfully.');
    }
}
