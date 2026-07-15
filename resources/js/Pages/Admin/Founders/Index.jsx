import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import DataTable from '@/Components/Table/DataTable';

export default function Index({ founders, filters }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentFounder, setCurrentFounder] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        role: '',
        description: '',
        image: null,
        is_active: true,
        order: 0,
        _method: 'post',
    });

    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (val) => {
        setSearch(val);
        router.get(route('admin.founders.index'), { search: val }, { preserveState: true, replace: true, preserveScroll: true });
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setData('_method', 'post');
        setIsCreateModalOpen(true);
    };

    const openEditModal = (founder) => {
        reset();
        clearErrors();
        setCurrentFounder(founder);
        setData({
            name: founder.name,
            role: founder.role || '',
            description: founder.description || '',
            image: null,
            is_active: founder.is_active,
            order: founder.order,
            _method: 'put',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (founder) => {
        setCurrentFounder(founder);
        setIsDeleteModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isEditModalOpen) {
            post(route('admin.founders.update', currentFounder.id), {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.founders.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteFounder = () => {
        router.delete(route('admin.founders.destroy', currentFounder.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const columns = [
        { 
            header: 'Image', 
            accessor: 'image',
            className: 'w-[80px]',
            cell: (row) => (
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {row.image_url ? (
                        <img src={row.image_url} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                    )}
                </div>
            )
        },
        { 
            header: 'Name & Role', 
            accessor: 'name',
            className: 'w-[250px]',
            cell: (row) => (
                <div>
                    <div className="text-[13px] text-[#202223] font-bold">{row.name}</div>
                    <div className="text-[11.5px] text-[#6d7175] mt-0.5">{row.role || 'N/A'}</div>
                </div>
            )
        },
        { 
            header: 'Order', 
            accessor: 'order',
            className: 'w-[100px]',
            cell: (row) => (
                <span className="text-[13px] text-[#6d7175] font-medium">
                    {row.order}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: 'is_active',
            className: 'w-[100px]',
            cell: (row) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    row.is_active ? 'bg-[#e4f1ef] text-[#008060]' : 
                    'bg-slate-100 text-[#6d7175]'
                }`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[120px]',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <button 
                        onClick={() => openEditModal(row)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit"
                    >
                        <Pencil size={12} />
                    </button>
                    <button 
                        onClick={() => openDeleteModal(row)}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <Head title="Founders & Donors" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Founders & Donors</h1>
                    <p className="text-[13px] text-[#6d7175] mt-0.5 font-medium">Manage founders and land donors</p>
                </div>
                <button 
                    onClick={openCreateModal} 
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} strokeWidth={3} /> Add New
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <DataTable 
                    columns={columns}
                    data={founders.data}
                    pagination={founders}
                    selectable={false}
                    itemNoun="founders"
                    searchQuery={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search founders by name or role..."
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen || isEditModalOpen} onClose={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-4">
                        <h3 className="text-lg font-bold text-[#202223]">
                            {isEditModalOpen ? 'Edit Founder / Donor' : 'Add New Founder / Donor'}
                        </h3>
                       
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full rounded-[3px] border-slate-300 shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060]/20 text-[13px] ${errors.name ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Role (e.g. Chief Founder)</label>
                            <input
                                type="text"
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className={`w-full rounded-[3px] border-slate-300 shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060]/20 text-[13px] ${errors.role ? 'border-red-500' : ''}`}
                            />
                            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Description (Optional)</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="3"
                                className={`w-full rounded-[3px] border-slate-300 shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060]/20 text-[13px] ${errors.description ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Image (Optional)</label>
                            <input
                                type="file"
                                onChange={e => setData('image', e.target.files[0])}
                                className={`w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-[3px] file:border-0 file:text-[12px] file:font-semibold file:bg-[#e4f1ef] file:text-[#008060] hover:file:bg-[#cde4df] border border-slate-300 rounded-[3px] ${errors.image ? 'border-red-500' : ''}`}
                                accept="image/*"
                            />
                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[13px] font-medium text-[#202223] mb-1.5">Display Order</label>
                                <input
                                    type="number"
                                    value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    className={`w-full rounded-[3px] border-slate-300 shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060]/20 text-[13px] ${errors.order ? 'border-red-500' : ''}`}
                                />
                            </div>
                            
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded-[3px] border-slate-300 text-[#008060] shadow-sm focus:border-[#008060] focus:ring focus:ring-[#008060]/20"
                                    />
                                    <span className="text-[13px] font-medium text-[#202223]">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                className="px-4 py-1.5 bg-white border border-slate-300 rounded-[3px] text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-1.5 bg-[#008060] border border-transparent rounded-[3px] text-[13px] font-bold text-white hover:bg-[#006e52] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008060] disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[#202223] mb-2">Delete Confirmation</h3>
                    <p className="text-[13px] text-slate-600 mb-6">
                        Are you sure you want to delete <strong>{currentFounder?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-1.5 bg-white border border-slate-300 rounded-[3px] text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={deleteFounder}
                            className="px-4 py-1.5 bg-[#ff4d4f] border border-transparent rounded-[3px] text-[13px] font-bold text-white hover:bg-[#cf1322] shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
