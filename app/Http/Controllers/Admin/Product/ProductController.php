<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Products\StoreProductRequest;
use App\Http\Requests\Admin\Products\UpdateProductRequest;
use App\Imports\ProductsImport;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\GlobalVariant;
use App\Services\Admin\Product\BulkDestroyProductService;
use App\Services\Admin\Product\DestroyProductService;
use App\Services\Admin\Product\IndexProductService;
use App\Services\Admin\Product\StoreProductService;
use App\Services\Admin\Product\UpdateProductService;
use App\Services\Admin\Product\UpdateProductStatusService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request, IndexProductService $service): InertiaResponse
    {
        $result = $service->execute($request);

        return Inertia::render('Admin/Products/List/ProductListPage', [
            'products'   => $result['products'],
            'filters'    => $request->only(['search', 'status', 'brand_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'min_price', 'max_price', 'sort_by', 'per_page']),
            'stats'      => $result['stats'],
            'categories' => Category::whereNull('parent_id')->with(['children.children'])->get(),
            'brands'     => Brand::all(),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Products/Create/ProductCreatePage', [
            'categories' => Category::whereNull('parent_id')->with(['children.children'])->get(),
            'brands'     => Brand::all(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'global_variants' => GlobalVariant::with('options')->get(),
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request, StoreProductService $service): RedirectResponse
    {
        $service->execute($request->validated(), $request);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the specified product.
     */
    public function show(Product $product): InertiaResponse
    {
        $product->load(['categories', 'variants', 'images', 'primaryImage', 'seo', 'brand', 'detail']);

        $product->coupons        = \App\Models\MarketingCampaign::coupons()->active()->forProduct($product)->get();
        $product->brochures      = \App\Models\MarketingCampaign::brochures()->active()->forProduct($product)->get();
        $product->coupons_count  = $product->coupons->count();
        $product->brochures_count = $product->brochures->count();

        return Inertia::render('Admin/Products/Details/ProductDetailsPage', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): InertiaResponse
    {
        $product->load(['categories', 'variants', 'images', 'seo', 'warehouses', 'detail']);

        return Inertia::render('Admin/Products/Edit/ProductEditPage', [
            'product'    => $product,
            'categories' => Category::whereNull('parent_id')->with(['children.children'])->get(),
            'brands'     => Brand::all(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'global_variants' => GlobalVariant::with('options')->get(),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product, UpdateProductService $service): RedirectResponse
    {
        $service->execute($product, $request->validated(), $request);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product, DestroyProductService $service): RedirectResponse
    {
        $service->execute($product);

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }

    /**
     * Bulk remove products from storage.
     */
    public function bulkDestroy(Request $request, BulkDestroyProductService $service): RedirectResponse
    {
        $request->validate([
            'ids'    => 'required_if:all,false|array',
            'ids.*'  => 'exists:products,id',
            'all'    => 'required|boolean',
        ]);

        $service->execute(
            $request->input('ids', []),
            (bool) $request->input('all'),
            $request->input('search'),
        );

        return redirect()->back()->with('success', 'Selected products deleted successfully.');
    }

    /**
     * Update status for a product.
     */
    public function updateStatus(Request $request, Product $product, UpdateProductStatusService $service): RedirectResponse
    {
        $request->validate([
            'status' => 'required|integer',
        ]);

        $service->execute($product, (int) $request->input('status'));

        return redirect()->back()->with('success', 'Product status updated successfully.');
    }

    // ── Import / Export ──────────────────────────────────────────────────────

    public function downloadTemplate(): StreamedResponse
    {
        $columns = [
            'name', 'sku', 'status', 'stock', 'warehouse_stocks', 'warranty', 'is_featured',
            'brand_id', 'category_id', 'sub_category_id', 'sub_sub_category_id',
            'price', 'discount_price', 'has_emi', 'emi_monthly', 'emi_duration',
            'description', 'benefits', 'side_effects', 'formula', 'variants', 'primary_image', 'gallery_images',
            'meta_title', 'meta_description', 'tags',
        ];

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="product_import_template.csv"',
        ];

        return new StreamedResponse(function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            // A realistic example showing how to format multiple values
            fputcsv($file, [
                'MacBook Pro 16-inch M3 Max', // name
                'MBP-16-M3-MAX', // sku
                '1', // status (1=InStock, 2=Out, etc)
                '30', // stock
                '1:20:5,2:10:2', // warehouse_stocks (Format: ID:Qty:LowStock,ID:Qty:LowStock)
                '1 Year Apple Official', // warranty
                '1', // is_featured (1=Yes, 0=No)
                '5', // brand_id
                '2', // category_id
                '14', // sub_category_id
                '45', // sub_sub_category_id
                '350000', // price
                '340000', // discount_price
                '1', // has_emi
                '28333', // emi_monthly
                '12', // emi_duration
                'The most advanced Mac ever created.', // description
                'Fast performance', // benefits
                'None', // side_effects
                'M3 Max Chip', // formula
                'Name:350000:30:SKU1', // variants
                'MBP-16-M3-MAX.jpg', // primary_image
                'mbp-front.jpg,mbp-side.jpg', // gallery_images
                'Buy MacBook Pro 16-inch M3 Max in Bangladesh', // meta_title
                'Best price for Apple MacBook Pro 16-inch M3 Max.', // meta_description
                'macbook,apple,laptop,m3 max' // tags (Comma separated)
            ]);
            
            fclose($file);
        }, 200, $headers);
    }

    public function parseImport(Request $request)
    {
        $request->validate(['file' => 'required|mimes:csv,txt,xlsx']);

        $headings = (new HeadingRowImport)->toArray($request->file('file'));

        return response()->json(['headers' => $headings[0][0] ?? []]);
    }

    public function downloadReference()
    {
        return Excel::download(new \App\Exports\Reference\ProductReferenceExport, 'product_id_reference_guide.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file'    => 'required|mimes:csv,txt,xlsx',
            'zip'     => 'nullable|mimes:zip',
            'mapping' => 'required|array',
        ]);

        $imagePath = null;
        $tempDir   = null;

        try {
            if ($request->hasFile('zip')) {
                $tempDir = storage_path('app/temp_import_' . time());
                mkdir($tempDir, 0777, true);

                $zip = new \ZipArchive;
                if ($zip->open($request->file('zip')->getRealPath()) === true) {
                    $zip->extractTo($tempDir);
                    $zip->close();
                    $imagePath = $tempDir;
                }
            }

            Excel::import(new ProductsImport($imagePath, $request->mapping), $request->file('file'));

            if ($tempDir && file_exists($tempDir)) {
                \Illuminate\Support\Facades\File::deleteDirectory($tempDir);
            }

            return redirect()->back()->with('success', 'Products and images imported successfully.');
        } catch (\Exception $e) {
            if ($tempDir && file_exists($tempDir)) {
                \Illuminate\Support\Facades\File::deleteDirectory($tempDir);
            }

            return redirect()->back()->with('error', 'Error importing: ' . $e->getMessage());
        }
    }
}
