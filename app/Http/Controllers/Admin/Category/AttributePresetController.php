<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Products\AttributePresetResource;
use App\Models\AttributePreset;
use App\Services\Admin\Category\AttributePreset\IndexAttributePresetService;
use App\Services\Admin\Category\AttributePreset\StoreAttributePresetService;
use App\Services\Admin\Category\AttributePreset\UpdateAttributePresetService;
use App\Services\Admin\Category\AttributePreset\DestroyAttributePresetService;
use App\Services\Admin\Category\AttributePreset\BulkDestroyAttributePresetService;
use App\Services\Admin\Category\AttributePreset\GetAttributePresetsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AttributePresetController extends Controller
{
    /**
     * Display a listing of attribute presets.
     */
    public function index(Request $request, IndexAttributePresetService $service): InertiaResponse
    {
        $result = $service->execute($request);

        return Inertia::render('Admin/Categories/AttributePresets/List/AttributePresetListPage', [
            'presets' => AttributePresetResource::collection($result['presets']),
            'filters' => $request->only(['search', 'per_page']),
            'stats'   => $result['stats'],
        ]);
    }

    /**
     * Show the form for creating a new preset.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Categories/AttributePresets/Create/AttributePresetCreatePage');
    }

    /**
     * Store a newly created preset in storage.
     */
    public function store(Request $request, StoreAttributePresetService $service): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'fields' => 'required|array'
        ]);

        $service->execute($validated);

        return redirect()->route('admin.categories.attribute-presets.index')->with('success', 'Preset created successfully.');
    }

    /**
     * Show the form for editing the specified preset.
     */
    public function edit(AttributePreset $attribute_preset): InertiaResponse
    {
        return Inertia::render('Admin/Categories/AttributePresets/Edit/AttributePresetEditPage', [
            'preset' => new AttributePresetResource($attribute_preset)
        ]);
    }

    /**
     * Update the specified preset in storage.
     */
    public function update(Request $request, AttributePreset $attribute_preset, UpdateAttributePresetService $service): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'fields' => 'required|array'
        ]);

        $service->execute($attribute_preset, $validated);

        return redirect()->route('admin.categories.attribute-presets.index')->with('success', 'Preset updated successfully.');
    }

    /**
     * Remove the specified preset from storage.
     */
    public function destroy(AttributePreset $attribute_preset, DestroyAttributePresetService $service): RedirectResponse
    {
        $service->execute($attribute_preset);

        return redirect()->back()->with('success', 'Preset deleted successfully.');
    }

    /**
     * Bulk destroy presets.
     */
    public function bulkDestroy(Request $request, BulkDestroyAttributePresetService $service): RedirectResponse
    {
        $request->validate([
            'ids' => 'required_if:all,false|array',
            'ids.*' => 'exists:attribute_presets,id',
            'all' => 'required|boolean'
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('search')
        );

        return redirect()->back()->with('success', 'Selected presets deleted successfully.');
    }

    /**
     * API endpoint for fetching presets in the Category Editor.
     */
    public function getPresets(GetAttributePresetsService $service): JsonResponse
    {
        $presets = $service->execute();
        return response()->json(AttributePresetResource::collection($presets));
    }
}
