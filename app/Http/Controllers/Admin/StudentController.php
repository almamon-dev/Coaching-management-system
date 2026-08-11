<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\Course;
use App\Models\Batch;
use App\Models\User;
use App\Models\GuardianProfile;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentProfile::with(['course', 'batch', 'guardian']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->filled('batch_id')) {
            $query->where('batch_id', $request->batch_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $students = $query->latest()->paginate(15)->withQueryString();
        $courses = Course::where('status', 'active')->get(['id', 'title']);
        $batches = Batch::where('status', 'active')->get(['id', 'name']);

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'courses' => $courses,
            'batches' => $batches,
            'filters' => $request->only(['search', 'course_id', 'batch_id', 'status']),
        ]);
    }

    public function show($id)
    {
        $student = StudentProfile::with([
            'course',
            'batch',
            'guardian',
            'attendances.classRoutine.subject',
            'feeInvoices.feeType',
            'feePayments.collector',
            'marks.exam',
            'marks.subject',
            'results.exam',
            'assignmentSubmissions.assignment',
        ])->findOrFail($id);

        return Inertia::render('Admin/Students/Show', [
            'student' => $student,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'required|in:male,female,other',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'school_college' => 'nullable|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'notes' => 'nullable|string',
        ]);

        $studentCount = StudentProfile::count() + 1;
        $studentIdStr = 'CSM-' . date('Y') . '-' . str_pad($studentCount, 4, '0', STR_PAD_LEFT);

        // Create User account for student
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? strtolower($studentIdStr) . '@student.local',
            'phone' => $validated['phone'],
            'user_type' => 'student',
            'password' => Hash::make('12345678'),
        ]);

        // Find or create Guardian Profile
        $guardianId = null;
        if (!empty($validated['guardian_phone'])) {
            $guardian = GuardianProfile::firstOrCreate(
                ['phone' => $validated['guardian_phone']],
                [
                    'guardian_id' => 'GRD-' . rand(100, 999),
                    'name' => $validated['guardian_name'] ?? 'Guardian of ' . $validated['name'],
                ]
            );
            $guardianId = $guardian->id;
        }

        $student = StudentProfile::create([
            'user_id' => $user->id,
            'student_id' => $studentIdStr,
            'name' => $validated['name'],
            'dob' => $validated['dob'],
            'gender' => $validated['gender'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'guardian_name' => $validated['guardian_name'],
            'guardian_phone' => $validated['guardian_phone'],
            'guardian_id' => $guardianId,
            'school_college' => $validated['school_college'],
            'course_id' => $validated['course_id'],
            'batch_id' => $validated['batch_id'],
            'admission_date' => date('Y-m-d'),
            'status' => 'active',
            'notes' => $validated['notes'],
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Student Added',
            'module' => 'Students',
            'description' => "Added student {$student->name} ({$student->student_id})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Student added successfully.');
    }

    public function update(Request $request, $id)
    {
        $student = StudentProfile::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'required|in:male,female,other',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'school_college' => 'nullable|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'status' => 'required|in:active,inactive,passed_out,dropped',
            'notes' => 'nullable|string',
        ]);

        $student->update($validated);

        if ($student->user) {
            $student->user->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Student Updated',
            'module' => 'Students',
            'description' => "Updated student {$student->name} ({$student->student_id})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function destroy($id)
    {
        $student = StudentProfile::findOrFail($id);
        $name = $student->name;
        $idStr = $student->student_id;
        
        if ($student->user) {
            $student->user->delete();
        }
        $student->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Student Deleted',
            'module' => 'Students',
            'description' => "Deleted student {$name} ({$idStr})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
