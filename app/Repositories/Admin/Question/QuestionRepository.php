<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Question;

use App\Models\ProductQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionRepository
{
    /**
     * Get filtered questions and statistics.
     */
    public function getQuestionList(Request $request): array
    {
        $query = ProductQuestion::with(['product:id,name,slug', 'user:id,name']);

        // Search - Optimized with conditional whereHas
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$search}%"));
            });
        }

        // Status Filter
        if ($request->filled('status') && !in_array($request->status, ['all', 'today'])) {
            $request->status === 'pending' ? $query->whereNull('answer') : $query->whereNotNull('answer');
        }

        // Date Range Filter
        if ($request->filled('date_range') && $request->date_range !== 'all') {
            match ($request->date_range) {
                'today' => $query->whereDate('created_at', now()),
                'yesterday' => $query->whereDate('created_at', now()->subDay()),
                '7days' => $query->where('created_at', '>=', now()->subDays(7)),
                '30days' => $query->where('created_at', '>=', now()->subDays(30)),
                default => null
            };
        }

        $questions = $query->latest('id')
            ->cursorPaginate($request->per_page ?? 15)
            ->withQueryString();

        // Optimized Stats (Single query hit)
        $statsData = DB::table('product_questions')->selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN answer IS NULL THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN answer IS NOT NULL THEN 1 ELSE 0 END) as answered,
            SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 ELSE 0 END) as today
        ')->first();

        return [
            'questions' => $questions,
            'stats' => [
                'total' => (int) ($statsData->total ?? 0),
                'pending' => (int) ($statsData->pending ?? 0),
                'answered' => (int) ($statsData->answered ?? 0),
                'today' => (int) ($statsData->today ?? 0),
            ]
        ];
    }
}
