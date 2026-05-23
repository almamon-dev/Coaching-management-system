import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, LayoutDashboard, TrendingUp, Calendar } from 'lucide-react';

// Partials
import StatCards from './Partials/StatCards';
import RevenueChart from './Partials/RevenueChart';
import CategoryChart from './Partials/CategoryChart';
import CustomerGrowthChart from './Partials/CustomerGrowthChart';
import ProductPerformanceChart from './Partials/ProductPerformanceChart';
import RecentOrders from './Partials/RecentOrders';

/**
 * Admin Dashboard Index
 * 
 * The main overview page for administrators.
 * Displays real-time metrics, revenue trends, and recent activity.
 */
export default function Index({ auth, stats, revenue_data, category_data, customer_growth_data, product_performance_data, recent_orders }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Gadget Store Dashboard</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Welcome back, {auth.user.name}. Here's what's happening with your store today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.products.create')}
                            className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] text-[12px] font-bold shadow-sm shadow-[#008060]/10 hover:bg-[#006e52] transition-all flex items-center gap-2"
                        >
                            <Plus size={14} /> New Product
                        </Link>
                    </div>
                </div>

                {/* 2. Primary Metrics: Stat Cards */}
                <StatCards stats={stats} />

                {/* 3. Main Analytics: Revenue and Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <div className="lg:col-span-8">
                        <RevenueChart data={revenue_data} />
                    </div>
                    <div className="lg:col-span-4">
                        <CategoryChart data={category_data} />
                    </div>
                </div>

                {/* 4. Secondary Insights: Growth and Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <CustomerGrowthChart data={customer_growth_data} />
                    <ProductPerformanceChart data={product_performance_data} />
                </div>

                {/* 5. Recent Activity: Order Management Table */}
                <RecentOrders orders={recent_orders} />
            </div>
        </AdminLayout>
    );
}
