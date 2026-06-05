<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\AcademicClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = StudentProfile::with(['user', 'currentEnrollment.academicClass', 'currentEnrollment.section'])
            ->when($search, function ($query, $search) {
                $query->where('student_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'all' => StudentProfile::count(),
            'active' => StudentProfile::whereHas('currentEnrollment', function ($q) {
                $q->where('status', 'active');
            })->count(),
            'suspended' => StudentProfile::whereHas('currentEnrollment', function ($q) {
                $q->whereIn('status', ['failed', 'transferred']);
            })->count(),
        ];

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'stats' => $stats,
            'filters' => $request->only(['search'])
        ]);
    }

    public function destroy(StudentProfile $student)
    {
        DB::transaction(function () use ($student) {
            $userId = $student->user_id;
            $student->delete();
            User::where('id', $userId)->delete();
        });

        return redirect()->back()->with('success', 'Student deleted successfully.');
    }

    public function create()
    {
        $classes = AcademicClass::with('sections')->get();
        return Inertia::render('Admin/Students/Create', [
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'guardian_relation' => 'required|string|max:50',
            'guardian_email' => 'nullable|string|email|max:255',
            'dob' => 'nullable|date',
            'gender' => 'required|in:male,female,other',
            'blood_group' => 'nullable|string|max:5',
            'address' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'user_type' => 'user'
            ]);

            // Simple ID: Year (2-digit) + 4-digit sequential number (e.g. 260001)
            $count = \App\Models\StudentProfile::count() + 1;
            $studentId = date('y') . str_pad($count, 4, '0', STR_PAD_LEFT);

            $profile = StudentProfile::create([
                'user_id' => $user->id,
                'student_id' => $studentId,
                'guardian_name' => $validated['guardian_name'],
                'guardian_phone' => $validated['guardian_phone'],
                'guardian_relation' => $validated['guardian_relation'],
                'guardian_email' => $validated['guardian_email'],
                'dob' => $validated['dob'],
                'gender' => $validated['gender'],
                'blood_group' => $validated['blood_group'],
                'address' => $validated['address'],
            ]);

            // Get or create current academic session
            $session = \App\Models\AcademicSession::firstOrCreate(
                ['is_current' => true],
                ['name' => date('Y') . ' Session', 'start_date' => date('Y-01-01'), 'end_date' => date('Y-12-31')]
            );

            \App\Models\Enrollment::create([
                'student_profile_id' => $profile->id,
                'academic_session_id' => $session->id,
                'academic_class_id' => $validated['academic_class_id'],
                'section_id' => $validated['section_id'],
                'status' => 'active',
                'roll_number' => null // Generated later based on merit
            ]);
        });

        return redirect()->route('admin.students.index')->with('success', 'Student registered successfully.');
    }
}
