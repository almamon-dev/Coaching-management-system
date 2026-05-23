<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Dashboard\RecentOrderResource;
use App\Services\Admin\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $stats = $this->dashboardService->getStats();
        $revenueData = $this->dashboardService->getRevenueData();
        $categoryData = $this->dashboardService->getCategoryData();
        $customerGrowthData = $this->dashboardService->getCustomerGrowthData();
        $productPerformanceData = $this->dashboardService->getProductPerformanceData();
        
        $recentOrders = $this->dashboardService->getRecentOrders(10);
        $recentOrdersFormatted = RecentOrderResource::collection($recentOrders)->resolve();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $stats,
            'revenue_data' => $revenueData,
            'category_data' => $categoryData,
            'recent_orders' => $recentOrdersFormatted,
            'customer_growth_data' => $customerGrowthData,
            'product_performance_data' => $productPerformanceData,
        ]);
    }
}
