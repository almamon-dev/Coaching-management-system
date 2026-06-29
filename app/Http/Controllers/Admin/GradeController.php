<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Grade::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('remarks', 'like', '%' . $request->search . '%');
        }

        $grades = $query->orderBy('grade_point', 'desc')->paginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('Admin/Grades/Index', [
            'grades' => $grades,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:grades',
            'grade_point' => 'required|numeric|min:0',
            'min_mark' => 'required|numeric|min:0',
            'max_mark' => 'required|numeric|min:0|gte:min_mark',
            'remarks' => 'nullable|string|max:255',
        ]);

        Grade::create($validated);

        return redirect()->back()->with('success', 'Grade created successfully.');
    }

    public function update(Request $request, Grade $grade)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:grades,name,' . $grade->id,
            'grade_point' => 'required|numeric|min:0',
            'min_mark' => 'required|numeric|min:0',
            'max_mark' => 'required|numeric|min:0|gte:min_mark',
            'remarks' => 'nullable|string|max:255',
        ]);

        $grade->update($validated);

        return redirect()->back()->with('success', 'Grade updated successfully.');
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();
        return redirect()->back()->with('success', 'Grade deleted successfully.');
    }
}
