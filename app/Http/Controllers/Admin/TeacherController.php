<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Subject;
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

        $teachers = $query->latest()->paginate($perPage)->withQueryString();

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

        $departments = [
            ['id' => 'Science', 'name' => 'Science'],
            ['id' => 'Humanities', 'name' => 'Humanities'],
            ['id' => 'Commerce', 'name' => 'Commerce'],
            ['id' => 'Mathematics', 'name' => 'Mathematics'],
            ['id' => 'Languages', 'name' => 'Languages'],
            ['id' => 'Physical Education', 'name' => 'Physical Education'],
            ['id' => 'Arts', 'name' => 'Arts'],
        ];

        $designations = [
            ['id' => 'Senior Teacher', 'name' => 'Senior Teacher'],
            ['id' => 'Assistant Teacher', 'name' => 'Assistant Teacher'],
            ['id' => 'Lecturer', 'name' => 'Lecturer'],
            ['id' => 'Head of Department', 'name' => 'Head of Department'],
            ['id' => 'Instructor', 'name' => 'Instructor'],
        ];

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
                'user_type' => 'admin', // Staff/Teachers generally access the admin panel
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            // Assign role later
            // $user->assignRole('Teacher');

            // 2. Generate Employee ID
            $year = date('Y');
            $count = TeacherProfile::whereYear('created_at', $year)->count() + 1;
            $employeeId = 'EMP-' . $year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

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
}
