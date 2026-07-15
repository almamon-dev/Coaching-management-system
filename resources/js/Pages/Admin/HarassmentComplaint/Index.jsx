import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Trash2, ShieldAlert, Eye, Search } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import Notify from '@/Utils/Notify';
import DataTable from '@/Components/Table/DataTable';

export default function Index({ auth, complaints }) {
    const [deleteModal, setDeleteModal] = useState({ show: false, complaint: null });
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');

    const handleDeleteClick = (complaint) => {
        setDeleteModal({ show: true, complaint });
    };

    const handleConfirmDelete = () => {
        setProcessing(true);
        router.delete(route("admin.harassment-complaints.destroy", deleteModal.complaint.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setDeleteModal({ show: false, complaint: null });
                Notify.success('Success', 'Complaint deleted successfully');
            },
            onError: () => setProcessing(false)
        });
    };

    const columns = [
        {
            header: 'Tracking ID',
            accessor: 'id',
            className: 'w-[100px]',
            cell: (row) => <span className="text-[13px] text-[#202223] font-bold">#CMP-{row.id.toString().padStart(4, '0')}</span>
        },
        {
            header: 'Reporter Name',
            accessor: 'name',
            className: 'w-[200px]',
            cell: (row) => (
                <div>
                    <span className="text-[13px] text-[#202223] font-medium block">
                        {row.name ? row.name : <span className="italic text-slate-400">Anonymous</span>}
                    </span>
                    {row.role && <span className="text-[11px] text-slate-500">{row.role}</span>}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'w-[120px]',
            cell: (row) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                if (row.status === 'pending') badgeClass = 'bg-amber-100 text-amber-700';
                if (row.status === 'investigating') badgeClass = 'bg-blue-100 text-blue-700';
                if (row.status === 'resolved') badgeClass = 'bg-green-100 text-green-700';
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            header: 'Submitted Date',
            accessor: 'created_at',
            className: 'w-[150px]',
            cell: (row) => <span className="text-[13px] text-[#6d7175] tabular-nums">{new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'w-[100px] text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.harassment-complaints.show', row.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="View Details"
                    >
                        <Eye size={12} />
                    </Link>
                    <button
                        onClick={() => handleDeleteClick(row)}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Complaint"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Harassment Complaints" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Harassment Complaints</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Review and manage reported harassment incidents.</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <DataTable
                    columns={columns}
                    data={complaints?.data || []}
                    pagination={complaints}
                    selectable={false}
                    itemNoun="complaints"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search complaints by ID..."
                />
            </div>

            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, complaint: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Complaint Record"
                message={`Are you sure you want to delete this complaint record permanently? This action cannot be undone.`}
                processing={processing}
            />
        </AdminLayout>
    );
}
