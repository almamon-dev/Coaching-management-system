import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus } from 'lucide-react';
import EnrollmentTable from './Components/EnrollmentTable';
import EnrollmentToolbar from './Components/EnrollmentToolbar';
import EnrollmentPagination from './Components/EnrollmentPagination';

export default function Index({ auth, enrollments, sessions, classes, sections, filters }) {
    const totalCount = enrollments?.meta?.total || enrollments?.total || 0;
    const perPageCount = enrollments?.data?.length || 0;

    const [search, setSearch] = useState(filters?.search || "");

    const allColumns = [
        { id: 'session', label: 'Session' },
        { id: 'student_id', label: 'Student ID' },
        { id: 'name', label: 'Student Detail' },
        { id: 'class', label: 'Class & Section' },
        { id: 'status', label: 'Status' },
    ];

    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem('enrollments_visible_columns');
        return saved ? JSON.parse(saved) : ['session', 'student_id', 'name', 'class', 'status'];
    });

    useEffect(() => {
        localStorage.setItem('enrollments_visible_columns', JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const toggleColumn = (columnId) => {
        setVisibleColumns(prev => 
            prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId]
        );
    };

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);

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
        router.get(route('admin.enrollments.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleReset = () => {
        setSearch("");
        router.get(route('admin.enrollments.index'), {}, { replace: true, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => handleFilterChange('per_page', e.target.value);

    // Bulk selection logic
    const handleClearSelection = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
        setShowOnlySelected(false);
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllAcrossPages(true);
    };

    const toggleSelectAll = () => {
        const availableIds = enrollments?.data?.map(s => s.id) || [];
        if (selectedIds.length === availableIds.length) {
            setSelectedIds([]);
            setSelectAllAcrossPages(false);
        } else {
            setSelectedIds(availableIds);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
            setSelectAllAcrossPages(false);
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDeleteClick = () => {
        if (confirm("Are you sure you want to delete the selected enrollments?")) {
            router.post(route('admin.enrollments.bulk-delete'), {
                ids: selectedIds,
                select_all: selectAllAcrossPages,
                filters: filters
            }, {
                onSuccess: () => handleClearSelection()
            });
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Enrollments Management" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Enrollments History</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View the complete enrollment record and class history of all students.</p>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <EnrollmentToolbar
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    sessions={sessions}
                    classes={classes}
                    sections={sections}
                    totalCount={totalCount}
                    selectedIds={selectedIds}
                    selectAllAcrossPages={selectAllAcrossPages}
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
                
                <EnrollmentTable
                    enrollments={enrollments}
                    selectedIds={selectedIds}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    visibleColumns={visibleColumns}
                />

                <EnrollmentPagination
                    enrollments={enrollments}
                    filters={filters}
                    total={totalCount}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>
        </AdminLayout>
    );
}
