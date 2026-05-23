/**
 * BrandListPage Component
 * 
 * Main interface for managing product brands.
 * Features advanced filtering, bulk status updates, and deletion.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import SelectionBanner from '../../Categories/Components/SelectionBanner';

// Local Components
import BrandTable from '../Components/BrandTable';
import BrandToolbar from '../Components/BrandToolbar';
import BrandStats from '../Components/BrandStats';
import BrandPagination from '../Components/BrandPagination';

const BrandListPage = ({ auth, brands, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'brand', label: 'Brand' },
        { id: 'slug', label: 'Slug/URL' },
        { id: 'products', label: 'Product Count' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Created At' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'brand', 'slug', 'products', 'status', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // CursorPaginator does not have a total field — use stats.total instead
    const totalCount = stats?.total || 0;
    const perPageCount = brands.data?.length || 0;

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
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters?.search || "";
            if (search !== currentSearch) {
                setIsProcessing(true);
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.brands.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        const base = { page: 1 };
        const tabFilters = {
            all: { ...base },
            active: { ...base, status: 'active' },
            inactive: { ...base, status: 'inactive' },
            withLogo: { ...base, has_logo: '1' },
            noLogo: { ...base, has_logo: '0' },
        };
        router.get(route('admin.brands.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setActiveTab('all');
        router.get(route('admin.brands.index'), {}, { 
            replace: true, 
            preserveScroll: true,
            preserveState: true 
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(brands.data.map(brand => brand.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(brands.data.map(brand => brand.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Brand',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Brands',
            message: `Are you sure you want to delete ${count} brands? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.brands.bulk-destroy"), {
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
            router.delete(route("admin.brands.destroy", deleteModal.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    const handleMarkAsStatus = (value) => {
        router.post(route("admin.brands.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            field: 'status',
            value,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
                Notify.success('Updated', 'Selected brands updated successfully');
            }
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayBrands = {
        ...brands,
        data: showOnlySelected
            ? (selectAllAcrossPages ? brands.data : brands.data.filter(p => selectedIds.includes(p.id)))
            : brands.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Brands Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Brand Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage product brands and their visibility</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.brands.create')}
                        prefetch
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm shadow-[#008060]/10"
                    >
                        <Plus size={14} /> Add Brand
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview */}
                <BrandStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <BrandToolbar
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
                    handleMarkAsStatus={handleMarkAsStatus}
                />

                {/* Main Data Table */}
                <BrandTable
                    brands={displayBrands}
                    filters={filters}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    activeTab={activeTab}
                    stats={stats}
                    visibleColumns={visibleColumns}
                />

                {/* Pagination Controls */}
                <BrandPagination
                    brands={brands}
                    filters={filters}
                    stats={stats}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Premium Delete Confirmation Modal */}
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

export default BrandListPage;
