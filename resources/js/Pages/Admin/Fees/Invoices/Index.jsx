import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, RotateCcw, FileText, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import SortableHeader from '@/Components/Table/SortableHeader';
import ColumnManager from '../../AcademicClasses/Components/ColumnManager';

// ... (Toolbar component remains mostly the same, just skipping to the actual index)

const InvoiceToolbar = ({ search, setSearch, handleReset, columns, visibleColumns, toggleColumn, filters, classes }) => {
    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            <div className="p-3 flex items-center justify-between gap-4 transition-opacity duration-200">
                <div className="flex items-center gap-2">
                    <div className="relative w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                        <TextInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by invoice number or student..."
                            className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                        />
                    </div>
                    <div className="w-[180px]">
                        <SelectInput
                            value={filters?.class_id || 'all'}
                            onChange={(e) => {
                                router.get(route('admin.fee-invoices.index'), { ...filters, class_id: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
                            }}
                            showSearch={false}
                            options={[{ id: 'all', name: 'All Classes' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                            className="w-full h-[32px] text-[12px]"
                        />
                    </div>
                    <div className="w-[150px]">
                        <SelectInput
                            value={filters?.status || 'all'}
                            onChange={(e) => {
                                router.get(route('admin.fee-invoices.index'), { ...filters, status: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
                            }}
                            showSearch={false}
                            options={[
                                { id: 'all', name: 'All Statuses' },
                                { id: 'unpaid', name: 'Unpaid' },
                                { id: 'partial', name: 'Partial' },
                                { id: 'paid', name: 'Paid' },
                                { id: 'cancelled', name: 'Cancelled' }
                            ]}
                            className="w-full h-[32px] text-[12px]"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-1.5 relative">
                    <button onClick={handleReset} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" title="Reset Filters">
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />
                    <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, invoices, classes, filters }) {
    const allColumns = [
        { id: 'invoice_number', label: 'Invoice No.' },
        { id: 'student', label: 'Student' },
        { id: 'class', label: 'Class' },
        { id: 'title', label: 'Title / Fee Group' },
        { id: 'total_amount', label: 'Amount' },
        { id: 'paid_amount', label: 'Paid' },
        { id: 'due_date', label: 'Due Date' },
        { id: 'status', label: 'Status' },
    ];
    
    const [visibleColumns, setVisibleColumns] = useState(['invoice_number', 'student', 'class', 'title', 'total_amount', 'paid_amount', 'status']);
    const toggleColumn = (id) => setVisibleColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.fee-invoices.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.fee-invoices.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };
    
    const getStatusBadge = (status) => {
        switch(status) {
            case 'paid': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 uppercase tracking-wider"><CheckCircle2 size={10} /> Paid</span>;
            case 'partial': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200 uppercase tracking-wider"><Clock size={10} /> Partial</span>;
            case 'cancelled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-300 uppercase tracking-wider"><XCircle size={10} /> Cancelled</span>;
            case 'unpaid': default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-red-50 text-red-700 text-[11px] font-bold border border-red-200 uppercase tracking-wider"><AlertTriangle size={10} /> Unpaid</span>;
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight">Fee Invoices</h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Manage and track student fee billings.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.fee-invoices.generate')}
                            className="h-[32px] px-3 bg-[#008060] text-white text-[12px] font-bold rounded-[3px] hover:bg-[#006e52] transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <FileText size={14} /> Generate Bulk Invoices
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Fee Invoices" />

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb] overflow-visible">
                <InvoiceToolbar 
                    search={search} setSearch={setSearch} handleReset={handleReset}
                    columns={allColumns} visibleColumns={visibleColumns} toggleColumn={toggleColumn}
                    filters={filters} classes={classes}
                />

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f4f6f8]">
                                {visibleColumns.includes('invoice_number') && <SortableHeader label="Invoice No." field="invoice_number" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-invoices.index', params: filters }} />}
                                {visibleColumns.includes('student') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student</th>}
                                {visibleColumns.includes('class') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Class</th>}
                                {visibleColumns.includes('title') && <th className="px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Title</th>}
                                {visibleColumns.includes('total_amount') && <SortableHeader label="Amount" field="total_amount" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-invoices.index', params: filters }} align="right" />}
                                {visibleColumns.includes('paid_amount') && <SortableHeader label="Paid" field="paid_amount" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-invoices.index', params: filters }} align="right" />}
                                {visibleColumns.includes('due_date') && <SortableHeader label="Due Date" field="due_date" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-invoices.index', params: filters }} />}
                                {visibleColumns.includes('status') && <SortableHeader label="Status" field="status" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.fee-invoices.index', params: filters }} />}
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.data.length > 0 ? (
                                invoices.data.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-[#ebebeb] hover:bg-[#fafafa] transition-colors group">
                                        {visibleColumns.includes('invoice_number') && (
                                            <td className="px-3 py-2 text-[12px] text-[#202223] font-bold whitespace-nowrap">
                                                {invoice.invoice_number}
                                            </td>
                                        )}
                                        {visibleColumns.includes('student') && (
                                            <td className="px-3 py-2">
                                                <span className="text-[12px] font-bold text-[#202223]">{invoice.student?.name}</span>
                                                <span className="text-[11px] text-[#6d7175] ml-1.5">#{invoice.student?.student_profile?.student_id || '-'}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('class') && (
                                            <td className="px-3 py-2 text-[12px] text-[#6d7175] whitespace-nowrap">
                                                {invoice.academic_class?.name || '-'}
                                            </td>
                                        )}
                                        {visibleColumns.includes('title') && (
                                            <td className="px-3 py-2 text-[12px] text-[#202223] font-medium">
                                                {invoice.title}
                                                <span className="text-[11px] text-[#008060] ml-1.5">({invoice.fee_group?.name})</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('total_amount') && (
                                            <td className="px-3 py-2 text-[12px] text-[#202223] font-bold text-right whitespace-nowrap tabular-nums">
                                                ৳ {parseFloat(invoice.total_amount).toFixed(2)}
                                            </td>
                                        )}
                                        {visibleColumns.includes('paid_amount') && (
                                            <td className="px-3 py-2 text-[12px] text-[#202223] font-bold text-right whitespace-nowrap tabular-nums">
                                                ৳ {parseFloat(invoice.paid_amount).toFixed(2)}
                                            </td>
                                        )}
                                        {visibleColumns.includes('due_date') && (
                                            <td className="px-3 py-2 text-[12px] text-[#6d7175] whitespace-nowrap tabular-nums">
                                                {invoice.due_date}
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {getStatusBadge(invoice.status)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={visibleColumns.length} className="px-3 py-8 text-center bg-[#fafafa]">
                                        <p className="text-[13px] font-medium text-[#6d7175]">No invoices found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#ebebeb]">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-[#6d7175]">Rows per page:</span>
                        <div className="w-[70px]">
                            <SelectInput
                                value={filters?.per_page || '10'}
                                onChange={(e) => router.get(route('admin.fee-invoices.index'), { ...filters, per_page: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true, replace: true })}
                                showSearch={false}
                                options={[
                                    { id: '10',  name: '10' },
                                    { id: '25',  name: '25' },
                                    { id: '50',  name: '50' },
                                    { id: '100', name: '100' },
                                ]}
                                className="w-full h-[28px] text-[12px]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                            {invoices.total > 0 ? `${invoices.from} - ${invoices.to} of ${invoices.total}` : '0'}
                        </span>
                        <div className="flex gap-1">
                        <Link href={invoices.prev_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!invoices.prev_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">‹</span>
                        </Link>
                        <Link href={invoices.next_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!invoices.next_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">›</span>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
