/**
 * OrderListPage Component
 * 
 * Main interface for tracking and managing customer orders.
 * Features multi-status tabs, advanced filtering, and bulk processing.
 */
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { RotateCcw, ShoppingBag } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import SelectionBanner from '../../Categories/Components/SelectionBanner';

// Local Components
import OrderTable from '../Components/OrderTable';
import OrderToolbar from '../Components/OrderToolbar';
import OrderStats from '../Components/OrderStats';
import OrderPagination from '../Components/OrderPagination';

const OrderListPage = ({ auth, orders, filters, stats }) => {
    // Calculate total items and items on current page for selection logic
    const totalCount = orders.meta?.total || orders.total || 0;
    const perPageCount = orders.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        title: '',
        message: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    // --- Loading Overlay Logic ---
    useEffect(() => {
        const start = (event) => {
            const isSamePage = new URL(event.detail.visit.url, window.location.origin).pathname === window.location.pathname;
            if (event.detail.visit.method === 'get' && !event.detail.visit.prefetch && !event.detail.visit.bg && isSamePage) {
                setIsProcessing(true);
            }
        };
        const finish = () => setIsProcessing(false);

        const unbindStart = router.on('start', start);
        const unbindFinish = router.on('finish', finish);

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Debounced Search

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.orders.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (status) => {
        setActiveTab(status);
        handleFilterChange('status', status);
    };

    const handleReset = () => {
        setSearch("");
        setActiveTab('all');
        router.get(route('admin.orders.index'), {}, {
            replace: true,
            preserveScroll: true,
            preserveState: true
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(orders.data.map(order => order.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(orders.data.map(order => order.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const handleExport = () => {
        const queryParams = new URLSearchParams(filters).toString();
        window.location.href = route('admin.orders.export') + '?' + queryParams;
    };

    const handleDeleteClick = (id, orderNumber) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Order',
            message: `Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Orders',
            message: `Are you sure you want to delete ${count} orders? This action cannot be undone.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.orders.bulk-destroy"), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    ...filters
                },
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.orders.destroy", deleteModal.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };
    const handleBulkStatusUpdate = (field, value) => {
        router.post(route("admin.orders.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            field,
            value,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
            }
        });
    };

    // --- Column Management ---
    const allColumns = [
        { id: 'order', label: 'Order' },
        { id: 'date', label: 'Date' },
        { id: 'customer', label: 'Customer' },
        { id: 'total', label: 'Total' },
        { id: 'payment_status', label: 'Payment status' },
        { id: 'items_count', label: 'Items' },
        { id: 'delivery_status', label: 'Delivery status' },
        { id: 'payment_method', label: 'Payment method' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'order', 'date', 'customer', 'total', 'payment_status', 'items_count', 'delivery_status', 'payment_method'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayOrders = {
        ...orders,
        data: showOnlySelected
            ? (selectAllAcrossPages ? orders.data : orders.data.filter(p => selectedIds.includes(p.id)))
            : orders.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Order Management" />

            {/* Header Section: Matches Products Layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Orders Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Track, manage and process customer orders and payments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="h-[36px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] font-bold text-[12px] hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <RotateCcw size={14} className="text-[#008060]" /> Reset Filters
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">

                {/* Stats Overview (Tabs) */}
                <OrderStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Toolbar: Search, Filters, Export */}
                <OrderToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    onExport={handleExport}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
                />

                {/* Main Table */}
                <OrderTable
                    orders={displayOrders}
                    filters={filters}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    expectedCount={activeTab === 'all' ? stats.total : stats[activeTab]}
                    visibleColumns={visibleColumns}
                />

                {/* Pagination */}
                <OrderPagination
                    orders={orders}
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal(prev => ({ ...prev, show: false }))}
                onConfirm={handleConfirmDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                processing={processingDelete}
            />
        </AdminLayout>
    );
};

export default OrderListPage;
