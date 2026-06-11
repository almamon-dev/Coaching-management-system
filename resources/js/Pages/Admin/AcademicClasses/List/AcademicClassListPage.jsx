import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import AcademicClassTable from '../Components/AcademicClassTable';
import AcademicClassToolbar from '../Components/AcademicClassToolbar';
import AcademicClassStats from '../Components/AcademicClassStats';
import AcademicClassPagination from '../Components/AcademicClassPagination';
import Notify from '@/Utils/Notify';

const AcademicClassListPage = ({ auth, classes, filters, stats }) => {
    const allColumns = [
        { id: 'name', label: 'Class Name' },
        { id: 'numeric_value', label: 'Numeric Value' },
        { id: 'sections', label: 'Total Sections' },
        { id: 'created_at', label: 'Created At' },
        { id: 'updated_at', label: 'Updated At' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(['name', 'numeric_value', 'sections', 'created_at', 'updated_at']);

    const toggleColumn = (id) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const totalCount = classes?.meta?.total || classes?.total || 0;
    const perPageCount = classes?.data?.length || 0;

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        show: false,
        academic_class: null,
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
        router.get(route('admin.classes.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.classes.index'), {}, { replace: true, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => handleFilterChange('per_page', e.target.value);

    const availableBulkIds = useMemo(() => classes?.data?.map(u => u.id) || [], [classes?.data]);

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

    const handleDeleteClick = (academic_class) => {
        setDeleteModal({
            show: true,
            academic_class,
            title: 'Delete Class',
            message: `Are you sure you want to delete "${academic_class.name}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        setDeleteModal({
            show: true,
            academic_class: null,
            title: 'Bulk Delete Classes',
            message: `Are you sure you want to delete ${selectAllAcrossPages ? totalCount : selectedIds.length} classes? This will permanently remove them.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            router.post(route("admin.classes.bulk-destroy"), { ids: selectedIds }, {
                onSuccess: () => {
                    handleClearSelection();
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Deleted', 'Selected classes have been removed.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete classes.');
                }
            });
        } else {
            router.delete(route("admin.classes.destroy", deleteModal.academic_class.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.academic_class.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Deleted', 'Class has been deleted.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete class.');
                }
            });
        }
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const displayClasses = useMemo(() => {
        if (!classes) return { data: [] };
        return {
            ...classes,
            data: showOnlySelected ? classes.data.filter(p => selectedIds.includes(p.id)) : classes.data
        }
    }, [classes, showOnlySelected, selectedIds]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Class Management" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Academic Classes</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage school classes and view section counts.</p>
                </div>
                <Link
                    href={route('admin.classes.create')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Add Class
                </Link>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <AcademicClassStats stats={stats} />
                <AcademicClassToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
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
                />
                <AcademicClassTable
                    classes={displayClasses}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                    stats={stats}
                />
                <AcademicClassPagination
                    classes={classes}
                    total={stats?.all ?? 0}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
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
};
export default AcademicClassListPage;
