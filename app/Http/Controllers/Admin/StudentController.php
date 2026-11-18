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
        $query = StudentProfile::with(['course', 'batch', 'batches.course', 'guardian']);

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
            $courseId = $request->course_id;
            $query->where(function($q) use ($courseId) {
                $q->where('course_id', $courseId)
                  ->orWhereHas('batches', fn($b) => $b->where('batches.course_id', $courseId));
            });
        }

        if ($request->filled('batch_id')) {
            $batchId = $request->batch_id;
            $query->where(function($q) use ($batchId) {
                $q->where('batch_id', $batchId)
                  ->orWhereHas('batches', fn($b) => $b->where('batches.id', $batchId));
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $students = $query->latest()->paginate(15)->withQueryString();
        $batches = Course::where('status', 'active')->get(['id', 'title']);
        $batches = Batch::where('status', 'active')->get(['id', 'name']);

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'batches' => $batches,
            'batches' => $batches,
            'filters' => $request->only(['search', 'course_id', 'batch_id', 'status']),
        ]);
    }

    public function show($id)
    {
        $student = StudentProfile::with([
            'course',
            'batch',
            'batches.course',
            'batches.teacher',
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

    public function create()
    {
        return redirect()->route('admin.admissions.create');
    }

    public function edit($id)
    {
        $student = StudentProfile::with(['course', 'batch', 'batches.course', 'guardian'])->findOrFail($id);
        $batches = Course::with(['batches' => fn($q) => $q->where('status', 'active')])->where('status', 'active')->get(['id', 'title', 'fee']);
        $batches = Batch::with('course')->where('status', 'active')->get(['id', 'name', 'course_id', 'class_time']);

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'batches' => $batches,
            'batches' => $batches,
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

        $selectedBatch = Batch::with('course')->find($validated['batch_id'] ?? null);
        $studentIdStr = StudentProfile::generateStudentId($selectedBatch, $selectedBatch?->course);

        // Create User account for student
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? strtolower($studentIdStr) . '@student.local',
            'phone' => $validated['phone'] ?? null,
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
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'guardian_id' => $guardianId,
            'school_college' => $validated['school_college'] ?? null,
            'course_id' => $validated['course_id'],
            'batch_id' => $validated['batch_id'],
            'admission_date' => date('Y-m-d'),
            'status' => 'active',
            'notes' => $validated['notes'] ?? null,
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
            'batch_ids' => 'nullable|array',
            'batch_ids.*' => 'exists:batches,id',
            'course_id' => 'nullable|exists:courses,id',
            'batch_id' => 'nullable|exists:batches,id',
            'status' => 'required|in:active,inactive,passed_out,dropped',
            'notes' => 'nullable|string',
        ]);

        if (!empty($validated['batch_ids'])) {
            $syncData = [];
            foreach ($validated['batch_ids'] as $bId) {
                $b = Batch::find($bId);
                if ($b) {
                    $syncData[$bId] = [
                        'course_id' => $b->course_id,
                        'monthly_fee' => (float)($b->course?->fee ?? 0),
                        'status' => 'active',
                        'enrolled_at' => $student->admission_date ?? date('Y-m-d'),
                    ];
                }
            }
            $student->batches()->sync($syncData);

            $firstBatch = Batch::find($validated['batch_ids'][0]);
            if ($firstBatch) {
                $validated['batch_id'] = $firstBatch->id;
                $validated['course_id'] = $firstBatch->course_id;
            }
        }
        unset($validated['batch_ids']);

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
