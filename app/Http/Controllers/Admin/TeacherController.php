<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherProfile::with('batches');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('teacher_id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        $teachers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show($id)
    {
        $teacher = TeacherProfile::with(['user', 'batches.course', 'routines.batch'])->findOrFail($id);

        return Inertia::render('Admin/Teachers/Show', [
            'teacher' => $teacher,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'qualification' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $teacherCount = TeacherProfile::count() + 1;
        $teacherIdStr = 'TCH-' . str_pad($teacherCount, 3, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? strtolower($teacherIdStr) . '@teacher.local',
            'phone' => $validated['phone'],
            'user_type' => 'teacher',
            'password' => Hash::make('12345678'),
        ]);

        $teacher = TeacherProfile::create([
            'user_id' => $user->id,
            'teacher_id' => $teacherIdStr,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'qualification' => $validated['qualification'],
            'designation' => $validated['designation'],
            'specialization' => $validated['specialization'],
            'address' => $validated['address'],
            'status' => 'active',
            'notes' => $validated['notes'],
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Teacher Added',
            'module' => 'Teachers',
            'description' => "Added teacher {$teacher->name} ({$teacher->teacher_id})",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Teacher added successfully.');
    }

    public function update(Request $request, $id)
    {
        $teacher = TeacherProfile::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'qualification' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $teacher->update($validated);

        if ($teacher->user) {
            $teacher->user->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Teacher Updated',
            'module' => 'Teachers',
            'description' => "Updated teacher {$teacher->name}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $teacher = TeacherProfile::findOrFail($id);
        $name = $teacher->name;
        
        if ($teacher->user) {
            $teacher->user->delete();
        }
        $teacher->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->user_type,
            'action' => 'Teacher Deleted',
            'module' => 'Teachers',
            'description' => "Deleted teacher {$name}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Teacher deleted successfully.');
    }
}
