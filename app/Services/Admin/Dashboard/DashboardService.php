<?php

declare(strict_types=1);

namespace App\Services\Admin\Dashboard;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $currentMonthOrders = Order::where('created_at', '>=', $startOfMonth)->get();
        $lastMonthOrders = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->get();

        $totalSalesValue = (float) Order::sum('total_amount');
        $currentMonthSales = (float) $currentMonthOrders->sum('total_amount');
        $lastMonthSales = (float) $lastMonthOrders->sum('total_amount');
        $salesTrend = $this->calculateTrend($currentMonthSales, $lastMonthSales);

        $totalOrdersCount = Order::count();
        $currentMonthOrdersCount = $currentMonthOrders->count();
        $lastMonthOrdersCount = $lastMonthOrders->count();
        $ordersTrend = $this->calculateTrend($currentMonthOrdersCount, $lastMonthOrdersCount);

        $avgOrderValueVal = $totalOrdersCount > 0 ? $totalSalesValue / $totalOrdersCount : 0.0;
        $currentMonthAvg = $currentMonthOrdersCount > 0 ? $currentMonthSales / $currentMonthOrdersCount : 0.0;
        $lastMonthAvg = $lastMonthOrdersCount > 0 ? $lastMonthSales / $lastMonthOrdersCount : 0.0;
        $avgTrend = $this->calculateTrend($currentMonthAvg, $lastMonthAvg);

        $currentMonthNewCustomers = User::where('created_at', '>=', $startOfMonth)->count();
        $lastMonthNewCustomers = User::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $customersTrend = $this->calculateTrend($currentMonthNewCustomers, $lastMonthNewCustomers);

         return [
             'total_sales' => [
                 'value' => '৳' . number_format((float) $totalSalesValue, 2),
                 'trend' => ($salesTrend >= 0 ? '+' : '') . $salesTrend . '%',
                 'trend_label' => 'vs last month',
                 'type' => $salesTrend >= 0 ? 'up' : 'down'
             ],
             'total_orders' => [
                 'value' => number_format((float) $totalOrdersCount),
                 'trend' => ($ordersTrend >= 0 ? '+' : '') . $ordersTrend . '%',
                 'trend_label' => 'vs last month',
                 'type' => $ordersTrend >= 0 ? 'up' : 'down'
             ],
             'avg_order_value' => [
                 'value' => '৳' . number_format((float) $avgOrderValueVal, 2),
                 'trend' => ($avgTrend >= 0 ? '+' : '') . $avgTrend . '%',
                 'trend_label' => 'vs last month',
                 'type' => $avgTrend >= 0 ? 'up' : 'down'
             ],
             'new_customers' => [
                 'value' => number_format((float) $currentMonthNewCustomers),
                 'trend' => ($customersTrend >= 0 ? '+' : '') . $customersTrend . '%',
                 'trend_label' => 'vs last month',
                 'type' => $customersTrend >= 0 ? 'up' : 'down'
             ],
         ];
    }

    public function getRevenueData()
    {
        return Order::select(
            DB::raw('DATE_FORMAT(created_at, "%b") as month'),
            DB::raw('SUM(total_amount) as revenue'),
            DB::raw('COUNT(*) as orders')
        )
        ->where('created_at', '>=', Carbon::now()->subYear())
        ->groupBy('month', DB::raw('MONTH(created_at)'))
        ->orderBy(DB::raw('MONTH(created_at)'))
        ->get();
    }

    public function getCategoryData()
    {
        return Category::select('categories.name', DB::raw('COUNT(order_items.id) as value'))
            ->join('product_categories', 'categories.id', '=', 'product_categories.category_id')
            ->join('products', 'product_categories.product_id', '=', 'products.id')
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('value')
            ->limit(5)
            ->get();
    }

    public function getCustomerGrowthData()
    {
        return User::select(
            DB::raw('DATE_FORMAT(created_at, "%b") as month'),
            DB::raw('COUNT(*) as customers')
        )
        ->where('created_at', '>=', Carbon::now()->subYear())
        ->groupBy('month', DB::raw('MONTH(created_at)'))
        ->orderBy(DB::raw('MONTH(created_at)'))
        ->get();
    }

    public function getProductPerformanceData()
    {
        return Product::select('products.name', 'products.price', DB::raw('COUNT(order_items.id) as sales'))
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id', 'products.name', 'products.price')
            ->orderByDesc('sales')
            ->limit(10)
            ->get();
    }

    public function getRecentOrders($limit = 10)
    {
        return Order::with(['user', 'items.product.category'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    private function calculateTrend($current, $last)
    {
        if ($last == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $last) / $last) * 100, 1);
    }
}
