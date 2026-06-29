<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\AcademicSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::with('academicSession')->latest();

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('session_id') && !empty($request->session_id)) {
            $query->where('academic_session_id', $request->session_id);
        }

        $perPage = $request->input('per_page', 10);
        $exams = $query->paginate($perPage)->withQueryString();
        
        // Calculate stats for tabs
        $stats = [
            'all' => Exam::count(),
            'upcoming' => Exam::where('status', 'upcoming')->count(),
            'ongoing' => Exam::where('status', 'ongoing')->count(),
            'completed' => Exam::where('status', 'completed')->count(),
            'published' => Exam::where('status', 'published')->count(),
        ];
        
        $sessions = AcademicSession::select('id', 'name')->get();

        return Inertia::render('Admin/Examinations/Exams/Index', [
            'exams' => $exams,
            'sessions' => $sessions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'session_id', 'per_page']),
        ]);
    }

    public function create()
    {
        $sessions = AcademicSession::get();
        return Inertia::render('Admin/Examinations/Exams/Create', [
            'sessions' => $sessions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_session_id' => 'required|exists:academic_sessions,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'required|in:upcoming,ongoing,completed,published',
        ]);

        Exam::create($validated);

        return redirect()->route('admin.exams.index')->with('success', 'Exam created successfully.');
    }

    public function edit(Exam $exam)
    {
        $sessions = AcademicSession::get();
        return Inertia::render('Admin/Examinations/Exams/Edit', [
            'exam' => $exam,
            'sessions' => $sessions
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_session_id' => 'required|exists:academic_sessions,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'required|in:upcoming,ongoing,completed,published',
        ]);

        $exam->update($validated);

        return redirect()->route('admin.exams.index')->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();
        return redirect()->route('admin.exams.index')->with('success', 'Exam deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:exams,id',
        ]);

        Exam::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.exams.index')->with('success', 'Selected exams deleted successfully.');
    }
}
