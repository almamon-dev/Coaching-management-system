import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle, Eye, SquarePen, Trash2 } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import DataTable from '@/Components/Table/DataTable';

export default function Index({ auth, invoices, classes, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.fee-invoices.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route('admin.fee-invoices.index'), { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'paid': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 uppercase tracking-wider"><CheckCircle2 size={10} /> Paid</span>;
            case 'partial': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200 uppercase tracking-wider"><Clock size={10} /> Partial</span>;
            case 'cancelled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-300 uppercase tracking-wider"><XCircle size={10} /> Cancelled</span>;
            case 'unpaid': default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-red-50 text-red-700 text-[11px] font-bold border border-red-200 uppercase tracking-wider"><AlertTriangle size={10} /> Unpaid</span>;
        }
    };

    const columns = [
        {
            header: 'Invoice No.',
            accessor: 'invoice_number',
            className: 'w-[120px]',
            cell: (row) => <span className="text-[12px] text-[#202223] font-bold whitespace-nowrap">{row.invoice_number}</span>
        },
        {
            header: 'Student',
            accessor: 'student',
            className: 'w-[200px]',
            cell: (row) => (
                <div>
                    <span className="text-[12px] font-bold text-[#202223]">{row.student?.name}</span>
                    <span className="text-[11px] text-[#6d7175] ml-1.5">#{row.student?.student_profile?.student_id || '-'}</span>
                </div>
            )
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'w-[120px]',
            cell: (row) => <span className="text-[12px] text-[#6d7175] whitespace-nowrap">{row.academic_class?.name || '-'}</span>
        },
        {
            header: 'Title / Fee Group',
            accessor: 'title',
            className: 'w-auto',
            cell: (row) => (
                <div className="text-[12px] text-[#202223] font-medium">
                    {row.title}
                    <span className="text-[11px] text-[#008060] ml-1.5">({row.fee_group?.name})</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessor: 'total_amount',
            className: 'w-[100px] text-right',
            cell: (row) => <span className="text-[12px] text-[#202223] font-bold whitespace-nowrap tabular-nums flex justify-end">৳ {parseFloat(row.total_amount).toFixed(2)}</span>
        },
        {
            header: 'Paid',
            accessor: 'paid_amount',
            className: 'w-[100px] text-right',
            cell: (row) => <span className="text-[12px] text-[#202223] font-bold whitespace-nowrap tabular-nums flex justify-end">৳ {parseFloat(row.paid_amount).toFixed(2)}</span>
        },
        {
            header: 'Due Date',
            accessor: 'due_date',
            className: 'w-[100px]',
            cell: (row) => <span className="text-[12px] text-[#6d7175] whitespace-nowrap tabular-nums">{row.due_date}</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'w-[100px]',
            cell: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'w-[100px] text-right',
            cell: (row, tableActions) => (
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.fee-invoices.show', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#008060] text-white rounded-[2px] hover:bg-[#006e52] transition-all cursor-pointer shadow-sm"
                        title="View Invoice"
                    >
                        <Eye size={12} />
                    </Link>
                    <Link
                        href={route('admin.fee-invoices.edit', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Invoice"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => tableActions.deleteRow()}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Invoice"
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
                    value={filters?.class_id || ''}
                    onChange={(e) => handleFilterChange('class_id', e.target.value)}
                    options={[{ id: '', name: 'All Classes' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                    placeholder="Select class..."
                />
            </div>
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                <SelectInput
                    value={filters?.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    options={[
                        { id: '', name: 'All Statuses' },
                        { id: 'unpaid', name: 'Unpaid' },
                        { id: 'partial', name: 'Partial' },
                        { id: 'paid', name: 'Paid' },
                        { id: 'cancelled', name: 'Cancelled' }
                    ]}
                    placeholder="Select status..."
                />
            </div>
        </div>
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title="Fee Invoices" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Fee Invoices</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage and track student fee billings.</p>
                </div>
                <Link
                    href={route('admin.fee-invoices.generate')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <FileText size={14} /> Generate Bulk Invoices
                </Link>
            </div>

            <div className="mb-6">
                <DataTable 
                    columns={columns}
                    data={invoices?.data || []}
                    pagination={invoices}
                    selectable={true}
                    itemNoun="invoices"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by invoice number or student..."
                    advancedFilters={advancedFiltersNode}
                    onConfirmDelete={(selectedIds, close) => {
                        // Implement bulk delete if backend route is ready
                        close();
                    }}
                />
            </div>
        </AdminLayout>
    );
}
