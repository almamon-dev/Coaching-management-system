import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, Check, Mail, Star, CreditCard } from 'lucide-react';

const Index = ({ auth, notifications }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = 20;
    const count = notifications.data?.length || 0;

    const fromIdx = count > 0 ? startIdx : 0;
    const toIdx = count > 0 ? startIdx + count - 1 : 0;

    const getPaginatedUrl = (url, nextStartIndex) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url, window.location.origin);
            urlObj.searchParams.set('start_index', nextStartIndex.toString());
            return urlObj.pathname + urlObj.search;
        } catch (e) {
            return url;
        }
    };

    const prevUrl = getPaginatedUrl(notifications.prev_page_url, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(notifications.next_page_url, startIdx + perPage);

    const markAllAsRead = () => {
        setIsProcessing(true);
        router.post(route('admin.notifications.read-all'), {}, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false)
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (e) => {
        router.get(route('admin.notifications.index'), { per_page: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'question': return <Mail size={18} />;
            case 'review': return <Star size={18} />;
            default: return <CreditCard size={18} />;
        }
    };

    const getIconClass = (type) => {
        switch (type) {
            case 'question': return 'bg-blue-50 text-blue-600';
            case 'review': return 'bg-orange-50 text-orange-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Notifications" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Notifications</h1>
                    <p className="text-slate-400 text-[11px] font-medium mt-1">View and manage all system notifications</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllAsRead}
                        disabled={isProcessing || auth.user.unread_notifications_count === 0}
                        className="h-[38px] px-4 border border-slate-200 text-slate-600 rounded-[2px] flex items-center gap-1.5 hover:bg-slate-50 transition-all font-bold text-[11px] disabled:opacity-50"
                    >
                        <Check size={14} /> Mark all as read
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.data.length > 0 ? (
                    notifications.data.map((notif) => (
                        <div
                            key={notif.id}
                            className={`bg-white p-5 rounded-[4px] border border-slate-200 transition-all relative overflow-hidden ${notif.read_at ? 'opacity-75' : ''}`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getIconClass(notif.data.type)}`}>
                                    {getIcon(notif.data.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className="text-[14px] font-bold text-[#081621] truncate">
                                            {notif.data.title || 'Notification'}
                                        </h3>
                                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                            {new Date(notif.created_at).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>

                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        {notif.data.message}
                                    </p>

                                    {notif.data.content && (
                                        <div className="mt-2">
                                            <p className="text-[13px] text-[#081621] font-medium leading-relaxed">
                                                <span className="text-[#3749bb] font-bold mr-1.5">
                                                    {notif.data.type === 'question' ? 'Q:' : 'Review:'}
                                                </span>
                                                {notif.data.content}
                                            </p>
                                        </div>
                                    )}

                                    {notif.data.action_url && (
                                        <div className="mt-3">
                                            <a
                                                href={notif.data.action_url}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ef4a23] font-bold hover:underline"
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-20 text-center rounded-[4px] border border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-900">No notifications yet</h3>
                        <p className="text-[13px] text-slate-400 mt-1">When you receive notifications, they will appear here.</p>
                    </div>
                )}

                {/* Custom Style Pagination */}
                {(notifications.prev_page_url || notifications.next_page_url) && (
                    <div className="flex items-center justify-between gap-1 mt-4">
                        <span className="text-[12px] text-slate-500 font-bold tabular-nums">
                            {fromIdx} - {toIdx}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(prevUrl)}
                                disabled={!prevUrl}
                                className={`
                                    px-[11px] h-[25px] flex items-center justify-center text-[11px] font-[600] rounded-[2px] transition-all uppercase tracking-wider
                                    ${!prevUrl
                                        ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                                        : 'text-[#081621] bg-slate-100 hover:bg-slate-200'}
                                `}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => handlePageChange(nextUrl)}
                                disabled={!nextUrl}
                                className={`
                                    px-[11px] h-[25px] flex items-center justify-center text-[11px] font-[600] rounded-[2px] transition-all uppercase tracking-wider
                                    ${!nextUrl
                                        ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                                        : 'text-[#081621] bg-slate-100 hover:bg-slate-200'}
                                `}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Index;
