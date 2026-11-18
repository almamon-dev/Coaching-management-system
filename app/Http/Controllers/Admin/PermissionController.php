<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RolePermission;
use App\Models\ActivityLog;

class PermissionController extends Controller
{
    public function index()
    {
        $rolePermissions = RolePermission::all()->keyBy('role');

        $availableModules = [
            'dashboard' => 'Dashboard',
            'students' => 'Student Management',
            'admissions' => 'Admission Management',
            'teachers' => 'Teacher Management',
            'batches' => 'Course Management',
            'batches' => 'Batch Management',
            'routines' => 'Class & Routine',
            'attendance' => 'Attendance',
            'fees' => 'Fee Collection & Due',
            'receipts' => 'Payment Receipt',
            'expenses' => 'Operational Expenses',
            'incomes' => 'Operational Income',
            'exams' => 'Exam Management',
            'results' => 'Result Management',
            'assignments' => 'Assignments & Homework',
            'materials' => 'Study Materials',
            'notices' => 'Notice Management',
            'reports' => 'Reports',
            'permissions' => 'User Permissions',
            'logs' => 'Activity Logs',
            'settings' => 'Settings',
            'backup' => 'Database Backup',
        ];

        return Inertia::render('Admin/Permissions/Index', [
            'rolePermissions' => $rolePermissions,
            'availableModules' => $availableModules,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'permissions' => 'required|array',
        ]);

        RolePermission::updateOrCreate(
            ['role' => $validated['role']],
            ['permissions' => $validated['permissions']]
        );

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Permissions Updated',
            'module' => 'Permissions',
            'description' => "Updated permissions matrix for role: {$validated['role']}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Role permissions updated successfully.');
    }
}
