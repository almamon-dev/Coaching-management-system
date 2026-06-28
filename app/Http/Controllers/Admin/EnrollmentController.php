<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\AcademicSession;
use App\Models\AcademicClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sessionId = $request->input('session_id');
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $status = $request->input('status', 'active'); // Default to active status

        $query = Enrollment::with(['studentProfile.user', 'academicSession', 'academicClass', 'section']);

        if ($search) {
            $query->whereHas('studentProfile', function ($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($sessionId) {
            $query->where('academic_session_id', $sessionId);
        }

        if ($classId) {
            $query->where('academic_class_id', $classId);
        }

        if ($sectionId) {
            $query->where('section_id', $sectionId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $enrollments = $query->orderBy('academic_class_id', 'asc')
                             ->orderBy('section_id', 'asc')
                             ->orderBy('roll_number', 'asc')
                             ->paginate($request->input('per_page', 10))
                             ->withQueryString();

        $sessions = AcademicSession::latest('start_date')->get();
        $classes = AcademicClass::orderBy('numeric_value')->get();
        $sections = Section::all();

        return Inertia::render('Admin/Enrollments/Index', [
            'enrollments' => $enrollments,
            'sessions' => $sessions,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => $request->only(['search', 'session_id', 'class_id', 'section_id', 'status', 'per_page'])
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:enrollments,id'
        ]);

        try {
            Enrollment::whereIn('id', $validated['ids'])->delete();
            return back()->with('success', count($validated['ids']) . ' enrollments deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting enrollments: ' . $e->getMessage());
        }
    }
}
