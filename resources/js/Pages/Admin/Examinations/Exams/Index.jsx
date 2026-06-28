import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import ExamTable from './Components/ExamTable';
import ExamToolbar from './Components/ExamToolbar';
import Pagination from '@/Components/Common/Pagination';
import ExamStats from './Components/ExamStats';
import Notify from '@/Utils/Notify';

export default function Index({ auth, exams, sessions, filters, stats }) {
    const allColumns = [
        { id: 'name', label: 'Exam Name' },
        { id: 'academic_session', label: 'Academic Session' },
        { id: 'start_date', label: 'Start Date' },  
        { id: 'end_date', label: 'End Date' },
        { id: 'status', label: 'Status' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(['name', 'academic_session', 'start_date', 'end_date', 'status']);

    const toggleColumn = (id) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const totalCount = exams?.meta?.total || exams?.total || 0;
    const perPageCount = exams?.data?.length || 0;

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        show: false,
        exam: null,
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
        return () => { unbindStart(); unbindFinish(); };
    }, []);

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
        router.get(route('admin.exams.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.exams.index'), {}, { replace: true, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const availableBulkIds = useMemo(() => exams?.data?.map(u => u.id) || [], [exams?.data]);

    const toggleSelect = (id) => {
        if (selectAllAcrossPages) setSelectAllAcrossPages(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length > 0 || selectAllAcrossPages) {
            handleClearSelection();
        } else {
            setSelectedIds(availableBulkIds);
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
        setSelectedIds(availableBulkIds);
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleDeleteClick = (exam) => {
        setDeleteModal({
            show: true,
            exam,
            title: 'Delete Exam',
            message: `Are you sure you want to delete "${exam.name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        setDeleteModal({
            show: true,
            exam: null,
            title: 'Bulk Delete Exams',
            message: `Are you sure you want to delete ${selectAllAcrossPages ? totalCount : selectedIds.length} exams? This will permanently remove them.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            router.post(route("admin.exams.bulk-destroy"), { ids: selectedIds }, {
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Deleted', 'Exams have been deleted.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete exams.');
                }
            });
        } else {
            router.delete(route("admin.exams.destroy", deleteModal.exam.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.exam.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Deleted', 'Exam has been deleted.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete exam.');
                }
            });
        }
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const displayExams = useMemo(() => {
        if (!exams) return { data: [] };
        return {
            ...exams,
            data: showOnlySelected ? exams.data.filter(p => selectedIds.includes(p.id)) : exams.data
        }
    }, [exams, showOnlySelected, selectedIds]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Examination Management" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Examination Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Create and manage academic exams.</p>
                </div>
                <Link
                    href={route('admin.exams.create')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Create Exam
                </Link>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <ExamStats 
                    stats={stats} 
                    currentFilter={filters?.status} 
                    onFilterChange={(val) => handleFilterChange('status', val)} 
                />
                
                <ExamToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    sessions={sessions}
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
                />
                
                <ExamTable
                    exams={displayExams}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                />

                {exams?.data?.length > 0 && (
                    <div className="border-t border-[#ebebeb] p-3 bg-slate-50/50">
                        <Pagination links={exams.links} />
                    </div>
                )}
            </div>

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
