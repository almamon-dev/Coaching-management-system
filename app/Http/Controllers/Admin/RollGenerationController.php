<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AcademicClass;
use App\Models\AcademicSession;
use App\Models\Section;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class RollGenerationController extends Controller
{
    public function index(Request $request)
    {
        $sessions = AcademicSession::latest('start_date')->get();
        $classes = AcademicClass::orderBy('numeric_value')->get();
        $sections = Section::all();

        $sessionId = $request->input('session_id');
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');

        $students = [];

        if ($sessionId && $classId && $sectionId) {
            $students = Enrollment::with(['studentProfile.user', 'academicClass', 'section'])
                ->where('academic_session_id', $sessionId)
                ->where('academic_class_id', $classId)
                ->where('section_id', $sectionId)
                ->where('status', 'active') // Only active students get rolls generated for the current session
                ->get()
                ->sort(function ($a, $b) {
                    if ($a->roll_number === null && $b->roll_number !== null) return 1;
                    if ($a->roll_number !== null && $b->roll_number === null) return -1;
                    
                    if ($a->roll_number !== null && $b->roll_number !== null) {
                        if ($a->roll_number !== $b->roll_number) {
                            return $a->roll_number <=> $b->roll_number;
                        }
                    }
                    
                    return $a->studentProfile->student_id <=> $b->studentProfile->student_id;
                })
                ->values()
                ->map(function ($enrollment) {
                    return [
                        'enrollment_id' => $enrollment->id,
                        'student_id' => $enrollment->studentProfile->student_id,
                        'name' => $enrollment->studentProfile->user->name,
                        'gender' => $enrollment->studentProfile->gender,
                        'class' => $enrollment->academicClass->name ?? 'N/A',
                        'section' => $enrollment->section->name ?? 'N/A',
                        'current_roll' => $enrollment->roll_number,
                    ];
                });
        }

        return Inertia::render('Admin/RollGeneration/Index', [
            'sessions' => $sessions,
            'classes' => $classes,
            'sections' => $sections,
            'students' => $students,
            'filters' => $request->only(['session_id', 'class_id', 'section_id'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rolls' => 'required|array',
            'rolls.*.enrollment_id' => 'required|exists:enrollments,id',
            'rolls.*.roll_number' => 'nullable|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['rolls'] as $rollData) {
                    Enrollment::where('id', $rollData['enrollment_id'])
                        ->update(['roll_number' => $rollData['roll_number']]);
                }
            });

            return back()->with('success', 'Roll numbers generated/updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update roll numbers: ' . $e->getMessage());
        }
    }
}
