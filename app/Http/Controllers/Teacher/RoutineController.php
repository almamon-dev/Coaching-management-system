<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassRoutine;
use Inertia\Inertia;

class RoutineController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $teacherProfile = $user->teacherProfile;

        $routines = ClassRoutine::with(['academicClass', 'section', 'subject'])
            ->where('teacher_id', $user->id)
            ->orderByRaw("FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
            ->orderBy('start_time')
            ->get();

        $teacherInfo = $teacherProfile ? [
            'name' => $user->name,
            'teacher_id' => $teacherProfile->employee_id,
            'designation' => $teacherProfile->designation ?? 'Teacher',
            'department' => $teacherProfile->department ?? 'N/A',
        ] : null;

        return Inertia::render('Teacher/Routine/Index', [
            'routines' => $routines,
            'teacherInfo' => $teacherInfo
        ]);
    }
}
