<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Category;

use App\Models\AttributePreset;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttributePresetRepository
{
    /**
     * Get filtered attribute presets and statistics.
     */
    public function getPresetList(Request $request): array
    {
        $query = AttributePreset::query();

        // Search Filter
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->input('per_page', 15);
        $presets = $query->latest()
            ->cursorPaginate($perPage)
            ->withQueryString();

        return [
            'presets' => $presets,
            'stats' => $this->getStats(),
        ];
    }

    /**
     * Get all presets.
     */
    public function all(): Collection
    {
        return AttributePreset::all();
    }

    /**
     * Create a new preset.
     */
    public function create(array $data): AttributePreset
    {
        return AttributePreset::create($data);
    }

    /**
     * Update an existing preset.
     */
    public function update(AttributePreset $preset, array $data): bool
    {
        return $preset->update($data);
    }

    /**
     * Delete a preset.
     */
    public function delete(AttributePreset $preset): bool
    {
        return (bool) $preset->delete();
    }

    /**
     * Bulk delete presets.
     */
    public function bulkDelete(array $ids, bool $all = false, ?string $search = null): bool
    {
        $query = AttributePreset::query();

        if ($all) {
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('slug', 'like', '%' . $search . '%');
                });
            }
            $query->delete();
        } else {
            AttributePreset::whereIn('id', $ids)->delete();
        }

        return true;
    }

    /**
     * Calculate preset statistics optimized.
     */
    protected function getStats(): array
    {
        $total = DB::table('attribute_presets')->count();

        return [
            'total' => $total,
        ];
    }
}
