<?php

namespace App\Http\Controllers\Admin\Students;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\FeeInvoice;
use App\Models\Section;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $status = $request->input('status');

        $query = StudentProfile::with(['user', 'latestEnrollment.academicClass', 'latestEnrollment.section']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($classId || $sectionId || $status) {
            $query->whereHas('latestEnrollment', function ($q) use ($classId, $sectionId, $status) {
                if ($classId) $q->where('academic_class_id', $classId);
                if ($sectionId) $q->where('section_id', $sectionId);
                if ($status) $q->where('status', $status);
            });
        }

        $students = $query->orderBy(
            \App\Models\Enrollment::selectRaw('CASE WHEN roll_number IS NULL THEN 1 ELSE 0 END')
                ->whereColumn('student_profile_id', 'student_profiles.id')
                ->orderByDesc('id')
                ->limit(1)
        )->orderBy(
            \App\Models\Enrollment::select('roll_number')
                ->whereColumn('student_profile_id', 'student_profiles.id')
                ->orderByDesc('id')
                ->limit(1)
        )->orderBy('student_id', 'asc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $stats = [
            'all' => StudentProfile::count(),
            'active' => StudentProfile::whereHas('latestEnrollment', function ($q) {
                $q->where('status', 'active');
            })->count(),
            'suspended' => StudentProfile::whereHas('latestEnrollment', function ($q) {
                $q->whereIn('status', ['failed', 'transferred', 'suspended']);
            })->count(),
        ];

        $classes = AcademicClass::orderBy('numeric_value')->get();
        $sections = Section::all();

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'stats' => $stats,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => $request->only(['search', 'per_page', 'class_id', 'section_id', 'status'])
        ]);
    }
    public function show(StudentProfile $student)
    {
        $student->load([
            'user',
            'enrollments' => function($query) {
                $query->orderBy('created_at', 'desc');
            },
            'enrollments.academicClass',
            'enrollments.section',
            'enrollments.academicSession'
        ]);

        // Load fees
        $fees = FeeInvoice::with(['feeGroup', 'items.feeType', 'payments'])
            ->where('user_id', $student->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        $attendances = \App\Models\Attendance::where('user_id', $student->user_id)
            ->orderBy('date', 'desc')
            ->get();

        // Optional: Load exam results (if exist)
        $results = \App\Models\Result::with(['exam', 'academicClass'])
            ->where('student_id', $student->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        $marks = \App\Models\Mark::with(['subject.teachers'])
            ->where('student_id', $student->user_id)
            ->get();

        return Inertia::render('Admin/Students/Show', [
            'student' => $student,
            'fees' => $fees,
            'attendances' => $attendances,
            'results' => $results,
            'marks' => $marks,
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
        $classes = AcademicClass::with('sections')->orderBy('numeric_value')->get();
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

    public function edit(StudentProfile $student)
    {
        $student->load(['user', 'latestEnrollment.academicClass', 'latestEnrollment.section']);
        $classes = AcademicClass::with('sections')->orderBy('numeric_value')->get();
        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'classes' => $classes
        ]);
    }

    public function update(Request $request, StudentProfile $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->user_id,
            'phone' => 'required|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'academic_class_id' => 'required|exists:academic_classes,id',
            'section_id' => 'required|exists:sections,id',
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'guardian_relation' => 'required|string|max:50',
            'gender' => 'required|in:male,female,other',
        ]);

        DB::transaction(function () use ($request, $student, $validated) {
            $user = User::findOrFail($student->user_id);
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->phone = $validated['phone'];
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
            $user->save();

            $student->update([
                'guardian_name' => $validated['guardian_name'],
                'guardian_phone' => $validated['guardian_phone'],
                'guardian_email' => $request->guardian_email,
                'guardian_relation' => $validated['guardian_relation'],
                'dob' => $request->dob,
                'gender' => $validated['gender'],
                'blood_group' => $request->blood_group,
                'address' => $request->address,
            ]);

            if ($student->latestEnrollment) {
                $student->latestEnrollment->update([
                    'academic_class_id' => $validated['academic_class_id'],
                    'section_id' => $validated['section_id'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:student_profiles,id'
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $userIds = \App\Models\StudentProfile::whereIn('id', $validated['ids'])->pluck('user_id');
                \App\Models\StudentProfile::whereIn('id', $validated['ids'])->delete();
                \App\Models\User::whereIn('id', $userIds)->delete();
            });

            return back()->with('success', count($validated['ids']) . ' students deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting students: ' . $e->getMessage());
        }
    }
}
