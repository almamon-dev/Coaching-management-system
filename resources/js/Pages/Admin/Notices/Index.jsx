import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Megaphone } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Modal/DeleteConfirmModal';
import Notify from '@/Utils/Notify';
import Pagination from '@/Components/Pagination'; // assuming generic pagination exists, or just use standard links
import moment from 'moment';

export default function Index({ auth, notices }) {
    const [deleteModal, setDeleteModal] = useState({ show: false, notice: null });
    const [processing, setProcessing] = useState(false);

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
                <Link
                    href={route('admin.notices.create')}
                    className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                >
                    <Plus size={14} strokeWidth={3} /> Create Notice
                </Link>
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
                                        {moment(notice.created_at).format('DD MMM YYYY')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.notices.edit', notice.id)} className="p-1.5 text-slate-400 hover:text-[#008060] rounded hover:bg-slate-100">
                                                <Edit2 size={14} />
                                            </Link>
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
