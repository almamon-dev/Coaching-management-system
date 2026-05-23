/**
 * CouponListPage Component
 * 
 * Interface for managing marketing campaigns and discount codes.
 * Features discount type filtering, usage tracking, and bulk status updates.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus, Search, Tag } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import CategoryPagination from '@/Pages/Admin/Categories/Components/CategoryPagination';

// Local Components
import CouponStats from '../Components/CouponStats';
import CouponToolbar from '../Components/CouponToolbar';
import CouponTable from '../Components/CouponTable';
import SelectionBanner from '../Components/SelectionBanner';
import CouponBulkActionBar from '../Components/CouponBulkActionBar';

const CouponListPage = ({ auth, campaigns, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'coupon', label: 'Coupon' },
        { id: 'code', label: 'Promo Code' },
        { id: 'discount', label: 'Discount' },
        { id: 'min_purchase', label: 'Min. Purchase' },
        { id: 'usage', label: 'Usage (Used/Limit)' },
        { id: 'status', label: 'Status' },
        { id: 'expiry', label: 'Expiry Date' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'coupon', 'code', 'discount', 'min_purchase', 'usage', 'status', 'expiry'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({ 
        show: false, 
        id: null, 
        name: '', 
        isBulk: false,
        title: '',
        message: ''
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    // --- Loading State Logic ---
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
        return () => { unbindStart(); unbindFinish(); };
    }, []);

    // --- Debounced Search ---
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
        router.get(route("admin.marketing.coupons.index"), { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleTabChange = (status) => {
        setActiveTab(status);
        handleFilterChange('status', status === 'all' ? '' : status);
    };

    const handleReset = () => {
        setSearch("");
        router.get(route("admin.marketing.coupons.index"), {}, {
            preserveScroll: true,
            replace: true,
            preserveState: true
        });
    };

    // --- Selection Logic ---
    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(campaigns.data.map(item => item.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(campaigns.data.map(item => item.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    // --- Bulk Action Handlers ---
    const handleDeleteClick = (id, name) => {
        setDeleteModal({ 
            show: true, 
            id, 
            name, 
            isBulk: false,
            title: 'Delete Coupon',
            message: `Are you sure you want to delete "${name}"? This action will remove the discount from all orders.`
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? (campaigns.total || 0) : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            name: '',
            isBulk: true,
            title: 'Bulk Delete Coupons',
            message: `Are you sure you want to delete ${count} coupons? This action cannot be undone.`
        });
    };

    const handleMarkAsStatus = (status) => {
        router.post(route("admin.marketing.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            status: status,
            ...filters
        }, {
            onSuccess: () => handleClearSelection(),
            preserveScroll: true
        });
    };

    const confirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            router.delete(route("admin.marketing.bulk-destroy"), {
                data: {
                    ids: selectAllAcrossPages ? [] : selectedIds,
                    all: selectAllAcrossPages,
                    ...filters
                },
                onSuccess: () => {
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    handleClearSelection();
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.marketing.campaigns.destroy", deleteModal.id), {
                onSuccess: () => {
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    // Filter display items for "Show only selected"
    const displayCampaigns = {
        ...campaigns,
        data: showOnlySelected
            ? (selectAllAcrossPages ? campaigns.data : campaigns.data.filter(p => selectedIds.includes(p.id)))
            : campaigns.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Coupons Management" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Coupons Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage discount codes, percentage offers, and usage limits</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route("admin.marketing.campaigns.create", { type: 'coupon' })}
                        className="px-5 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Plus size={14} /> Add Coupon
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* Stats Overview */}
                <CouponStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Toolbar & Bulk Actions */}
                <CouponToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    selectedIds={selectedIds}
                    totalCount={campaigns.total || 0}
                    perPageCount={campaigns.data?.length || 0}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    selectAllAcrossPages={selectAllAcrossPages}
                    handleClearSelection={handleClearSelection}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    handleMarkAsStatus={handleMarkAsStatus}
                />

                {/* Main Data Table */}
                <CouponTable
                    campaigns={displayCampaigns}
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    handleDeleteClick={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                    selectAllAcrossPages={selectAllAcrossPages}
                />

                {/* Pagination Controls */}
                <CategoryPagination
                    categories={campaigns}
                    filters={filters}
                    handlePerPageChange={(e) => handleFilterChange('per_page', e.target.value)}
                    handlePageChange={(url) => url && router.get(url, {}, { preserveScroll: true, preserveState: true })}
                />
            </div>

            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal(prev => ({ ...prev, show: false }))}
                onConfirm={confirmDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                processing={processingDelete}
            />
        </AdminLayout>
    );
};

export default CouponListPage;
