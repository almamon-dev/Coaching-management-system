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

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#ebebeb] bg-[#f9fafb]">
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider">Title</th>
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider">Audience</th>
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-[12px] font-bold text-[#5c5f62] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb]">
                            {notices.data.length > 0 ? notices.data.map((notice) => (
                                <tr key={notice.id} className="hover:bg-[#f9fafb] transition-colors group">
                                    <td className="px-4 py-3 text-[13px] text-[#202223] font-medium max-w-xs truncate">
                                        {notice.title}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-[#6d7175] capitalize">
                                        {notice.type}
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-[#6d7175] capitalize">
                                        {notice.target_audience}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                            notice.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {notice.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-[13px] text-[#6d7175]">
                                        {new Date(notice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(notice)} className="p-1.5 text-slate-400 hover:text-[#008060] rounded hover:bg-slate-100">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(notice)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-[#6d7175] text-[13px]">
                                        <div className="flex flex-col items-center justify-center">
                                            <Megaphone size={32} className="text-slate-300 mb-2" />
                                            <p>No notices found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Basic Pagination fallback if global component is not found */}
                {notices.links && notices.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-[#ebebeb] flex items-center justify-between">
                        <div className="text-[12px] text-[#6d7175]">
                            Showing {notices.from || 0} to {notices.to || 0} of {notices.total} results
                        </div>
                        <div className="flex gap-1">
                            {notices.links.map((link, idx) => (
                                <Link 
                                    key={idx} 
                                    href={link.url || '#'} 
                                    className={`px-3 py-1 text-[12px] border rounded-[3px] ${link.active ? 'bg-[#008060] text-white border-[#008060]' : 'bg-white text-[#202223] border-[#ebebeb] hover:bg-slate-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
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
