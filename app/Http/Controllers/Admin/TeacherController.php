<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = TeacherProfile::with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teachers/Create');
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
            ]);
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher registered successfully.');
    }
}
