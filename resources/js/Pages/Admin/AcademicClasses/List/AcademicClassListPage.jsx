import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2, Hash, Layers } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';

import Notify from '@/Utils/Notify';

const AcademicClassListPage = ({ auth, classes, filters, stats }) => {
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
        router.get(route('admin.classes.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleConfirmDelete = (selectedIds, closeModal) => {
        if (selectedIds.length > 1) {
            router.post(route("admin.classes.bulk-destroy"), { ids: selectedIds }, {
                onSuccess: () => {
                    closeModal();
                    Notify.success('Deleted', 'Selected classes have been removed.');
                },
                onError: () => {
                    closeModal();
                    Notify.error('Action Failed', 'Could not delete classes.');
                }
            });
        } else {
            router.delete(route("admin.classes.destroy", selectedIds[0]), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    Notify.success('Deleted', 'Class has been deleted.');
                },
                onError: () => {
                    closeModal();
                    Notify.error('Action Failed', 'Could not delete class.');
                }
            });
        }
    };

    const columns = [
        {
            header: 'Class Name',
            accessor: 'name',
            className: 'w-[200px]',
            cell: (row) => (
                <span className="text-[13px] font-bold text-slate-800">
                    {row.name}
                </span>
            )
        },
        {
            header: 'Numeric Value',
            accessor: 'numeric_value',
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                    <Hash size={13} className="text-slate-400" />
                    <span className="font-medium text-slate-700 bg-slate-100 px-2 rounded">{row.numeric_value}</span>
                </div>
            )
        },
        {
            header: 'Total Sections',
            accessor: 'sections',
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                    <Layers size={13} className="text-slate-400" />
                    <span className="font-semibold text-[#008060] bg-[#e4f1ef] px-2 py-0.5 rounded-[3px] border border-[#a3dfd2]/30 text-[11px]">{row.sections_count || 0} Sections</span>
                </div>
            )
        },
        {
            header: 'Created At',
            accessor: 'created_at',
            cell: (row) => (
                <span className="text-[13px] text-slate-600">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                </span>
            )
        },
        {
            header: 'Updated At',
            accessor: 'updated_at',
            cell: (row) => (
                <span className="text-[13px] text-slate-600">
                    {row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
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
                        href={route('admin.classes.edit', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Class"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => tableActions.deleteRow()}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Class"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    const classTabs = [
        { name: 'All Classes', count: stats?.all || 0, active: (filters?.status || 'all') === 'all', onClick: () => handleFilterChange('status', 'all') },
        { name: 'Active', count: stats?.active || 0, active: filters?.status === 'active', onClick: () => handleFilterChange('status', 'active') },
        { name: 'Inactive', count: stats?.inactive || 0, active: filters?.status === 'inactive', onClick: () => handleFilterChange('status', 'inactive') },
    ];

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

            <div className="mb-6">
                <DataTable 
                    columns={columns}
                    data={classes?.data || []}
                    pagination={classes}
                    tabs={classTabs}
                    selectable={true}
                    itemNoun="classes"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search classes by name..."
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>
        </AdminLayout>
    );
};
export default AcademicClassListPage;
