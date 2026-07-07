import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import Notify from '@/Utils/Notify';
import TextInput from '@/Components/Form/TextInput';
import DataTable from '@/Components/Table/DataTable';


export default function Index({ auth, designations, filters, stats }) {
    // Data Management
    const [search, setSearch] = useState(filters?.search || '');
    
    // Modal Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDesignation, setEditingDesignation] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        status: true,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.designations.index'), { ...filters, search, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleTabChange = (tab) => {
        router.get(route('admin.designations.index'), { ...filters, status: tab === 'all' ? null : tab, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleConfirmDelete = (selectedIds, closeModal) => {
        if (selectedIds.length > 1) {
            closeModal();
            Notify.error('Action Not Available', 'Bulk delete backend route needs to be added.');
        } else {
            router.delete(route('admin.designations.destroy', selectedIds[0]), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    Notify.success('Deleted', 'Designation deleted successfully.');
                },
                onError: () => {
                    closeModal();
                }
            });
        }
    };

    // Form Logic
    const openModal = (designation = null) => {
        clearErrors();
        if (designation) {
            setEditingDesignation(designation);
            setData({
                name: designation.name,
                description: designation.description || '',
                status: !!designation.status,
            });
        } else {
            setEditingDesignation(null);
            reset();
            setData('status', true);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDesignation(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingDesignation) {
            put(route('admin.designations.update', editingDesignation.id), {
                onSuccess: () => { closeModal(); Notify.success('Updated', 'Designation updated successfully.'); },
            });
        } else {
            post(route('admin.designations.store'), {
                onSuccess: () => { closeModal(); Notify.success('Created', 'Designation created successfully.'); },
            });
        }
    };

    const columns = [
        {
            header: 'Designation Name',
            accessor: 'name',
            className: 'w-[400px]',
            cell: (row) => (
                <span className="text-[13px] font-bold text-slate-800">
                    {row.name}
                </span>
            )
        },
        {
            header: 'Description',
            accessor: 'description',
            className: 'w-[800px]',
            cell: (row) => (
                <div className="text-[13px] text-slate-600" title={row.description}>
                    {row.description || '-'}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'w-[100px]',
            cell: (row) => (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${row.status ? 'bg-[#e4f1ef] text-[#008060] border-[#008060]/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {row.status ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Created At',
            accessor: 'created_at',
            className: 'w-[120px]',
            cell: (row) => (
                <span className="text-[13px] text-slate-600">
                    {new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Updated At',
            accessor: 'updated_at',
            className: 'w-[120px]',
            cell: (row) => (
                <span className="text-[13px] text-slate-600">
                    {new Date(row.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[120px]',
            cell: (row, tableActions) => (
                <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openModal(row)} className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer">
                        <SquarePen size={12} />
                    </button>
                    <button onClick={() => tableActions.deleteRow()} className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer">
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }
    ];

    const designationTabs = [
        { name: 'All', count: stats?.all || 0, active: (filters?.status || 'all') === 'all', onClick: () => handleTabChange('all') },
        { name: 'Active', count: stats?.active || 0, active: filters?.status === 'active', onClick: () => handleTabChange('active') },
        { name: 'Inactive', count: stats?.inactive || 0, active: filters?.status === 'inactive', onClick: () => handleTabChange('inactive') },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Designations" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Designations</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage employee and staff designations.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                    <Plus size={14} /> Add Designation
                </button>
            </div>

            <div className="mb-6">
                <DataTable 
                    columns={columns}
                    data={designations?.data || []}
                    pagination={designations}
                    tabs={designationTabs}
                    selectable={true}
                    itemNoun="designations"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search designations by name..."
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                        {editingDesignation ? 'Edit Designation' : 'Add Designation'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Designation Name <span className="text-red-500">*</span></label>
                            <TextInput
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full text-[13px] h-[36px]"
                                placeholder="e.g. Professor"
                            />
                            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full text-[13px] border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] p-2"
                                rows="3"
                                placeholder="Enter description..."
                            ></textarea>
                            {errors.description && <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Status</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.status}
                                    onChange={e => setData('status', e.target.checked)}
                                    className="rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer"
                                />
                                <span className="text-[13px] text-slate-700">Active</span>
                            </label>
                            {errors.status && <p className="text-[11px] text-red-500 mt-1">{errors.status}</p>}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-[3px] text-[12px] font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 cursor-pointer"
                            >
                                {editingDesignation ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
