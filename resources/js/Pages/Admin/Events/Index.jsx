import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Calendar, Search, Filter, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';

export default function Index({ events }) {
    const { auth } = usePage().props;

    const columns = [
        { 
            header: 'Event', 
            accessor: 'title',
            cell: (row) => (
                <div>
                    <div className="font-bold text-slate-800">{row.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{row.date} • {row.time || 'All day'}</div>
                </div>
            )
        },
        { header: 'Location', accessor: 'location' },
        { 
            header: 'Creator', 
            accessor: 'user',
            cell: (row) => (
                <div className="text-sm">
                    {row.user ? row.user.name : 'System'}
                </div>
            )
        },
        { 
            header: 'Status', 
            accessor: 'status',
            cell: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    row.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                    row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Link 
                                href={route('admin.events.approve', row.id)} 
                                method="post" 
                                as="button" 
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="Approve Event"
                            >
                                <CheckCircle size={16} />
                            </Link>
                            <Link 
                                href={route('admin.events.reject', row.id)} 
                                method="post" 
                                as="button" 
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                title="Reject Event"
                            >
                                <XCircle size={16} />
                            </Link>
                        </>
                    )}
                    <Link href="#" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                    </Link>
                    <Link href="#" className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                    </Link>
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <Head title="Events Management" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[22px] font-bold text-slate-800">Events Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage school events and approve requests</p>
                </div>
                <Link href="#">
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus size={16} /> Create Event
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <DataTable 
                    columns={columns}
                    data={events.data}
                    pagination={events}
                />
            </div>
        </AdminLayout>
    );
}
