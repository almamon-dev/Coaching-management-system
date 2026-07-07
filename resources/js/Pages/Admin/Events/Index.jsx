import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Calendar, Search, Filter, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';

export default function Index({ events, counts = {}, currentTab = 'all' }) {
    const { auth } = usePage().props;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const columns = [
        { 
            header: 'Event', 
            accessor: 'title',
            className: 'w-[300px]',
            cell: (row) => (
                <div>
                    <div className="text-[13px] text-[#202223] font-bold max-w-[280px] truncate">{row.title}</div>
                    <div className="text-[11.5px] text-[#6d7175] mt-0.5">{row.date} • {row.time || 'All day'}</div>
                </div>
            )
        },
        { 
            header: 'Location', 
            accessor: 'location',
            className: 'w-[200px]',
            cell: (row) => <span className="text-[13px] text-[#6d7175] max-w-[180px] truncate block">{row.location}</span>
        },
        { 
            header: 'Creator', 
            accessor: 'user',
            className: 'w-[150px]',
            cell: (row) => (
                <span className="text-[13px] text-[#6d7175] font-medium">
                    {row.user ? row.user.name : 'System'}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: 'status',
            className: 'w-[100px]',
            cell: (row) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    row.status === 'published' ? 'bg-[#e4f1ef] text-[#008060]' : 
                    row.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-[#6d7175]'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[120px]',
            cell: (row, tableActions) => (
                <div className="flex items-center justify-end gap-1">
                    {row.status === 'pending' && (
                        <>
                            <Link 
                                href={route('admin.events.approve', row.id)} 
                                method="post" 
                                as="button" 
                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#0bd462] text-white rounded-[2px] hover:bg-[#0aa84e] transition-all shadow-sm"
                                title="Approve Event"
                            >
                                <CheckCircle size={12} />
                            </Link>
                            <Link 
                                href={route('admin.events.reject', row.id)} 
                                method="post" 
                                as="button" 
                                className="h-[26px] w-[26px] flex items-center justify-center bg-orange-500 text-white rounded-[2px] hover:bg-orange-600 transition-all shadow-sm"
                                title="Reject Event"
                            >
                                <XCircle size={12} />
                            </Link>
                        </>
                    )}
                    <Link 
                        href="#" 
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Event"
                    >
                        <Edit size={12} />
                    </Link>
                    <button 
                        onClick={() => tableActions && tableActions.deleteRow()}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Event"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    const handleTabChange = (tab) => {
        router.get(route('admin.events.index'), { tab }, {
            preserveState: true,
            replace: true
        });
    };

    const eventTabs = [
        { name: 'All Events', count: counts.all || 0, active: currentTab === 'all', onClick: () => handleTabChange('all') },
        { name: 'Published', count: counts.published || 0, active: currentTab === 'published', onClick: () => handleTabChange('published') },
        { name: 'Pending', count: counts.pending || 0, active: currentTab === 'pending', onClick: () => handleTabChange('pending') },
    ];

    return (
        <AdminLayout>
            <Head title="Events Management" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Events Management</h1>
                    <p className="text-[13px] text-[#6d7175] mt-0.5 font-medium">Manage school events and approve requests</p>
                </div>
                <Link href="#">
                    <button className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm">
                        <Plus size={14} strokeWidth={3} /> Create Event
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <DataTable 
                    columns={columns}
                    data={events.data}
                    pagination={events}
                    tabs={eventTabs}
                    selectable={true}
                    itemNoun="events"
                    onConfirmDelete={(selectedIds, close) => {
                        console.log("Deleting bulk events from DataTable:", selectedIds);
                        // TODO: Add Inertia router.delete request here, then close()
                        close();
                    }}
                    onShowSelection={(selectedIds) => {
                        console.log("Showing selected events:", selectedIds);
                    }}
                />
            </div>
        </AdminLayout>
    );
}
