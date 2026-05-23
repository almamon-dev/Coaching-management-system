/**
 * QuestionListPage Component
 * 
 * Interface for managing and answering product queries from customers.
 * Features question reply moderation, status management, and bulk deletion.
 */
import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import { Plus, Search, MessageSquare, HelpCircle } from 'lucide-react';

// Shared Components
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Notify from '@/Utils/Notify';

// Local Components
import QuestionTable from '../Components/QuestionTable';
import QuestionToolbar from '../Components/QuestionToolbar';
import QuestionStats from '../Components/QuestionStats';
import QuestionPagination from '../Components/QuestionPagination';
import QuestionSelectionBanner from '../Components/QuestionSelectionBanner';
import QuestionReplyModal from '../Components/QuestionReplyModal';

const QuestionListPage = ({ auth, questions, filters, stats }) => {
    // --- Column Management ---
    const allColumns = [
        { id: 'question', label: 'Question' },
        { id: 'product', label: 'Product' },
        { id: 'customer', label: 'Customer' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Date' },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        'question', 'product', 'customer', 'status', 'created_at'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const displayQuestions = {
        ...questions,
        data: showOnlySelected
            ? (selectAllAcrossPages ? questions.data : questions.data.filter(q => selectedIds.includes(q.id)))
            : questions.data
    };

    // Calculate total items and items on current page for selection logic
    const totalCount = questions.meta?.total || questions.total || 0;
    const perPageCount = questions.data?.length || 0;

    // --- State Management ---
    const [search, setSearch] = useState(filters?.search || "");
    const [activeTab, setActiveTab] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]); // IDs of selected rows on the current page
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false); // Global selection flag
    const [isProcessing, setIsProcessing] = useState(false);
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
    const [replyingTo, setReplyingTo] = useState(null);

    // --- Modal State ---
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        id: null,
        title: '',
        message: '',
        isBulk: false
    });
    const [processingDelete, setProcessingDelete] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        answer: '',
    });

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
        router.get(route('admin.questions.index'), newFilters, {
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
            pending: { ...base, status: 'pending' },
            answered: { ...base, status: 'answered' },
            today: { ...base, date_range: 'today' },
        };
        router.get(route('admin.questions.index'), tabFilters[tabKey] || base, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.questions.index'), {}, { 
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
            setSelectedIds(questions.data.map(q => q.id));
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(questions.data.map(q => q.id));
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({
            show: true,
            id,
            title: 'Delete Question',
            message: `Are you sure you want to delete this question? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        const count = selectAllAcrossPages ? totalCount : selectedIds.length;
        setDeleteModal({
            show: true,
            id: null,
            title: 'Bulk Delete Questions',
            message: `Are you sure you want to delete ${count} questions? This will permanently remove them from the system.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);

        if (deleteModal.isBulk) {
            router.post(route("admin.questions.bulk-destroy"), {
                ids: selectAllAcrossPages ? [] : selectedIds,
                all: selectAllAcrossPages,
                ...filters
            }, {
                onSuccess: () => {
                    Notify.success('Deleted', 'Questions removed successfully.');
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        } else {
            router.delete(route("admin.questions.destroy", deleteModal.id), {
                onSuccess: () => {
                    Notify.success('Deleted', 'Question removed successfully.');
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                },
                onError: () => setProcessingDelete(false)
            });
        }
    };

    const handleBulkStatusUpdate = (status) => {
        router.post(route("admin.questions.bulk-update-status"), {
            ids: selectAllAcrossPages ? [] : selectedIds,
            all: selectAllAcrossPages,
            status,
            ...filters
        }, {
            onSuccess: () => {
                Notify.success('Updated', `Questions marked as ${status} successfully.`);
                handleClearSelection();
            },
            preserveScroll: true
        });
    };

    const handleReply = (q) => {
        setReplyingTo(q);
        setData('answer', q.answer || '');
    };

    const handleReplySubmit = () => {
        post(route('admin.questions.answer', replyingTo.id), {
            onSuccess: () => {
                Notify.success('Reply Sent', 'Your answer has been published successfully.');
                setReplyingTo(null);
                reset();
            },
            onError: () => Notify.error('Error', 'Failed to save answer. Please try again.')
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Product Questions" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">
                        Customer Questions
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage and answer product queries from your customers</p>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Stats Overview */}
                <QuestionStats stats={stats} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Toolbar */}
                <QuestionToolbar
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

                {/* Main Data Table */}
                <QuestionTable
                    questions={displayQuestions}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleReply={handleReply}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    activeTab={activeTab}
                    stats={stats}
                    visibleColumns={visibleColumns}
                />

                {/* Pagination Controls */}
                <QuestionPagination
                    questions={questions}
                    filters={filters}
                    total={stats ? (stats[activeTab === 'all' ? 'total' : activeTab] ?? stats.total ?? 0) : 0}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Reply Modal Partial */}
            <QuestionReplyModal
                replyingTo={replyingTo}
                onClose={() => setReplyingTo(null)}
                data={data}
                setData={setData}
                post={handleReplySubmit}
                processing={processing}
                errors={errors}
            />

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

export default QuestionListPage;
