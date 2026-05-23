<?php
 
namespace App\Services\Admin\Supplier;
 
use App\Models\Supplier;
use App\Models\Brand;
use Illuminate\Http\Request;
 
class IndexSupplierService
{
    /**
     * Get filtered suppliers and stats.
     */
    public function execute(Request $request): array
    {
        $query = Supplier::query()->with(['brands']);
 
        // Search Filter
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }
 
        // Status Filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status === 'active' ? 1 : 0);
        }
 
        // Brand Filter
        if ($request->has('brand_id') && $request->brand_id !== 'all') {
            $query->whereHas('brands', function($q) use ($request) {
                $q->where('brands.id', $request->brand_id);
            });
        }
 
        $suppliers = $query->latest()->cursorPaginate($request->per_page ?? 10)->withQueryString();
 
        return [
            'suppliers' => $suppliers,
            'stats' => $this->getStats(),
            'brands' => Brand::active()->get(['id', 'name'])
        ];
    }
 
    /**
     * Calculate supplier statistics.
     */
    protected function getStats(): array
    {
        return [
            'total'    => Supplier::count(),
            'active'   => Supplier::where('status', 1)->count(),
            'inactive' => Supplier::where('status', 0)->count(),
        ];
    }
}
