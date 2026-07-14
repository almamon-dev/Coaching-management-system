import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Image, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';

export default function Index({ galleries, counts = {}, currentTab = 'all' }) {
    const { auth } = usePage().props;

    const columns = [
        { 
            header: 'Gallery Image', 
            accessor: 'image',
            className: 'w-[100px]',
            cell: (row) => (
                <div className="w-[60px] h-[40px] rounded-[3px] overflow-hidden border border-slate-200">
                    <img src={row.image_url || row.image} alt={row.title} className="w-full h-full object-cover" />
                </div>
            )
        },
        { 
            header: 'Title', 
            accessor: 'title',
            className: 'w-[250px]',
            cell: (row) => (
                <div>
                    <div className="text-[13px] text-[#202223] font-bold max-w-[230px] truncate">{row.title}</div>
                    <div className="text-[11.5px] text-[#6d7175] mt-0.5">Order: {row.sort_order}</div>
                </div>
            )
        },
        { 
            header: 'Category', 
            accessor: 'category',
            className: 'w-[150px]',
            cell: (row) => (
                <span className="text-[13px] text-[#6d7175] font-medium">
                    {row.category || 'N/A'}
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
                    'bg-slate-100 text-[#6d7175]'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[120px]',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Link 
                        href={route('admin.galleries.edit', row.id)} 
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Gallery"
                    >
                        <Edit size={12} />
                    </Link>
                    <button 
                        onClick={() => {
                            if(confirm('Are you sure you want to delete this gallery item?')) {
                                router.delete(route('admin.galleries.destroy', row.id));
                            }
                        }}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Gallery"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    const handleTabChange = (tab) => {
        router.get(route('admin.galleries.index'), { tab }, {
            preserveState: true,
            replace: true
        });
    };

    const galleryTabs = [
        { name: 'All Galleries', count: counts.all || 0, active: currentTab === 'all', onClick: () => handleTabChange('all') },
        { name: 'Published', count: counts.published || 0, active: currentTab === 'published', onClick: () => handleTabChange('published') },
        { name: 'Draft', count: counts.draft || 0, active: currentTab === 'draft', onClick: () => handleTabChange('draft') },
    ];

    return (
        <AdminLayout>
            <Head title="Campus Life & Gallery" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Campus Life & Gallery</h1>
                    <p className="text-[13px] text-[#6d7175] mt-0.5 font-medium">Manage photos and activities shown on the homepage</p>
                </div>
                <Link href={route('admin.galleries.create')}>
                    <button className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm">
                        <Plus size={14} strokeWidth={3} /> Add Gallery Item
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <DataTable 
                    columns={columns}
                    data={galleries.data}
                    pagination={galleries}
                    tabs={galleryTabs}
                    selectable={true}
                    itemNoun="galleries"
                    onConfirmDelete={(selectedIds, close) => {
                        console.log("Deleting bulk galleries from DataTable:", selectedIds);
                        close();
                    }}
                    onShowSelection={(selectedIds) => {
                        console.log("Showing selected galleries:", selectedIds);
                    }}
                />
            </div>
        </AdminLayout>
    );
}
