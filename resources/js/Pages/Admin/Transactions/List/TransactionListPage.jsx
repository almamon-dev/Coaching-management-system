import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';

// Partials
import TransactionStats from '../Components/TransactionStats';
import TransactionToolbar from '../Components/TransactionToolbar';
import TransactionTable from '../Components/TransactionTable';
import TransactionPagination from '../Components/TransactionPagination';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import { Trash2 } from 'lucide-react';
import Notify from '@/Utils/Notify';

/**
 * Transaction History Index
 * 
 * Displays a comprehensive list of financial transactions with 
 * filtering, search, and detailed status tracking.
 * Achieves 100% parity with the Category management module design.
 */
export default function Index({ auth, transactions, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState(filters?.status || 'all');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    
    // Selection State
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

    // Delete State
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
    const [processingDelete, setProcessingDelete] = useState(false);

    // Column Management
    const allColumns = [
        { id: 'transaction_id', label: 'Transaction ID' },
        { id: 'order_id', label: 'Order ID' },
        { id: 'customer', label: 'Customer' },
        { id: 'payment_method', label: 'Payment Method' },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' },
        { id: 'date', label: 'Date' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(allColumns.map(c => c.id));

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
        router.get(route('admin.transactions.index'), newFilters, {
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
        router.get(route('admin.transactions.index'), {}, {
            replace: true,
            preserveScroll: true,
            preserveState: true
        });
    };

    // Selection Handlers
    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(transactions.data.map(t => t.id));
        }
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(transactions.data.map(t => t.id));
    };

    const toggleColumn = (id) => {
        setVisibleColumns(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    // Delete Handlers
    const handleDelete = (id, name) => {
        setDeleteModal({
            show: true,
            id,
            title: `Delete Transaction ${name}`,
            message: 'Are you sure you want to delete this transaction record? This action cannot be undone.'
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        router.delete(route('admin.transactions.destroy', deleteModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                Notify.success('Success', 'Transaction deleted successfully.');
                setDeleteModal({ show: false, id: null, title: '' });
                setProcessingDelete(false);
            },
            onError: () => {
                Notify.error('Error', 'Failed to delete transaction.');
                setProcessingDelete(false);
            }
        });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    // Filter display data based on showOnlySelected toggle
    const displayTransactions = {
        ...transactions,
        data: showOnlySelected
            ? (selectAllAcrossPages ? transactions.data : transactions.data.filter(t => selectedIds.includes(t.id)))
            : transactions.data
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Transaction History" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Transaction History</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Monitor all financial transactions and payment statuses</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm group">
                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export History
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                {/* 1. Transaction Stats Bar */}
                <TransactionStats 
                    stats={stats} 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                />

                {/* 2. Toolbar (Includes Bulk Actions, Search, Filters) */}
                <TransactionToolbar 
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    totalCount={transactions.total}
                    displayCount={transactions.data.length}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    perPageCount={transactions.data.length}
                    handleClearSelection={handleClearSelection}
                    handleSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />

                {/* 3. Main Data Table with Skeletons */}
                <TransactionTable 
                    transactions={displayTransactions} 
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    handleDelete={handleDelete}
                    visibleColumns={visibleColumns}
                    isProcessing={isProcessing}
                />

                {/* 4. Pagination Controls */}
                <TransactionPagination 
                    transactions={transactions} 
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
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
}
