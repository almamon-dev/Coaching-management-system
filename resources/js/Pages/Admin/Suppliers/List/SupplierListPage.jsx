import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

// Partials
import SupplierTable from '../Components/SupplierTable';
import SupplierToolbar from '../Components/SupplierToolbar';
import SupplierStats from '../Components/SupplierStats';
import SupplierPagination from '../Components/SupplierPagination';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Notify from '@/Utils/Notify';

/**
 * Supplier Management Index
 * Achieves 100% design and functional parity with the Category management system.
 */
const Index = ({ auth, suppliers, filters, stats, brands }) => {
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);

    // Selection State
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

    // Column Management
    const allColumns = [
        { id: 'supplier', label: 'Supplier Info' },
        { id: 'contact', label: 'Contact Person' },
        { id: 'brands', label: 'Associated Brands' },
        { id: 'phone', label: 'Phone' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Joined Date' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(allColumns.map(c => c.id));

    // Delete State
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        title: '',
        message: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    // Router Event Listeners for Skeleton Loading
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

    // Debounced Search logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || "")) {
                setIsProcessing(true);
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.suppliers.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        handleFilterChange('status', tabKey);
    };

    const handleReset = () => {
        setSearch("");
        setActiveTab('all');
        router.get(route('admin.suppliers.index'), {}, {
            replace: true,
            preserveScroll: true,
            preserveState: true
        });
    };

    // Selection Handlers
    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(suppliers.data.map(s => s.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(suppliers.data.map(s => s.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const toggleColumn = (id) => {
        setVisibleColumns(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Delete Handlers
    const handleDeleteClick = (id, name) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Supplier',
            message: `Are you sure you want to delete "${name}"? This will also remove its brand associations.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? suppliers.total : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Suppliers',
            message: `Are you sure you want to delete ${count} suppliers? This action cannot be undone.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        const routeName = deleteModal.isBulk ? "admin.suppliers.bulk-destroy" : "admin.suppliers.destroy";
        const data = deleteModal.isBulk ? { ids: selectAllAcrossPages ? [] : selectedIds, all: selectAllAcrossPages, ...filters } : {};
        const url = deleteModal.isBulk ? route(routeName) : route(routeName, deleteModal.id);

        router.delete(url, {
            data,
            onSuccess: () => {
                Notify.success('Success', deleteModal.isBulk ? 'Suppliers deleted successfully.' : 'Supplier deleted successfully.');
                handleClearSelection();
                setDeleteModal(prev => ({ ...prev, show: false }));
                setProcessingDelete(false);
            },
            onError: () => setProcessingDelete(false)
        });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    // Filter display data based on showOnlySelected toggle
    const displaySuppliers = {
        ...suppliers,
        data: showOnlySelected
            ? (selectAllAcrossPages ? suppliers.data : suppliers.data.filter(s => selectedIds.includes(s.id)))
            : suppliers.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Supplier Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Supplier Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage your vendors, contacts, and associated brands</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.suppliers.create')}
                        prefetch
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Plus size={14} /> Add Supplier
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* Stats Overview */}
                <SupplierStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Toolbar (Includes Bulk Actions, Search, Filters, Columns) */}
                <SupplierToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    totalCount={suppliers.total}
                    perPageCount={suppliers.data.length}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    handleClearSelection={handleClearSelection}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    brands={brands}
                />

                {/* Main Data Table */}
                <SupplierTable
                    suppliers={displaySuppliers}
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                    activeTab={activeTab}
                    stats={stats}
                />

                {/* Pagination Controls */}
                <SupplierPagination
                    suppliers={suppliers}
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

export default Index;
