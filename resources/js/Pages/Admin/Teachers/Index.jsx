import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { UserPlus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import TeacherTable from './Components/TeacherTable';
import TeacherToolbar from './Components/TeacherToolbar';
import TeacherPagination from './Components/TeacherPagination';
import Notify from '@/Utils/Notify';

export default function Index({ auth, teachers, filters, departments, designations }) {
    const allColumns = [
        { id: 'employee_id', label: 'Emp ID' },
        { id: 'name', label: 'Teacher Detail' },
        { id: 'designation', label: 'Designation' },
        { id: 'department', label: 'Department' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(['employee_id', 'name', 'designation', 'department']);

    const toggleColumn = (id) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const totalCount = teachers?.meta?.total || teachers?.total || 0;
    const perPageCount = teachers?.data?.length || 0;

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        show: false,
        teacher: null,
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
        router.get(route('admin.teachers.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.teachers.index'), {}, { replace: true, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => handleFilterChange('per_page', e.target.value);

    const availableBulkIds = useMemo(() => teachers?.data?.map(u => u.id) || [], [teachers?.data]);

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

    const handleDeleteClick = (teacher) => {
        setDeleteModal({
            show: true,
            teacher,
            title: 'Delete Teacher',
            message: `Are you sure you want to delete teacher ID "${teacher.employee_id}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        setDeleteModal({
            show: true,
            teacher: null,
            title: 'Bulk Delete Teachers',
            message: `Are you sure you want to delete ${selectAllAcrossPages ? totalCount : selectedIds.length} teachers? This will permanently remove them.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            setProcessingDelete(false);
            setDeleteModal(prev => ({ ...prev, show: false }));
            Notify.error('Action Not Available', 'Bulk delete for teachers is not implemented in backend yet.');
        } else {
            router.delete(route("admin.teachers.destroy", deleteModal.teacher.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessingDelete(false);
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    Notify.success('Success', 'Teacher deleted successfully');
                },
                onError: () => {
                    setProcessingDelete(false);
                }
            });
        }
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const displayTeachers = useMemo(() => {
        if (!teachers) return { data: [] };
        return {
            ...teachers,
            data: showOnlySelected ? teachers.data.filter(p => selectedIds.includes(p.id)) : teachers.data
        }
    }, [teachers, showOnlySelected, selectedIds]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Teacher Management" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Teacher Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage faculty members, view details and update records.</p>
                </div>
                <Link
                    href={route('admin.teachers.create')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <UserPlus size={14} /> Add New Teacher
                </Link>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <TeacherToolbar
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
                    departments={departments}
                    designations={designations}
                />
                
                <TeacherTable
                    teachers={displayTeachers}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                />

                <TeacherPagination
                    teachers={teachers}
                    filters={filters}
                    total={totalCount}
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
}
