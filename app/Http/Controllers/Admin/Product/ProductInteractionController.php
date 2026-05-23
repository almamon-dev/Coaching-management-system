<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\ProductQuestion;
use App\Models\Review;
use App\Repositories\Admin\Question\QuestionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProductInteractionController extends Controller
{
    /**
     * Display a listing of product questions.
     */
    public function questionsIndex(Request $request, QuestionRepository $repository): InertiaResponse
    {
        $result = $repository->getQuestionList($request);

        return Inertia::render('Admin/Questions/List/QuestionListPage', [
            'questions' => $result['questions'],
            'filters'   => $request->only(['search', 'status', 'date_range', 'per_page']),
            'stats'     => $result['stats'],
        ]);
    }

    /**
     * Answer a product question.
     */
    public function answerQuestion(Request $request, ProductQuestion $question)
    {
        $request->validate([
            'answer' => 'required|string|min:5',
        ]);

        $question->update([
            'answer' => $request->answer,
            'status' => 1, // Set as answered/published
        ]);

        return back()->with('success', 'Answer saved successfully.');
    }

    /**
     * Delete a product question.
     */
    public function destroyQuestion(ProductQuestion $question)
    {
        $question->delete();
        return back()->with('success', 'Question deleted successfully.');
    }

    /**
     * Bulk delete product questions.
     */
    public function bulkDestroyQuestions(Request $request)
    {
        if ($request->all) {
            $query = ProductQuestion::query();
            
            // Re-apply same filters as index
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('question', 'like', "%{$request->search}%")
                      ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$request->search}%"));
                });
            }
            if ($request->status && !in_array($request->status, ['all', 'today'])) {
                if ($request->status === 'pending') $query->whereNull('answer');
                if ($request->status === 'answered') $query->whereNotNull('answer');
            }
            if ($request->date_range === 'today') $query->whereDate('created_at', now());

            $query->delete();
        } else {
            $request->validate([
                'ids'   => 'required|array',
                'ids.*' => 'exists:product_questions,id',
            ]);
            ProductQuestion::whereIn('id', $request->ids)->delete();
        }

        return back()->with('success', 'Selected questions deleted successfully.');
    }

    /**
     * Bulk update status for product questions.
     */
    public function bulkUpdateQuestionsStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        if ($request->all) {
            $query = ProductQuestion::query();
            // Re-apply same filters as index
            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('question', 'like', "%{$request->search}%")
                      ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$request->search}%"));
                });
            }
            if ($request->status_filter && !in_array($request->status_filter, ['all', 'today'])) {
                if ($request->status_filter === 'pending') $query->whereNull('answer');
                if ($request->status_filter === 'answered') $query->whereNotNull('answer');
            }
            if ($request->date_range === 'today') $query->whereDate('created_at', now());

            if ($request->status === 'answered') {
                $query->whereNull('answer')->update(['answer' => 'No answer provided.', 'status' => 1]);
            } else {
                $query->update(['answer' => null, 'status' => 0]);
            }
        } else {
            $request->validate([
                'ids'   => 'required|array',
                'ids.*' => 'exists:product_questions,id',
            ]);
            
            if ($request->status === 'answered') {
                ProductQuestion::whereIn('id', $request->ids)->whereNull('answer')->update(['answer' => 'No answer provided.', 'status' => 1]);
            } else {
                ProductQuestion::whereIn('id', $request->ids)->update(['answer' => null, 'status' => 0]);
            }
        }

        return back()->with('success', 'Selected questions status updated successfully.');
    }
}
