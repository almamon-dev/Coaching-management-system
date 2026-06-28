import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import Notify from '@/Utils/Notify';

// Local Components
import PageStats from '../Components/PageStats';
import PageToolbar from '../Components/PageToolbar';
import PageTable from '../Components/PageTable';
import PagePagination from '../Components/PagePagination';

const PageListPage = ({ auth, pages, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'title', label: 'Page Info' },
        { id: 'slug', label: 'Slug/Route' },
        { id: 'meta', label: 'Search Engine Metadata' },
        { id: 'status', label: 'Status' },
        { id: 'updated_at', label: 'Last Updated' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'title', 'slug', 'meta', 'status', 'updated_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const totalCount = stats?.total || 0;
    const perPageCount = pages.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        page: null,
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
        router.get(route('admin.pages.index'), newFilters, {
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
            system: { ...base, status: 'system' }
        };
        router.get(route('admin.pages.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setActiveTab('all');
        router.get(route('admin.pages.index'), {}, { 
            replace: true, 
            preserveScroll: true,
            preserveState: true 
        });
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
            setSelectedIds(pages.data.map(page => page.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(pages.data.map(page => page.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (page) => {
        setDeleteModal({
            show: true,
            page,
            title: 'Delete Page',
            message: `Are you sure you want to delete "${page.title}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            page: null,
            title: 'Bulk Delete Pages',
            message: `Are you sure you want to delete ${count} pages? System protected pages will automatically be skipped.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.delete(route("admin.pages.bulk-destroy"), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    ...filters
                },
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    Notify.success('Deleted', 'Selected pages deleted successfully');
                },
                onFinish: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.pages.destroy", deleteModal.page.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.page.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    Notify.success('Deleted', 'Page deleted successfully');
                },
                onFinish: () => setProcessingDelete(false)
            });
        }
    };

    const handleMarkAsStatus = (value) => {
        router.post(route("admin.pages.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            is_active: value === 1,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
                Notify.success('Updated', 'Selected pages updated successfully');
            }
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayPages = {
        ...pages,
        data: showOnlySelected
            ? (selectAllAcrossPages ? pages.data : pages.data.filter(p => selectedIds.includes(p.id)))
            : pages.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Page Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Page Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Create and manage dynamic public site pages</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.pages.create')}
                        prefetch
                        className="h-[36px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm shadow-[#008060]/10"
                    >
                        <Plus size={14} /> Add New Page
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview */}
                <PageStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Search, Bulk Actions, and Filters */}
                <PageToolbar
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
                <PageTable
                    pages={displayPages}
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
                <PagePagination
                    pages={pages}
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
                />
            </div>

            {/* Premium Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal(prev => ({ ...prev, show: false, page: null }))}
                onConfirm={handleConfirmDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                processing={processingDelete}
            />
        </AdminLayout>
    );
};

export default PageListPage;
