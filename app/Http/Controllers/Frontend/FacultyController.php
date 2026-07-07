<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    public function index()
    {
        $users = \App\Models\User::where('user_type', 'teacher')->with('teacherProfile')->get();

        $faculties = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->teacherProfile?->designation ?? 'Teacher',
                'email' => $user->email,
                'phone' => $user->phone ?? 'N/A',
                'image' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&background=random&size=300',
                'department' => $user->teacherProfile?->department ?? 'General',
                'bio' => "An esteemed member of our faculty, dedicated to providing quality education and fostering student growth.",
                'qualifications' => $user->teacherProfile?->qualifications ? array_map('trim', explode(',', $user->teacherProfile->qualifications)) : [],
            ];
        });

        $departments = \App\Models\Department::pluck('name')->toArray();

        return Inertia::render('Frontend/Faculties/Index', [
            'faculties' => $faculties,
            'departments' => $departments
        ]);
    }

    public function show($id)
    {
        $user = \App\Models\User::where('user_type', 'teacher')->with('teacherProfile')->find($id);

        if (!$user) {
            abort(404, 'Faculty not found');
        }

        $faculty = [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->teacherProfile?->designation ?? 'Teacher',
            'email' => $user->email,
            'phone' => $user->phone ?? 'N/A',
            'image' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : 'https://ui-avatars.com/api/?name=' . urlencode($user->name) . '&background=random&size=300',
            'department' => $user->teacherProfile?->department ?? 'General',
            'bio' => "An esteemed member of our faculty, dedicated to providing quality education and fostering student growth.",
            'qualifications' => $user->teacherProfile?->qualifications ? array_map('trim', explode(',', $user->teacherProfile->qualifications)) : [],
        ];

        return Inertia::render('Frontend/Faculties/Show', [
            'faculty' => $faculty
        ]);
    }
}
