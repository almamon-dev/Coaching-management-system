import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import StudentTable from './Components/StudentTable';
import StudentToolbar from './Components/StudentToolbar';
import StudentPagination from './Components/StudentPagination';
import StudentStats from './Components/StudentStats';
import Notify from '@/Utils/Notify';

export default function Index({ auth, students, filters, stats }) {
    const allColumns = [
        { id: 'student_id', label: 'Student ID' },
        { id: 'name', label: 'Student Detail' },
        { id: 'class', label: 'Class & Section' },
        { id: 'roll_number', label: 'Roll No.' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(['student_id', 'name', 'class', 'roll_number']);

    const toggleColumn = (id) => {
        setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const totalCount = students?.meta?.total || students?.total || 0;
    const perPageCount = students?.data?.length || 0;

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        show: false,
        student: null,
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
        router.get(route('admin.students.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.students.index'), {}, { replace: true, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => handleFilterChange('per_page', e.target.value);

    const availableBulkIds = useMemo(() => students?.data?.map(u => u.id) || [], [students?.data]);

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

    const handleDeleteClick = (student) => {
        setDeleteModal({
            show: true,
            student,
            title: 'Delete Student',
            message: `Are you sure you want to delete student ID "${student.student_id}"? This action cannot be undone.`,
            isBulk: false
        });
    };

    const handleBulkDeleteClick = () => {
        setDeleteModal({
            show: true,
            student: null,
            title: 'Bulk Delete Students',
            message: `Are you sure you want to delete ${selectAllAcrossPages ? totalCount : selectedIds.length} students? This will permanently remove them.`,
            isBulk: true
        });
    };

    const handleConfirmDelete = () => {
        setProcessingDelete(true);
        if (deleteModal.isBulk) {
            // Bulk destroy endpoint logic needs to be implemented in backend, for now show error
            setProcessingDelete(false);
            setDeleteModal(prev => ({ ...prev, show: false }));
            Notify.error('Action Not Available', 'Bulk delete for students is not implemented in backend yet.');
        } else {
            router.delete(route("admin.students.destroy", deleteModal.student.id), {
                onSuccess: () => {
                    setSelectedIds(prev => prev.filter(i => i !== deleteModal.student.id));
                    setDeleteModal(prev => ({ ...prev, show: false }));
                    setProcessingDelete(false);
                    Notify.success('Deleted', 'Student has been deleted.');
                },
                onError: () => {
                    setProcessingDelete(false);
                    Notify.error('Action Failed', 'Could not delete student.');
                }
            });
        }
    };

    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const displayStudents = useMemo(() => {
        if (!students) return { data: [] };
        return {
            ...students,
            data: showOnlySelected ? students.data.filter(p => selectedIds.includes(p.id)) : students.data
        }
    }, [students, showOnlySelected, selectedIds]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Student Management" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Management</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage admitted students, view details and update records.</p>
                </div>
                <Link
                    href={route('admin.students.create')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} /> Student Admission
                </Link>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <StudentStats stats={stats} />
                <StudentToolbar
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
                />
                
                <StudentTable
                    students={displayStudents}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleDelete={handleDeleteClick}
                    isProcessing={isProcessing}
                    visibleColumns={visibleColumns}
                />

                <StudentPagination
                    students={students}
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
