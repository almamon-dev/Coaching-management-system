<?php

namespace App\Http\Controllers\Admin\Examinations;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\AcademicSession;
use App\Http\Requests\Admin\Examinations\StoreExamRequest;
use App\Http\Requests\Admin\Examinations\UpdateExamRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use App\Services\Admin\Examinations\IndexExamService;
use App\Services\Admin\Examinations\StoreExamService;
use App\Services\Admin\Examinations\UpdateExamService;
use App\Services\Admin\Examinations\DestroyExamService;
use App\Services\Admin\Examinations\BulkDestroyExamService;

class ExamController extends Controller
{
    public function index(Request $request, IndexExamService $service): InertiaResponse
    {
        $result = $service->execute($request);

        return Inertia::render('Admin/Examinations/Exams/Index', [
            'exams' => $result['exams'],
            'sessions' => $result['sessions'],
            'stats' => $result['stats'],
            'filters' => $result['filters'],
        ]);
    }

    public function create(): InertiaResponse
    {
        $sessions = AcademicSession::get();
        return Inertia::render('Admin/Examinations/Exams/Create', [
            'sessions' => $sessions
        ]);
    }

    public function store(StoreExamRequest $request, StoreExamService $service): RedirectResponse
    {
        $validated = $request->validated();
        $service->execute($validated);

        return redirect()->route('admin.exams.index')->with('success', 'Exam created successfully.');
    }

    public function edit(Exam $exam): InertiaResponse
    {
        $sessions = AcademicSession::get();
        return Inertia::render('Admin/Examinations/Exams/Edit', [
            'exam' => $exam,
            'sessions' => $sessions
        ]);
    }

    public function update(UpdateExamRequest $request, Exam $exam, UpdateExamService $service): RedirectResponse
    {
        $validated = $request->validated();
        $service->execute($exam, $validated);

        return redirect()->route('admin.exams.index')->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam, DestroyExamService $service): RedirectResponse
    {
        $service->execute($exam);
        return redirect()->route('admin.exams.index')->with('success', 'Exam deleted successfully.');
    }

    public function bulkDestroy(Request $request, BulkDestroyExamService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:exams,id',
        ]);

        $service->execute($request->ids);

        return redirect()->route('admin.exams.index')->with('success', 'Selected exams deleted successfully.');
    }
}
