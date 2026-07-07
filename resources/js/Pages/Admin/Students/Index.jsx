import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Mail, BookOpen, Eye } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';

import Notify from '@/Utils/Notify';
import SelectInput from '@/Components/Form/SelectInput';

export default function Index({ auth, students, classes, sections, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || "")) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route('admin.students.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleConfirmDelete = (selectedIds, closeModal) => {
        if (selectedIds.length > 1) {
            closeModal();
            Notify.error('Action Not Available', 'Bulk delete for students is not implemented in backend yet.');
        } else {
            router.delete(route("admin.students.destroy", selectedIds[0]), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    Notify.success('Deleted', 'Student has been deleted.');
                },
                onError: () => {
                    closeModal();
                    Notify.error('Action Failed', 'Could not delete student.');
                }
            });
        }
    };

    const columns = [
        {
            header: 'SL',
            accessor: 'serial',
            className: 'w-[50px] text-center',
            cell: (row, _, index) => {
                const serialNumber = (students.from || 1) + index;
                return <span className="text-[12px] font-bold text-slate-500">{serialNumber}</span>;
            }
        },
        {
            header: 'Student ID',
            accessor: 'student_id',
            className: 'w-[80px]',
            cell: (row) => (
                <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                    {row.student_id}
                </span>
            )
        },
        {
            header: 'Student Detail',
            accessor: 'name',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] bg-[#e4f1ef] text-[#008060] font-bold text-[12px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                        {row.user?.name?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                            {row.user?.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium text-slate-500">
                            <Mail size={10} />
                            <span>{row.user?.email}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Class & Section',
            accessor: 'class',
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-[12.5px]">
                    <BookOpen size={13} className="text-[#008060]" />
                    <span className="font-bold text-slate-700">{row.latest_enrollment?.academic_class?.name || 'N/A'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{row.latest_enrollment?.section?.name || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Roll No.',
            accessor: 'roll_number',
            cell: (row) => (
                <span className="text-[13px] font-bold text-slate-700">
                    {row.latest_enrollment?.roll_number || 'N/A'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[120px]',
            cell: (row, tableActions) => (
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.students.show', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#008060] text-white rounded-[2px] hover:bg-[#006e52] transition-all cursor-pointer shadow-sm"
                        title="View Student Details"
                    >
                        <Eye size={12} />
                    </Link>
                    <Link
                        href={route('admin.students.edit', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Student"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => tableActions.deleteRow()}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Student"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    const advancedFiltersNode = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Class</label>
                <SelectInput
                    value={filters?.class || ''}
                    onChange={(e) => handleFilterChange('class', e.target.value)}
                    options={[{ id: '', name: 'All Classes' }, ...classes]}
                    placeholder="Select class..."
                />
            </div>
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Section</label>
                <SelectInput
                    value={filters?.section || ''}
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    options={[{ id: '', name: 'All Sections' }, ...sections]}
                    placeholder="Select section..."
                />
            </div>
        </div>
    );

    const studentTabs = [
        { name: 'All Students', count: stats?.all || 0, active: (filters?.status || 'all') === 'all', onClick: () => handleFilterChange('status', 'all') },
        { name: 'Active', count: stats?.active || 0, active: filters?.status === 'active', onClick: () => handleFilterChange('status', 'active') },
        { name: 'Suspended', count: stats?.suspended || 0, active: filters?.status === 'suspended', onClick: () => handleFilterChange('status', 'suspended') },
    ];

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

            <div className="mb-6">
                <DataTable 
                    columns={columns}
                    data={students?.data || []}
                    pagination={students}
                    tabs={studentTabs}
                    selectable={true}
                    itemNoun="students"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search students by name or ID..."
                    advancedFilters={advancedFiltersNode}
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>
        </AdminLayout>
    );
}
