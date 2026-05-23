import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { ShieldAlert } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

// Local Components
import RepairTable from '../Components/RepairTable';
import RepairToolbar from '../Components/RepairToolbar';
import RepairStats from '../Components/RepairStats';
import RepairPagination from '../Components/RepairPagination';

const RepairListPage = ({ auth, repairs, technicians, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'ticket', label: 'Ticket #' },
        { id: 'customer', label: 'Customer' },
        { id: 'gadget', label: 'Gadget Details' },
        { id: 'date', label: 'Date Added' },
        { id: 'technician', label: 'Technician Assignee' },
        { id: 'status', label: 'Status' },
        { id: 'cost', label: 'Bill Cost' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'ticket', 'customer', 'gadget', 'date', 'technician', 'status', 'cost'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Calculate counts for selection
    const totalCount = repairs.meta?.total || repairs.total || 0;
    const perPageCount = repairs.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        title: '',
        message: '',
        isBulk: false,
        id: null
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
        router.get(route('admin.repairs.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        const base = { page: 1 };
        if (tabKey !== 'all') {
            base.status = tabKey;
        }
        router.get(route('admin.repairs.index'), base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.repairs.index'), {}, {
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
            setSelectedIds(repairs.data.map(r => r.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(repairs.data.map(r => r.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleQuickAssign = (repairId, techId) => {
        router.post(route('admin.repairs.assign', repairId), {
            technician_id: techId
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleQuickStatus = (repairId, status) => {
        router.post(route('admin.repairs.update-status', repairId), {
            status: status
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            title: 'Bulk Delete Tickets',
            message: `Are you sure you want to delete ${count} selected repair tickets? This action will restore related parts stock and cannot be undone.`,
            isBulk: true,
            id: null
        });
    };

    const handleDeleteClick = (id, ticketNumber) => {
        setDeleteModal({
            show: true,
            title: 'Delete Repair Ticket',
            message: `Are you sure you want to delete repair ticket "${ticketNumber}"? This action will restore related parts stock and cannot be undone.`,
            isBulk: false,
            id: id
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        const deleteIds = deleteModal.isBulk 
            ? (selectAllAcrossPages ? [] : selectedIds) 
            : [deleteModal.id];
        const isAll = deleteModal.isBulk ? selectAllAcrossPages : false;

        router.delete(route("admin.repairs.bulk-destroy"), {
            data: {
                ids: deleteIds,
                all: isAll,
                ...filters
            },
            onSuccess: () => {
                if (deleteModal.isBulk) {
                    handleClearSelection();
                } else {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                }
                setDeleteModal(prev => ({ ...prev, show: false, id: null }));
                setProcessingDelete(false);
            },
            onError: () => setProcessingDelete(false)
        });
    };

    const handleMarkAsStatus = (value) => {
        router.post(route("admin.repairs.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            status: value,
            ...filters
        }, {
            onSuccess: () => {
                handleClearSelection();
            }
        });
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayRepairs = {
        ...repairs,
        data: showOnlySelected
            ? (selectAllAcrossPages ? repairs.data : repairs.data.filter(r => selectedIds.includes(r.id)))
            : repairs.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Repair & Servicing Queue" />

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Gadget Repairs & Servicing</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage custom repair tickets, assign staff engineers, track inventories of spare parts, and verify billing.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={route('kiosk.index')}
                        target="_blank"
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                    >
                        Open Store Tablet Kiosk
                    </Link>
                </div>
            </div>

            {/* --- Main Content Panel --- */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Top Metrics tabs bar */}
                <RepairStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Toolbar containing search, filters, columns toggle, and bulk options */}
                <RepairToolbar
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
                    technicians={technicians}
                    handleBulkDeleteClick={handleBulkDeleteClick}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    handleMarkAsStatus={handleMarkAsStatus}
                />

                {/* Central Data Table view */}
                <RepairTable
                    repairs={displayRepairs}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    technicians={technicians}
                    handleQuickAssign={handleQuickAssign}
                    handleQuickStatus={handleQuickStatus}
                    isProcessing={isProcessing}
                    activeTab={activeTab}
                    stats={stats}
                    visibleColumns={visibleColumns}
                    handleDelete={handleDeleteClick}
                />

                {/* Bottom Pagination controls */}
                <RepairPagination
                    repairs={repairs}
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Bulk Deletion Modal */}
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

export default RepairListPage;
