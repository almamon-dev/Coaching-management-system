<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassRoutine;
use Inertia\Inertia;

class RoutineController extends Controller
{
    public function index()
    {
        $routines = ClassRoutine::with(['academicClass', 'section', 'subject'])
            ->where('teacher_id', auth()->id())
            ->orderBy('start_time')
            ->get()
            ->groupBy('day');

        return Inertia::render('Teacher/Routine/Index', [
            'routines' => $routines
        ]);
    }
}
