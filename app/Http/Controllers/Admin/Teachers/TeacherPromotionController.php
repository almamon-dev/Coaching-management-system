<?php

namespace App\Http\Controllers\Admin\Teachers;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use App\Models\TeacherPromotion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Designation;
use App\Models\Department;

class TeacherPromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherProfile::with(['user', 'promotions' => function($q) {
            $q->orderBy('promotion_date', 'desc');
        }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('employee_id', 'like', "%{$search}%");
        }
        
        if ($request->filled('sort_field')) {
            $direction = $request->sort_direction === 'desc' ? 'desc' : 'asc';
            if ($request->sort_field === 'name') {
                $query->join('users', 'teacher_profiles.user_id', '=', 'users.id')
                      ->orderBy('users.name', $direction)
                      ->select('teacher_profiles.*');
            } else {
                $query->orderBy($request->sort_field, $direction);
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        $teachers = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Teachers/Promotions/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search']),
            'designations' => Designation::select('id', 'name')->get(),
            'departments' => Department::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
            'new_designation' => 'required|string|max:255',
            'new_department' => 'nullable|string|max:255',
            'promotion_date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $teacher = TeacherProfile::findOrFail($request->teacher_profile_id);

            // Record the promotion history
            TeacherPromotion::create([
                'teacher_profile_id' => $teacher->id,
                'previous_designation' => $teacher->designation,
                'previous_department' => $teacher->department,
                'new_designation' => $request->new_designation,
                'new_department' => $request->new_department,
                'promotion_date' => $request->promotion_date,
                'note' => $request->note,
            ]);

            // Update the teacher's current profile
            $teacher->update([
                'designation' => $request->new_designation,
                'department' => $request->new_department,
            ]);

            DB::commit();

            return redirect()->route('admin.teacher-promotions.index')
                ->with('success', 'Teacher promoted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'An error occurred while promoting the teacher.');
        }
    }
}
