<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\AcademicResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicResourceController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'routine');
        
        $resources = AcademicResource::with('academicClass')
            ->where('is_active', true)
            ->when($type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->latest()
            ->get();

        $titles = [
            'routine' => 'Class Routines',
            'calendar' => 'Academic Calendar',
            'syllabus' => 'Syllabus & Curriculum',
            'other' => 'Other Resources',
        ];

        return Inertia::render('Frontend/Academics/Resources', [
            'resources' => $resources,
            'currentType' => $type,
            'pageTitle' => $titles[$type] ?? 'Academic Resources',
        ]);
    }
}
