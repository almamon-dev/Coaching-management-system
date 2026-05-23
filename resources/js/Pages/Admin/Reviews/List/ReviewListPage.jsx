/**
 * ReviewListPage Component
 * 
 * Interface for moderating customer product reviews.
 * Features rating filters, status management, and bulk deletion.
 */
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Star, MessageSquare } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import SelectionBanner from '../../Categories/Components/SelectionBanner';
import Notify from '@/Utils/Notify';

// Local Components
import ReviewStats from '../Components/ReviewStats';
import ReviewToolbar from '../Components/ReviewToolbar';
import ReviewTable from '../Components/ReviewTable';
import ReviewSkeleton from '../Components/ReviewSkeleton';
import ReviewPagination from '../Components/ReviewPagination';

const ReviewListPage = ({ auth, reviews, filters, stats }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [activeTab, setActiveTab] = useState(filters?.status || (filters?.date_range === 'today' ? 'today' : 'all'));

    // --- Column Management ---
    const allColumns = [
        { id: 'rating', label: 'Rating' },
        { id: 'product', label: 'Product' },
        { id: 'customer', label: 'Customer' },
        { id: 'comment', label: 'Comment' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Date' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'rating', 'product', 'customer', 'comment', 'status', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayReviews = {
        ...reviews,
        data: showOnlySelected
            ? (selectAllAcrossPages ? reviews.data : reviews.data.filter(r => selectedIds.includes(r.id)))
            : reviews.data
    };

    const totalCount = reviews.meta?.total || reviews.total || 0;
    const perPageCount = reviews.data?.length || 0;

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        title: '',
        message: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    // Listen for Inertia navigation events to show loading state
    useEffect(() => {
        const start = (event) => {
            const isSamePage = new URL(event.detail.visit.url, window.location.origin).pathname === window.location.pathname;
            if (event.detail.visit.method === 'get' && !event.detail.visit.prefetch && !event.detail.visit.bg && isSamePage) {
                setIsLoading(true);
            }
        };
        const finish = () => setIsLoading(false);

        const unbindStart = router.on('start', start);
        const unbindFinish = router.on('finish', finish);

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Debounced Search logic for "live" skeleton feel
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters?.search || "";
            if (search !== currentSearch) {
                setIsLoading(true); // Trigger skeleton immediately for better UX
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route("admin.reviews.index"), { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(reviews.data.map(q => q.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(reviews.data.map(q => q.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    /**
     * Handles tab clicks — maps tab key to the appropriate filter(s)
     * Follows Category management's dynamic filtering pattern.
     */
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        const base = { page: 1 };
        const tabFilters = {
            all: { ...base },
            published: { ...base, status: 'published' },
            hidden: { ...base, status: 'hidden' },
            today: { ...base, date_range: 'today' },
        };

        router.get(route('admin.reviews.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    /**
     * Triggers the delete confirmation modal for a single review
     */
    const handleDeleteClick = (id, name) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Review',
            message: `Are you sure you want to delete this review from "${name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    /**
     * Triggers the bulk delete confirmation modal
     */
    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Reviews',
            message: `Are you sure you want to delete ${count} reviews? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    /**
     * Sends the delete request(s) to the server
     */
    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.post(route("admin.reviews.bulk-destroy"), {
                ids: selectAllAcrossPages ? [] : selectedIds,
                all: selectAllAcrossPages,
                ...filters
            }, {
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Success', 'Selected reviews deleted successfully');
                },
                onError: () => setProcessingDelete(false),
                preserveScroll: true
            });
        } else {
            router.delete(route("admin.reviews.destroy", deleteModal.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Success', 'Review deleted successfully');
                },
                onError: () => setProcessingDelete(false),
                preserveScroll: true
            });
        }
    };

    /**
     * Sends the bulk status update request to the server
     */
    const handleBulkStatusUpdate = (status) => {
        router.post(route("admin.reviews.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            status,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
                Notify.success('Success', `Selected reviews ${status === 1 ? 'published' : 'hidden'} successfully`);
            },
            preserveScroll: true
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.reviews.index'), {}, { 
            replace: true,
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Product Reviews - Star Tech Admin" />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">
                        Customer Reviews
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage and moderate product reviews from your customers</p>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview (Dynamic Tab Handling) */}
                <ReviewStats
                    stats={stats}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Toolbar */}
                <ReviewToolbar
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
                    handleBulkStatusUpdate={handleBulkStatusUpdate}
                />

                <ReviewTable
                    reviews={displayReviews}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isLoading}
                    activeTab={activeTab}
                    stats={stats}
                    visibleColumns={visibleColumns}
                />

                <ReviewPagination
                    reviews={reviews}
                    filters={filters}
                    handlePageChange={handlePageChange}
                    handlePerPageChange={handlePerPageChange}
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

export default ReviewListPage;
