import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    MessageSquare, Phone, Mail, Calendar, Clock, User, BookOpen,
    Search, CheckCircle2, Clock3, UserCheck, XCircle, Trash2, Eye,
    AlertCircle, MessageCircle, ExternalLink, Check, X, Shield, RefreshCw
} from 'lucide-react';
import Pagination from '@/Components/Common/Pagination';

export default function InquiriesIndex({
    inquiries = { data: [], links: [] },
    filters = { status: 'all', search: '' },
    stats = { all: 0, pending: 0, contacted: 0, enrolled: 0, closed: 0 },
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Edit form for status and admin notes
    const { data, setData, put, processing, reset } = useForm({
        status: 'pending',
        admin_notes: '',
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.inquiries.index'), {
            search: search,
            status: filters.status || 'all',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterStatus = (status) => {
        router.get(route('admin.inquiries.index'), {
            status: status,
            search: search,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const openDetailModal = (inquiry) => {
        setSelectedInquiry(inquiry);
        setData({
            status: inquiry.status || 'pending',
            admin_notes: inquiry.admin_notes || '',
        });
        setIsDetailModalOpen(true);
    };

    const handleQuickStatusChange = (inquiry, newStatus) => {
        router.put(route('admin.inquiries.update', inquiry.id), {
            status: newStatus,
            admin_notes: inquiry.admin_notes || '',
        }, {
            preserveScroll: true,
        });
    };

    const handleSaveDetailModal = (e) => {
        e.preventDefault();
        if (!selectedInquiry) return;

        put(route('admin.inquiries.update', selectedInquiry.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDetailModalOpen(false);
            },
        });
    };

    const handleDelete = (inquiry) => {
        if (confirm(`Are you sure you want to delete inquiry #${inquiry.id} from ${inquiry.name}?`)) {
            router.delete(route('admin.inquiries.destroy', inquiry.id), {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock3 size={12} /> Pending
                    </span>
                );
            case 'contacted':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Phone size={12} /> Contacted
                    </span>
                );
            case 'enrolled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Enrolled
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle size={12} /> Closed
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 rounded-[3px] text-[11px] font-bold bg-slate-100 text-slate-600">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout>
            <Head title="Academic Inquiries - Admin Panel" />

            <div className="space-y-5">
                {/* 1. Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                                <MessageSquare size={18} />
                            </span>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Inquiries</h1>
                            {stats.pending > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                                    {stats.pending} New
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Online counseling requests, batch questions, and prospective student leads submitted via the website.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone, batch..."
                                className="w-64 pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#16a34a] focus:border-[#16a34a] transition-all"
                            />
                            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                        </form>
                    </div>
                </div>

                {/* 2. Overview Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                        type="button"
                        onClick={() => handleFilterStatus('all')}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                            filters.status === 'all'
                                ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                        }`}
                    >
                        <span className="text-[11px] font-semibold text-slate-500 block">Total Inquiries</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{stats.all}</div>
                        <span className="text-[10.5px] font-medium text-slate-400">All submissions</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleFilterStatus('pending')}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                            filters.status === 'pending'
                                ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-amber-200 shadow-2xs'
                        }`}
                    >
                        <span className="text-[11px] font-semibold text-amber-600 block">Pending Follow-up</span>
                        <div className="text-2xl font-black text-amber-700 mt-1">{stats.pending}</div>
                        <span className="text-[10.5px] font-bold text-amber-600">Requires counseling call</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleFilterStatus('contacted')}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                            filters.status === 'contacted'
                                ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-blue-200 shadow-2xs'
                        }`}
                    >
                        <span className="text-[11px] font-semibold text-blue-600 block">Contacted</span>
                        <div className="text-2xl font-black text-blue-700 mt-1">{stats.contacted}</div>
                        <span className="text-[10.5px] font-medium text-blue-600">In communication</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleFilterStatus('enrolled')}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                            filters.status === 'enrolled'
                                ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-emerald-200 shadow-2xs'
                        }`}
                    >
                        <span className="text-[11px] font-semibold text-[#16a34a] block">Enrolled Students</span>
                        <div className="text-2xl font-black text-[#16a34a] mt-1">{stats.enrolled}</div>
                        <span className="text-[10.5px] font-semibold text-emerald-600">Successfully admitted</span>
                    </button>
                </div>

                {/* 3. Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1 overflow-x-auto text-xs">
                        {[
                            { key: 'all', label: 'All Inquiries', count: stats.all },
                            { key: 'pending', label: 'Pending', count: stats.pending },
                            { key: 'contacted', label: 'Contacted', count: stats.contacted },
                            { key: 'enrolled', label: 'Enrolled', count: stats.enrolled },
                            { key: 'closed', label: 'Closed', count: stats.closed },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleFilterStatus(tab.key)}
                                className={`px-3 py-1.5 rounded-[3px] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    (filters.status || 'all') === tab.key
                                        ? 'bg-[#16a34a] text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    (filters.status || 'all') === tab.key
                                        ? 'bg-white/20 text-white font-black'
                                        : 'bg-slate-200 text-slate-700'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                        Showing {inquiries.data?.length || 0} of {stats.all} inquiries
                    </div>
                </div>

                {/* 4. Inquiries Table */}
                <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-[11px] font-bold text-slate-600 uppercase">
                                <tr>
                                    <th className="py-3 px-3.5">Student / Contact</th>
                                    <th className="py-3 px-3.5">Phone & Actions</th>
                                    <th className="py-3 px-3.5">Target Batch / Subject</th>
                                    <th className="py-3 px-3.5">Question / Message</th>
                                    <th className="py-3 px-3.5 text-center">Status</th>
                                    <th className="py-3 px-3.5 text-right">Submitted</th>
                                    <th className="py-3 px-3.5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inquiries.data && inquiries.data.length > 0 ? (
                                    inquiries.data.map((inq) => {
                                        const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                                        const waLink = cleanPhone.startsWith('880') 
                                            ? `https://wa.me/${cleanPhone}` 
                                            : cleanPhone.startsWith('0') 
                                                ? `https://wa.me/88${cleanPhone}` 
                                                : `https://wa.me/${cleanPhone}`;

                                        const dateStr = inq.created_at ? new Date(inq.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-';

                                        return (
                                            <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                                                {/* Student Name & Email */}
                                                <td className="py-3 px-3.5">
                                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        <span>{inq.name}</span>
                                                    </div>
                                                    {inq.email && (
                                                        <span className="text-[11px] text-slate-500 font-normal block truncate max-w-[160px]">
                                                            {inq.email}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Phone & Direct Contact Buttons */}
                                                <td className="py-3 px-3.5">
                                                    <div className="font-mono font-semibold text-slate-800">
                                                        {inq.phone}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <a
                                                            href={`tel:${inq.phone}`}
                                                            title="Direct Phone Call"
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-[2px] transition-colors"
                                                        >
                                                            <Phone size={10} /> Call
                                                        </a>
                                                        <a
                                                            href={waLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Chat on WhatsApp"
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-[2px] transition-colors"
                                                        >
                                                            <MessageCircle size={10} /> WhatsApp
                                                        </a>
                                                    </div>
                                                </td>

                                                {/* Target Batch / Subject */}
                                                <td className="py-3 px-3.5">
                                                    {inq.batch_or_course ? (
                                                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-[#047857] border border-emerald-200/80 rounded-[3px]">
                                                            {inq.batch_or_course}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">General Coaching</span>
                                                    )}
                                                </td>

                                                {/* Message */}
                                                <td className="py-3 px-3.5 max-w-xs">
                                                    <p 
                                                        onClick={() => openDetailModal(inq)} 
                                                        className="text-slate-700 text-xs line-clamp-2 leading-relaxed cursor-pointer hover:text-[#16a34a] transition-colors"
                                                        title="Click to view full message"
                                                    >
                                                        {inq.message}
                                                    </p>
                                                    {inq.admin_notes && (
                                                        <p className="text-[10.5px] text-amber-700 font-medium mt-1 truncate">
                                                            <b>Note:</b> {inq.admin_notes}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Status Dropdown/Badge */}
                                                <td className="py-3 px-3.5 text-center">
                                                    <div className="inline-block relative">
                                                        <select
                                                            value={inq.status || 'pending'}
                                                            onChange={(e) => handleQuickStatusChange(inq, e.target.value)}
                                                            className={`text-[11px] font-bold py-1 pl-2.5 pr-6 rounded-[3px] border cursor-pointer transition-all ${
                                                                inq.status === 'pending'
                                                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                                                    : inq.status === 'contacted'
                                                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                                                    : inq.status === 'enrolled'
                                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                                            }`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="enrolled">Enrolled</option>
                                                            <option value="closed">Closed</option>
                                                        </select>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="py-3 px-3.5 text-right text-slate-500 text-[11px] whitespace-nowrap">
                                                    {dateStr}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-3.5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openDetailModal(inq)}
                                                            className="p-1.5 text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 rounded-[3px] transition-colors cursor-pointer"
                                                            title="View Details & Notes"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(inq)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] transition-colors cursor-pointer"
                                                            title="Delete Inquiry"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <MessageSquare size={36} className="text-slate-300" />
                                                <p className="font-semibold text-sm text-slate-600">No academic inquiries found.</p>
                                                <p className="text-xs text-slate-400">
                                                    When students or guardians submit the inquiry form on your website, they will appear here.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {inquiries.links && inquiries.links.length > 3 && (
                        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-center">
                            <Pagination links={inquiries.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Detail & Follow-up Notes Modal */}
            {isDetailModalOpen && selectedInquiry && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
                    onClick={() => setIsDetailModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-[4px] max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-100 text-[#16a34a] rounded-[3px]">
                                    <MessageSquare size={16} />
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Academic Inquiry #{selectedInquiry.id}</h3>
                                    <p className="text-[11px] text-slate-500">
                                        Received on {new Date(selectedInquiry.created_at).toLocaleString('en-GB')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[3px] transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveDetailModal} className="p-5 space-y-4">
                            {/* Student Profile Box */}
                            <div className="p-3 bg-slate-50/80 rounded-[4px] border border-slate-200/80 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-700">Student / Guardian:</span>
                                    <span className="font-semibold text-slate-900">{selectedInquiry.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-700">Mobile Phone:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[#16a34a]">{selectedInquiry.phone}</span>
                                        <a
                                            href={`tel:${selectedInquiry.phone}`}
                                            className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-700 border border-slate-300 rounded hover:bg-emerald-50"
                                        >
                                            Call
                                        </a>
                                    </div>
                                </div>
                                {selectedInquiry.email && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">Email:</span>
                                        <span className="text-slate-600">{selectedInquiry.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-700">Target Batch:</span>
                                    <span className="font-semibold text-[#047857]">
                                        {selectedInquiry.batch_or_course || 'General Coaching'}
                                    </span>
                                </div>
                            </div>

                            {/* Inquiry Message */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    Student's Question / Inquiry Note
                                </label>
                                <div className="p-3 bg-white border border-slate-200 rounded-[3px] text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    Follow-up Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#16a34a] focus:border-[#16a34a]"
                                >
                                    <option value="pending">Pending (Awaiting counseling call)</option>
                                    <option value="contacted">Contacted (Spoke with student/guardian)</option>
                                    <option value="enrolled">Enrolled (Student confirmed admission)</option>
                                    <option value="closed">Closed (Inquiry finished / not interested)</option>
                                </select>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                    Admin / Counselor Follow-up Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    placeholder="Write follow-up notes, discussion details, agreed admission date, etc..."
                                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-[3px] focus:ring-1 focus:ring-[#16a34a] focus:border-[#16a34a]"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[3px] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Follow-up'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

