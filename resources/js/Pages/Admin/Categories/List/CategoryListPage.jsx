/**
 * CategoryListPage Component
 * 
 * High-performance interface for managing the category hierarchy.
 * Features nested table views, status management, and bulk actions.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus, Search, Sparkles } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

// Local Components
import CategoryTable from '../Components/CategoryTable';
import CategoryToolbar from '../Components/CategoryToolbar';
import CategoryStats from '../Components/CategoryStats';
import CategoryPagination from '../Components/CategoryPagination';

const CategoryListPage = ({ auth, categories, filters, stats, rootCategories, allSubCategories, allSubSubCategories }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'category', label: 'Category' },
        { id: 'parent', label: 'Parent' },
        { id: 'slug', label: 'Slug/URL' },
        { id: 'products', label: 'Product Count' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Created At' },
        { id: 'updated_at', label: 'Updated At' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'category', 'parent', 'slug', 'products', 'status', 'created_at', 'updated_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Calculate total items and items on current page for selection logic
    const totalCount = categories.meta?.total || categories.total || 0;
    const perPageCount = categories.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || (filters?.root_type || 'all'));
    const [selectedIds, setSelectedIds] = useState([]); // IDs of selected rows on the current page
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false); // Global selection flag
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
                setIsProcessing(true); // Trigger skeleton immediately for better UX
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };

        // Logical reset for sub-categories when a parent changes
        if (key === 'root_id') {
            newFilters.sub_id = 'all';
            newFilters.sub_sub_id = 'all';
        } else if (key === 'sub_id') {
            newFilters.sub_sub_id = 'all';
        }

        router.get(route('admin.categories.index'), newFilters, {
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
            root: { ...base, root_type: 'root' },
            sub: { ...base, root_type: 'sub' },
            sub_sub: { ...base, root_type: 'sub_sub' },
            withImage: { ...base, has_image: '1' },
            noImage: { ...base, has_image: '0' },
        };
        router.get(route('admin.categories.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.categories.index'), {}, {
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
            setSelectedIds(categories.data.map(cat => cat.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(categories.data.map(cat => cat.id));
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
            title: 'Delete Category',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Categories',
            message: `Are you sure you want to delete ${count} categories? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.categories.bulk-destroy"), {
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
            router.delete(route("admin.categories.destroy", deleteModal.id), {
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
        router.post(route("admin.categories.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            is_active: value,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
            }
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayCategories = {
        ...categories,
        data: showOnlySelected
            ? (selectAllAcrossPages ? categories.data : categories.data.filter(p => selectedIds.includes(p.id)))
            : categories.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Category Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Category Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Organize and manage your product catalog hierarchy</p>
                </div>
                <div className="flex items-center gap-2">

                    <Link
                        href={route('admin.categories.create')}
                        prefetch
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm shadow-[#008060]/10"
                    >
                        <Plus size={14} /> Add Category
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview */}
                <CategoryStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <CategoryToolbar
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
                    rootCategories={rootCategories}
                    allSubCategories={allSubCategories}
                    allSubSubCategories={allSubSubCategories}
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
                <CategoryTable
                    categories={displayCategories}
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
                <CategoryPagination
                    categories={categories}
                    filters={filters}
                    total={stats ? (stats[activeTab === 'all' ? 'total' : activeTab] ?? stats.total ?? 0) : 0}
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

export default CategoryListPage;
