<?php

namespace App\Http\Controllers\Admin\Students;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\AcademicSession;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Exception;

class StudentPromotionController extends Controller
{
    public function index(Request $request)
    {
        $classes = AcademicClass::with('sections')->orderBy('numeric_value')->get();
        $sessions = AcademicSession::orderBy('start_date', 'desc')->get();
        
        $students = [];
        
        if ($request->has('from_class') && $request->has('from_section')) {
            $profiles = StudentProfile::with(['user', 'currentEnrollment.academicClass', 'currentEnrollment.section'])
                ->whereHas('currentEnrollment', function ($q) use ($request) {
                    $q->where('academic_class_id', $request->from_class)
                      ->where('section_id', $request->from_section);
                })
                ->get();

            // Format for frontend
            foreach ($profiles as $profile) {
                if ($profile->user && $profile->currentEnrollment) {
                    $students[] = [
                        'id' => $profile->id, // Use profile ID as the student identifier for promotion
                        'name' => $profile->user->name,
                        'student_id' => $profile->student_id,
                        'academic_class' => $profile->currentEnrollment->academicClass,
                        'section' => $profile->currentEnrollment->section,
                        'phone' => $profile->user->phone,
                    ];
                }
            }
        }

        return Inertia::render('Admin/StudentPromotion/Index', [
            'classes' => $classes,
            'sessions' => $sessions,
            'students' => $students,
            'filters' => $request->only(['from_class', 'from_section', 'from_session', 'to_class', 'to_section', 'to_session'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:student_profiles,id',
            'to_class' => 'required|exists:academic_classes,id',
            'to_section' => 'required|exists:sections,id',
            'to_session' => 'required|exists:academic_sessions,id',
        ]);

        try {
            DB::beginTransaction();
            // for the new session, class and section.
            foreach ($validated['student_ids'] as $studentId) {
                // Update old active enrollment in the same session or previous sessions
                \App\Models\Enrollment::where('student_profile_id', $studentId)
                    ->where('status', 'active')
                    ->update(['status' => 'promoted']);

                \App\Models\Enrollment::create([
                    'student_profile_id' => $studentId,
                    'academic_session_id' => $validated['to_session'],
                    'academic_class_id' => $validated['to_class'],
                    'section_id' => $validated['to_section'],
                    'status' => 'active',
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Students promoted successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to promote students: ' . $e->getMessage());
        }
    }
}
