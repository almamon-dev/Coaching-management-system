import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Search, 
    RefreshCcw, 
    Truck, 
    CheckCircle, 
    Clock, 
    Package, 
    XCircle,
    Eye,
    ChevronRight
} from 'lucide-react';

const Tracking = ({ auth, orders, filters }) => {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusTab, setStatusTab] = useState(filters?.status || 'all');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const start = () => setIsProcessing(true);
        const finish = () => setIsProcessing(false);
        const unbindStart = router.on('start', start);
        const unbindFinish = router.on('finish', finish);
        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Filter change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.logistics.tracking.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleTabChange = (status) => {
        setStatusTab(status);
        const newFilters = { ...filters, status: status === 'all' ? undefined : status, page: 1 };
        router.get(route('admin.logistics.tracking.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatusTab('all');
        router.get(route('admin.logistics.tracking.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500', icon: Clock },
            processing: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', dot: 'bg-indigo-500', icon: Package },
            shipped: { bg: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500', icon: Truck },
            delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500', icon: CheckCircle },
            cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500', icon: XCircle },
        };
        const config = badges[status] || badges.pending;
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${config.bg}`}>
                <Icon size={12} className="shrink-0" />
                {status}
            </span>
        );
    };

    // Calculate progression percentage
    const getProgressionPercentage = (status) => {
        const stages = {
            pending: 10,
            processing: 40,
            shipped: 75,
            delivered: 100,
            cancelled: 0
        };
        return stages[status] !== undefined ? stages[status] : 10;
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Logistics & Order Tracking" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Order Shipment Tracking</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Monitor delivery statuses and shipping pipelines for active orders</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-200 gap-1 mb-6 overflow-x-auto pb-px">
                {[
                    { label: 'All Orders', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Cancelled', value: 'cancelled' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-all whitespace-nowrap ${
                            statusTab === tab.value
                                ? 'border-[#008060] text-[#008060]'
                                : 'border-transparent text-slate-550 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Order number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#008060] transition-colors bg-white shadow-inner"
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-650 transition-colors bg-white shrink-0"
                        title="Reset filters"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-[12px] uppercase tracking-wider">
                                <th className="px-6 py-3 w-[150px]">Order ID</th>
                                <th className="px-6 py-3">Customer & Destination</th>
                                <th className="px-6 py-3 w-[250px]">Delivery Progress</th>
                                <th className="px-6 py-3">Total Cost</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                            {orders && orders.data && orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Truck size={40} className="text-slate-300" />
                                            <span>No shipments found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders && orders.data && orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="block font-bold text-slate-800 text-[13.5px]">#{order.order_number}</span>
                                            <span className="block text-[11px] text-slate-400 mt-0.5">
                                                Placed: {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="block font-semibold text-slate-800">{order.user?.name || 'Guest Customer'}</span>
                                            {order.shipping_address ? (
                                                <span className="block text-[11.5px] text-slate-400 mt-0.5 max-w-[280px] truncate" title={`${order.shipping_address.address}, ${order.shipping_address.area}, ${order.shipping_address.city}`}>
                                                    {order.shipping_address.address}, {order.shipping_address.area}, {order.shipping_address.city}
                                                </span>
                                            ) : (
                                                <span className="block text-[11.5px] text-slate-400 mt-0.5">No Address Saved</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.status === 'cancelled' ? (
                                                <span className="text-[12px] text-rose-500 font-bold italic">Shipment Cancelled</span>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-450 font-bold mb-1">
                                                        <span>Progress</span>
                                                        <span>{getProgressionPercentage(order.status)}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                        <div 
                                                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                                                            style={{ width: `${getProgressionPercentage(order.status)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            ৳{parseFloat(order.total_amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('admin.orders.show', order.id)} 
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-bold text-slate-650 hover:text-[#008060] border border-slate-200 rounded-lg hover:bg-slate-50 transition-all bg-white shadow-sm"
                                            >
                                                Details <ChevronRight size={13} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders && orders.links && orders.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-[12px] text-slate-500">
                            Showing {orders.from || 0} to {orders.to || 0} of {orders.total} orders
                        </span>
                        <div className="flex gap-1">
                            {orders.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url, filters, { preserveScroll: true, preserveState: true })}
                                    className={`px-3 py-1 rounded text-[12px] font-medium border transition-colors ${
                                        link.active 
                                            ? 'bg-[#008060] border-[#008060] text-white' 
                                            : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Tracking;
