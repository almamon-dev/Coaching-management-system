<?php

namespace App\Http\Controllers\Admin\Academics;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicSessionController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicSession::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sessions = $query->latest()->paginate($request->per_page ?? 10)->withQueryString();

        return Inertia::render('Admin/AcademicSessions/Index', [
            'sessions' => $sessions,
            'filters' => $request->only(['search', 'per_page']),
            'stats' => [
                'all' => AcademicSession::count(),
                'active' => AcademicSession::where('is_current', true)->count(),
                'inactive' => AcademicSession::where('is_current', false)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_sessions',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean'
        ]);

        if ($request->is_current) {
            AcademicSession::where('is_current', true)->update(['is_current' => false]);
        }

        AcademicSession::create($validated);

        return redirect()->back()->with('success', 'Academic Year created successfully.');
    }

    public function update(Request $request, AcademicSession $academicSession)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_sessions,name,' . $academicSession->id,
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean'
        ]);

        if ($request->is_current) {
            AcademicSession::where('is_current', true)->where('id', '!=', $academicSession->id)->update(['is_current' => false]);
        }

        $academicSession->update($validated);

        return redirect()->back()->with('success', 'Academic Year updated successfully.');
    }

    public function destroy(AcademicSession $academicSession)
    {
        if ($academicSession->is_current) {
            return redirect()->back()->with('error', 'Cannot delete the current academic year.');
        }

        $academicSession->delete();
        return redirect()->back()->with('success', 'Academic Year deleted successfully.');
    }
}
