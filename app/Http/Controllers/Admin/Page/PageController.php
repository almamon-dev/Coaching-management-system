<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Page;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\Admin\Page\IndexPageService;
use App\Services\Admin\Page\StorePageService;
use App\Services\Admin\Page\UpdatePageService;
use App\Services\Admin\Page\DestroyPageService;
use App\Services\Admin\Page\UpdatePageStatusService;
use App\Services\Admin\Page\BulkDestroyPageService;
use App\Services\Admin\Page\BulkUpdatePageStatusService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PageController extends Controller
{
    /**
     * Display a listing of dynamic pages.
     */
    public function index(Request $request, IndexPageService $service): InertiaResponse
    {
        $result = $service->execute($request);

        return Inertia::render('Admin/Pages/List/PageListPage', [
            'pages' => $result['pages'],
            'stats' => $result['stats'],
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Pages/Create/PageCreatePage');
    }

    /**
     * Store a newly created page in storage.
     */
    public function store(Request $request, StorePageService $service): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:200',
            'meta_description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        try {
            $service->execute($validated);
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['title' => $e->getMessage()])->withInput();
        }

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully.');
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit(Page $page): InertiaResponse
    {
        return Inertia::render('Admin/Pages/Edit/PageEditPage', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified page in storage.
     */
    public function update(Request $request, Page $page, UpdatePageService $service): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:200',
            'meta_description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        try {
            $service->execute($page, $validated);
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->withErrors(['title' => $e->getMessage()])->withInput();
        }

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified page from storage.
     */
    public function destroy(Page $page, DestroyPageService $service): RedirectResponse
    {
        try {
            $service->execute($page);
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }

    /**
     * Update status for a single page.
     */
    public function updateStatus(Request $request, Page $page, UpdatePageStatusService $service): RedirectResponse
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $service->execute($page, (bool) $request->is_active);

        return redirect()->back()->with('success', 'Page status updated successfully.');
    }

    /**
     * Bulk status update.
     */
    public function bulkUpdateStatus(Request $request, BulkUpdatePageStatusService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'nullable|array',
            'all' => 'required|boolean',
            'is_active' => 'required|boolean',
            'search' => 'nullable|string',
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            (bool) $request->input('is_active'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Bulk status updated successfully.');
    }

    /**
     * Bulk delete.
     */
    public function bulkDestroy(Request $request, BulkDestroyPageService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'nullable|array',
            'all' => 'required|boolean',
            'search' => 'nullable|string',
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected pages deleted successfully.');
    }
}
