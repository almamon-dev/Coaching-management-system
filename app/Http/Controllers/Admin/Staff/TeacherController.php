<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Subject;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $department = $request->input('department');
        $designation = $request->input('designation');

        $query = TeacherProfile::with('user');

        if ($search) {
            $query->where('employee_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
        }

        if ($department) {
            $query->where('department', $department);
        }

        if ($designation) {
            $query->where('designation', $designation);
        }

        $teachers = $query->orderBy('id', 'asc')->paginate($request->input('per_page', 10))->withQueryString();

        // Get unique options for filters
        $departments = TeacherProfile::whereNotNull('department')->distinct()->pluck('department')->map(function($dept) {
            return ['id' => $dept, 'name' => $dept];
        });
        
        $designations = TeacherProfile::whereNotNull('designation')->distinct()->pluck('designation')->map(function($desig) {
            return ['id' => $desig, 'name' => $desig];
        });

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search', 'per_page', 'department', 'designation']),
            'departments' => $departments,
            'designations' => $designations
        ]);
    }

    public function create()
    {
        $subjects = Subject::all();

        $departments = Department::pluck('name')->map(function($name) { return ['id' => $name, 'name' => $name]; });
        $designations = Designation::pluck('name')->map(function($name) { return ['id' => $name, 'name' => $name]; });

        return Inertia::render('Admin/Teachers/Create', [
            'subjects' => $subjects,
            'departments' => $departments,
            'designations' => $designations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'password' => 'required|string|min:8|confirmed',
            'designation' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'qualifications' => 'nullable|string',
            'specializations' => 'nullable|array',
            'specializations.*' => 'exists:subjects,id',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Create User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'],
                'gender' => $validated['gender'] ?? null,
                'user_type' => 'staff', // Staff/Teachers access the Teacher portal
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);


            // 2. Generate Employee ID
            $year = date('Y');
            $latestTeacher = TeacherProfile::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
            $sequence = 1;
            if ($latestTeacher && preg_match('/EMP-\d{4}-(\d+)/', $latestTeacher->employee_id, $matches)) {
                $sequence = intval($matches[1]) + 1;
            }
            $employeeId = 'EMP-' . $year . '-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);

            // 3. Create Teacher Profile
            TeacherProfile::create([
                'user_id' => $user->id,
                'employee_id' => $employeeId,
                'designation' => $validated['designation'],
                'department' => $validated['department'],
                'joining_date' => $validated['joining_date'],
                'qualifications' => $validated['qualifications'],
                'specializations' => $validated['specializations'] ?? [],
            ]);
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher registered successfully.');
    }

    public function edit($id)
    {
        $teacher = TeacherProfile::with('user')->findOrFail($id);
        
        $subjects = Subject::all();

        $departments = Department::pluck('name')->map(function($name) { return ['id' => $name, 'name' => $name]; });
        $designations = Designation::pluck('name')->map(function($name) { return ['id' => $name, 'name' => $name]; });

        return Inertia::render('Admin/Teachers/Edit', [
            'teacher' => $teacher,
            'subjects' => $subjects,
            'departments' => $departments,
            'designations' => $designations,
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = TeacherProfile::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $teacher->user_id,
            'phone' => 'required|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'password' => 'nullable|string|min:8|confirmed',
            'designation' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'qualifications' => 'nullable|string',
            'specializations' => 'nullable|array',
            'specializations.*' => 'exists:subjects,id',
        ]);

        DB::transaction(function () use ($validated, $teacher) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'gender' => $validated['gender'] ?? null,
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $teacher->user->update($userData);

            $teacher->update([
                'designation' => $validated['designation'],
                'department' => $validated['department'],
                'joining_date' => $validated['joining_date'],
                'qualifications' => $validated['qualifications'],
                'specializations' => $validated['specializations'] ?? [],
            ]);
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $teacher = TeacherProfile::with('user')->findOrFail($id);
        
        DB::transaction(function () use ($teacher) {
            $userId = $teacher->user_id;
            $teacher->delete();
            User::where('id', $userId)->delete();
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:teacher_profiles,id'
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $userIds = \App\Models\TeacherProfile::whereIn('id', $validated['ids'])->pluck('user_id');
                \App\Models\TeacherProfile::whereIn('id', $validated['ids'])->delete();
                \App\Models\User::whereIn('id', $userIds)->delete();
            });

            return back()->with('success', count($validated['ids']) . ' teachers deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting teachers: ' . $e->getMessage());
        }
    }
}
