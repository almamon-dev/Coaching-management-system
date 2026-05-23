<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\PCBuild;
use App\Services\Frontend\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PCBuilderController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display the PC Builder workspace.
     */
    public function index(Request $request)
    {
        $headerData = $this->productService->getHeaderData();
        
        // Define PC Builder slot configuration
        $slots = $this->getSlotConfiguration();

        return Inertia::render('Frontend/PCBuilder/Index', array_merge($headerData, [
            'slots' => $slots,
            'sharedBuild' => null,
        ]));
    }

    /**
     * Choose a product for a specific slot.
     */
    public function choose(Request $request, $slotId)
    {
        $slots = $this->getSlotConfiguration();
        $slot = collect($slots)->firstWhere('id', $slotId);
        
        if (!$slot) {
            abort(404, 'Slot not found');
        }

        // Get matching categories
        $categories = Category::whereIn('slug', $slot['categorySlugs'])->get();
        $categoryIds = [];
        foreach ($categories as $cat) {
            $categoryIds = array_merge($categoryIds, [$cat->id], $cat->getAllChildrenIds());
        }
        $categoryIds = array_unique($categoryIds);

        // Fetch products in these categories
        $query = Product::query()
            ->active()
            ->whereIn('products.id', function ($sub) use ($categoryIds) {
                $sub->select('product_id')
                    ->from('product_categories')
                    ->whereIn('category_id', $categoryIds);
            })
            ->with(['brand', 'primaryImage', 'features', 'techSpecs']);

        // ── COMPATIBILITY ENGINE ──
        // 1. Processor & Motherboard Compatibility (Socket match)
        if ($slotId === 'motherboard' && $request->filled('processor')) {
            $processor = Product::find($request->input('processor'));
            if ($processor) {
                $cpuSocket = $this->detectSocket($processor);
                if ($cpuSocket) {
                    $query->where(function ($q) use ($cpuSocket) {
                        $q->where('name', 'like', "%{$cpuSocket}%")
                          ->orWhereHas('techSpecs', function ($sub) use ($cpuSocket) {
                              $sub->where('spec_value', 'like', "%{$cpuSocket}%");
                          });
                    });
                }
            }
        }

        if ($slotId === 'processor' && $request->filled('motherboard')) {
            $motherboard = Product::find($request->input('motherboard'));
            if ($motherboard) {
                $mbSocket = $this->detectSocket($motherboard);
                if ($mbSocket) {
                    $query->where(function ($q) use ($mbSocket) {
                        $q->where('name', 'like', "%{$mbSocket}%")
                          ->orWhereHas('techSpecs', function ($sub) use ($mbSocket) {
                              $sub->where('spec_value', 'like', "%{$mbSocket}%");
                          });
                    });
                }
            }
        }

        // 2. Motherboard & RAM Compatibility (DDR4 vs DDR5 match)
        if ($slotId === 'ram' && $request->filled('motherboard')) {
            $motherboard = Product::find($request->input('motherboard'));
            if ($motherboard) {
                $ramType = $this->detectRamType($motherboard);
                if ($ramType) {
                    $query->where(function ($q) use ($ramType) {
                        $q->where('name', 'like', "%{$ramType}%")
                          ->orWhereHas('techSpecs', function ($sub) use ($ramType) {
                              $sub->where('spec_value', 'like', "%{$ramType}%");
                          });
                    });
                }
            }
        }

        if ($slotId === 'motherboard' && $request->filled('ram')) {
            $ram = Product::find($request->input('ram'));
            if ($ram) {
                $ramType = $this->detectRamType($ram);
                if ($ramType) {
                    $query->where(function ($q) use ($ramType) {
                        $q->where('name', 'like', "%{$ramType}%")
                          ->orWhereHas('techSpecs', function ($sub) use ($ramType) {
                              $sub->where('spec_value', 'like', "%{$ramType}%");
                          });
                    });
                }
            }
        }

        // Apply Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.description', 'like', "%{$search}%");
            });
        }

        // Apply Catalog Filters (reusing existing product catalog scopes)
        $query->filterBrands($request->brand)
              ->filterPrice($request->min_price, $request->max_price)
              ->filterStatus($request->status)
              ->sort($request->get('sort', 'default'));

        $products = $query->paginate(12)->withQueryString();

        $headerData = $this->productService->getHeaderData();

        // Load sidebar filters (price range and dynamic available attributes)
        $initialFilters = ['category_ids' => $categoryIds];
        $priceRange = $this->productService->getPriceRange($initialFilters);
        $availableVariants = $this->productService->getAvailableVariants();

        return Inertia::render('Frontend/PCBuilder/Choose', array_merge($headerData, [
            'slot' => $slot,
            'products' => ProductResource::collection($products)->response()->getData(true),
            'filters' => $request->all(),
            'priceRange' => $priceRange,
            'availableVariants' => $availableVariants,
        ]));
    }

    /**
     * Save the PC build configuration.
     */
    public function saveBuild(Request $request)
    {
        $request->validate([
            'components' => 'required|array',
            'total_price' => 'required|numeric',
        ]);

        $uuid = (string) Str::uuid();

        PCBuild::create([
            'uuid' => $uuid,
            'user_id' => auth()->id(),
            'components' => $request->input('components'),
            'total_price' => $request->input('total_price'),
        ]);

        return response()->json([
            'status' => 'success',
            'uuid' => $uuid,
            'url' => route('pc-builder.shared', ['uuid' => $uuid]),
        ]);
    }

    /**
     * Display a shared PC build.
     */
    public function showShared(Request $request, $uuid)
    {
        $build = PCBuild::where('uuid', $uuid)->firstOrFail();
        $headerData = $this->productService->getHeaderData();
        $slots = $this->getSlotConfiguration();

        // Load details for all saved products
        $productIds = array_values($build->components);
        $products = Product::whereIn('id', $productIds)
            ->with(['brand', 'primaryImage'])
            ->get()
            ->keyBy('id');

        $sharedBuild = [
            'uuid' => $build->uuid,
            'total_price' => $build->total_price,
            'components' => collect($build->components)->map(function ($productId) use ($products) {
                $product = $products->get($productId);
                return $product ? ProductResource::make($product)->resolve() : null;
            })->filter()->toArray(),
        ];

        return Inertia::render('Frontend/PCBuilder/Index', array_merge($headerData, [
            'slots' => $slots,
            'sharedBuild' => $sharedBuild,
        ]));
    }

    /**
     * Retrieve slot configuration mapping.
     */
    private function getSlotConfiguration(): array
    {
        return [
            // Core Components
            [
                'id' => 'processor',
                'name' => 'CPU',
                'required' => true,
                'categorySlugs' => ['processor'],
                'icon' => 'cpu',
                'group' => 'Core Components',
            ],
            [
                'id' => 'cpu-cooler',
                'name' => 'CPU Cooler',
                'required' => false,
                'categorySlugs' => ['cpu-cooler', 'water-liquid-cooling'],
                'icon' => 'fan',
                'group' => 'Core Components',
            ],
            [
                'id' => 'motherboard',
                'name' => 'Motherboard',
                'required' => true,
                'categorySlugs' => ['motherboard', 'intel-motherboard', 'amd-motherboard'],
                'icon' => 'motherboard',
                'group' => 'Core Components',
            ],
            [
                'id' => 'ram',
                'name' => 'RAM',
                'required' => true,
                'categorySlugs' => ['ram-desktop', 'ddr4-8gb-ram', 'ddr4-16gb-ram', 'ddr5-16gb-ram', 'ddr5-32gb-ram'],
                'icon' => 'ram',
                'group' => 'Core Components',
            ],
            [
                'id' => 'storage',
                'name' => 'Storage',
                'required' => true,
                'categorySlugs' => ['ssd', 'sata-ssd-25', 'nvme-m2-ssd', 'hard-disk-drive', 'portable-hard-disk-drive'],
                'icon' => 'storage',
                'group' => 'Core Components',
            ],
            [
                'id' => 'graphics-card',
                'name' => 'Graphics Card',
                'required' => false,
                'categorySlugs' => ['graphics-card', 'nvidia-geforce-rtx', 'nvidia-geforce-gtx', 'amd-radeon-rx'],
                'icon' => 'gpu',
                'group' => 'Core Components',
            ],
            [
                'id' => 'power-supply',
                'name' => 'Power Supply Unit',
                'required' => false,
                'categorySlugs' => ['power-supply'],
                'icon' => 'psu',
                'group' => 'Core Components',
            ],
            [
                'id' => 'casing',
                'name' => 'Casing',
                'required' => false,
                'categorySlugs' => ['casing'],
                'icon' => 'casing',
                'group' => 'Core Components',
            ],

            // Peripherals & Others
            [
                'id' => 'monitor',
                'name' => 'Monitor',
                'required' => false,
                'categorySlugs' => ['monitor', 'gaming-monitor', '4k-monitor', 'curved-monitor', '144hz-monitor'],
                'icon' => 'monitor',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'casing-cooler',
                'name' => 'Casing Cooler',
                'required' => false,
                'categorySlugs' => ['casing-cooler'],
                'icon' => 'casing-cooler',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'keyboard',
                'name' => 'Keyboard',
                'required' => false,
                'categorySlugs' => ['keyboard', 'gaming-keyboard', 'mechanical-gaming-keyboard', 'wireless-mechanical-keyboard', 'rgb-keyboard', 'quiet-office-keyboard'],
                'icon' => 'keyboard',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'mouse',
                'name' => 'Mouse',
                'required' => false,
                'categorySlugs' => ['mouse', 'gaming-mouse', 'wired-gaming-mouse', 'wireless-gaming-mouse', 'ergonomic-mouse'],
                'icon' => 'mouse',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'speaker-home-theater',
                'name' => 'Speaker & Home Theater',
                'required' => false,
                'categorySlugs' => ['speaker-home-theater', 'bluetooth-speakers', 'bluetooth-speaker'],
                'icon' => 'speaker-home-theater',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'headphone',
                'name' => 'Headphone',
                'required' => false,
                'categorySlugs' => ['headphone', 'bluetooth-headphone', 'gaming-headphone'],
                'icon' => 'headphone',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'wifi-adapter-lan-card',
                'name' => 'Wifi Adapter / LAN Card',
                'required' => false,
                'categorySlugs' => ['wifi-adapter', 'lan-card'],
                'icon' => 'wifi-adapter-lan-card',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'anti-virus',
                'name' => 'Anti Virus',
                'required' => false,
                'categorySlugs' => ['antivirus'],
                'icon' => 'anti-virus',
                'group' => 'Peripherals & Others',
            ],
            [
                'id' => 'ups',
                'name' => 'UPS',
                'required' => false,
                'categorySlugs' => ['ups', 'online-ups', 'mini-ups'],
                'icon' => 'ups',
                'group' => 'Peripherals & Others',
            ],
        ];
    }

    /**
     * Extract CPU/Motherboard Socket Type
     */
    private function detectSocket(Product $product): ?string
    {
        $haystack = strtolower($product->name . ' ' . $product->description);
        foreach ($product->techSpecs as $spec) {
            $haystack .= ' ' . strtolower($spec->spec_value);
        }

        if (Str::contains($haystack, 'lga1700')) return 'LGA1700';
        if (Str::contains($haystack, 'lga1200')) return 'LGA1200';
        if (Str::contains($haystack, 'lga1151')) return 'LGA1151';
        if (Str::contains($haystack, 'am5')) return 'AM5';
        if (Str::contains($haystack, 'am4')) return 'AM4';
        
        return null;
    }

    /**
     * Extract RAM type compatibility (DDR4 vs DDR5)
     */
    private function detectRamType(Product $product): ?string
    {
        $haystack = strtolower($product->name . ' ' . $product->description);
        foreach ($product->techSpecs as $spec) {
            $haystack .= ' ' . strtolower($spec->spec_value);
        }

        if (Str::contains($haystack, 'ddr5')) return 'DDR5';
        if (Str::contains($haystack, 'ddr4')) return 'DDR4';
        
        return null;
    }
}
