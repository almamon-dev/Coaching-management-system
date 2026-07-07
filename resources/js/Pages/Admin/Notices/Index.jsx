import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Megaphone, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal/Modal';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import Notify from '@/Utils/Notify';
import DataTable from '@/Components/Table/DataTable';


export default function Index({ auth, notices }) {
    const [deleteModal, setDeleteModal] = useState({ show: false, notice: null });
    const [noticeModal, setNoticeModal] = useState({ show: false, mode: 'create', notice: null });
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, put, processing: formProcessing, errors, reset, clearErrors } = useForm({
        title: '',
        content: '',
        type: 'notice',
        target_audience: 'all',
        status: 'published',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setNoticeModal({ show: true, mode: 'create', notice: null });
    };

    const openEditModal = (notice) => {
        clearErrors();
        setData({
            title: notice.title || '',
            content: notice.content || '',
            type: notice.type || 'notice',
            target_audience: notice.target_audience || 'all',
            status: notice.status || 'draft',
        });
        setNoticeModal({ show: true, mode: 'edit', notice: notice });
    };

    const closeNoticeModal = () => {
        setNoticeModal({ show: false, mode: 'create', notice: null });
        reset();
        clearErrors();
    };

    const handleNoticeSubmit = (e) => {
        e.preventDefault();
        
        if (noticeModal.mode === 'create') {
            post(route('admin.notices.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    closeNoticeModal();
                    Notify.success('Success', 'Notice created successfully');
                },
                onError: (err) => {
                    if(Object.keys(err).length > 0) {
                        Notify.error('Validation Error', 'Please check the form for errors.');
                    }
                }
            });
        } else {
            put(route('admin.notices.update', noticeModal.notice.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeNoticeModal();
                    Notify.success('Success', 'Notice updated successfully');
                },
                onError: (err) => {
                    if(Object.keys(err).length > 0) {
                        Notify.error('Validation Error', 'Please check the form for errors.');
                    }
                }
            });
        }
    };

    const handleDeleteClick = (notice) => {
        setDeleteModal({ show: true, notice });
    };

    const handleConfirmDelete = () => {
        setProcessing(true);
        router.delete(route("admin.notices.destroy", deleteModal.notice.id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setDeleteModal({ show: false, notice: null });
                Notify.success('Success', 'Notice deleted successfully');
            },
            onError: () => setProcessing(false)
        });
    };

    const [search, setSearch] = useState('');

    const columns = [
        {
            header: 'Title',
            accessor: 'title',
            className: 'w-[250px]',
            cell: (row) => <span className="text-[13px] text-[#202223] font-medium max-w-[250px] truncate block">{row.title}</span>
        },
        {
            header: 'Type',
            accessor: 'type',
            className: 'w-[120px]',
            cell: (row) => <span className="text-[13px] text-[#6d7175] capitalize">{row.type}</span>
        },
        {
            header: 'Audience',
            accessor: 'target_audience',
            className: 'w-[120px]',
            cell: (row) => <span className="text-[13px] text-[#6d7175] capitalize">{row.target_audience}</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'w-[100px]',
            cell: (row) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    row.status === 'published' ? 'bg-[#e4f1ef] text-[#008060]' : 'bg-amber-50 text-amber-700'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Date',
            accessor: 'created_at',
            className: 'w-[120px]',
            cell: (row) => <span className="text-[13px] text-[#6d7175] tabular-nums">{new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'w-[100px] text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => openEditModal(row)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer shadow-sm"
                        title="Edit Notice"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row)}
                        className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer shadow-sm"
                        title="Delete Notice"
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Type</label>
                <SelectInput
                    value={''} // Will be handled if backend pagination and filters are implemented
                    onChange={() => {}}
                    options={[
                        { id: '', name: 'All Types' },
                        { id: 'notice', name: 'Notice' },
                        { id: 'announcement', name: 'Announcement' }
                    ]}
                    placeholder="Select type..."
                />
            </div>
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Audience</label>
                <SelectInput
                    value={''}
                    onChange={() => {}}
                    options={[
                        { id: '', name: 'All Audiences' },
                        { id: 'teacher', name: 'Teachers Only' },
                        { id: 'student', name: 'Students Only' }
                    ]}
                    placeholder="Select audience..."
                />
            </div>
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                <SelectInput
                    value={''}
                    onChange={() => {}}
                    options={[
                        { id: '', name: 'All Statuses' },
                        { id: 'published', name: 'Published' },
                        { id: 'draft', name: 'Draft' }
                    ]}
                    placeholder="Select status..."
                />
            </div>
        </div>
    );

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Notice Board" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Notice Board</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage notices, announcements, and global communications.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} strokeWidth={3} /> Create Notice
                </button>
            </div>

            <div className="mb-6">
                <DataTable
                    columns={columns}
                    data={notices?.data || []}
                    pagination={notices}
                    selectable={false}
                    itemNoun="notices"
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search notices..."
                    advancedFilters={advancedFiltersNode}
                />
            </div>

            <Modal show={noticeModal.show} onClose={closeNoticeModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-[18px] font-bold text-[#202223]">
                            {noticeModal.mode === 'create' ? 'Create Notice' : 'Edit Notice'}
                        </h2>
                    </div>

                    <form onSubmit={handleNoticeSubmit} id="noticeForm">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="title">Notice Title <span className="text-red-500">*</span></InputLabel>
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="e.g. Eid-ul-Fitr Holiday Announcement"
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <InputLabel htmlFor="type">Notice Type <span className="text-red-500">*</span></InputLabel>
                                    <SelectInput
                                        id="type"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        required
                                        options={[
                                            { id: 'notice', name: 'Notice' },
                                            { id: 'announcement', name: 'Announcement' }
                                        ]}
                                    />
                                    {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
                                </div>

                                <div>
                                    <InputLabel htmlFor="target_audience">Target Audience <span className="text-red-500">*</span></InputLabel>
                                    <SelectInput
                                        id="target_audience"
                                        value={data.target_audience}
                                        onChange={e => setData('target_audience', e.target.value)}
                                        required
                                        options={[
                                            { id: 'all', name: 'All Users (Public)' },
                                            { id: 'teacher', name: 'Teachers Only' },
                                            { id: 'student', name: 'Students Only' }
                                        ]}
                                    />
                                    {errors.target_audience && <div className="text-red-500 text-xs mt-1">{errors.target_audience}</div>}
                                </div>
                                
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="content">Notice Content <span className="text-red-500">*</span></InputLabel>
                                    <TextArea
                                        id="content"
                                        rows="5"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Write the full description of the notice here..."
                                        required
                                    />
                                    {errors.content && <div className="text-red-500 text-xs mt-1">{errors.content}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="status">Publish Status <span className="text-red-500">*</span></InputLabel>
                                    <SelectInput
                                        id="status"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        required
                                        options={[
                                            { id: 'published', name: 'Published (Immediate)' },
                                            { id: 'draft', name: 'Draft (Save for later)' }
                                        ]}
                                    />
                                    {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                                    <p className="text-xs text-slate-500 mt-1">
                                        {noticeModal.mode === 'create' 
                                            ? 'Published notices will immediately notify the target audience.'
                                            : 'If this was previously a draft, changing to Published will trigger notifications.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={closeNoticeModal}
                                className="px-4 py-1.5 border border-[#ebebeb] text-[#202223] rounded-[3px] font-bold text-[12px] hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm disabled:opacity-70"
                            >
                                {formProcessing ? 'Saving...' : (
                                    <>
                                        <Save size={14} strokeWidth={2.5} /> 
                                        {noticeModal.mode === 'create' ? 'Save Notice' : 'Update Notice'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <DeleteConfirmModal
                show={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, notice: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Notice"
                message={`Are you sure you want to delete "${deleteModal.notice?.title}"?`}
                processing={processing}
            />
        </AdminLayout>
    );
}
