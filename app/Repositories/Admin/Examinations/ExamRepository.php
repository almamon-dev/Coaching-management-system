<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Examinations;

use App\Models\Exam;
use App\Models\AcademicSession;
use Illuminate\Http\Request;

class ExamRepository
{
    /**
     * Get paginated and filtered exams.
     */
    public function getExamList(Request $request): array
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

        $filters = $request->only(['search', 'status', 'session_id', 'per_page']);

        return compact('exams', 'stats', 'sessions', 'filters');
    }

    /**
     * Create a new exam.
     */
    public function create(array $data): Exam
    {
        return Exam::create($data);
    }

    /**
     * Update an exam.
     */
    public function update(Exam $exam, array $data): bool
    {
        return $exam->update($data);
    }

    /**
     * Delete an exam.
     */
    public function delete(Exam $exam): bool
    {
        return (bool) $exam->delete();
    }

    /**
     * Bulk delete exams.
     */
    public function bulkDelete(array $ids): int
    {
        return Exam::whereIn('id', $ids)->delete();
    }
}
