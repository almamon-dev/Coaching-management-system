<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::query();

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('group') && $request->group !== 'all') {
            $groupMap = [
                'common' => 'Common',
                'science' => 'Science',
                'business_studies' => 'Business Studies',
                'humanities' => 'Humanities',
                'optional' => 'Optional',
            ];
            if (isset($groupMap[$request->group])) {
                $query->where('group', $groupMap[$request->group]);
            }
        }

        $subjects = $query->latest()->paginate($request->per_page ?? 10)->withQueryString();

        $stats = [
            'all' => Subject::count(),
            'common' => Subject::where('group', 'Common')->count(),
            'science' => Subject::where('group', 'Science')->count(),
            'business_studies' => Subject::where('group', 'Business Studies')->count(),
            'humanities' => Subject::where('group', 'Humanities')->count(),
            'optional' => Subject::where('group', 'Optional')->count(),
        ];

        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'per_page', 'group']),
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects',
            'group' => 'required|string|max:100',
            'type' => 'required|in:theory,practical',
        ]);

        Subject::create($validated);

        return redirect()->back()->with('success', 'Subject created successfully.');
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code,' . $subject->id,
            'group' => 'required|string|max:100',
            'type' => 'required|in:theory,practical',
        ]);

        $subject->update($validated);

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return redirect()->back()->with('success', 'Subject deleted successfully.');
    }
}
