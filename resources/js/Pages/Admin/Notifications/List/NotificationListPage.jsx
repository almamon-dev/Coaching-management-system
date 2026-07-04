import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Bell, Check, Megaphone, Info } from 'lucide-react';

const Index = ({ auth, notifications }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const count = notifications.data?.length || 0;
    const fromIdx = notifications.from || 0;
    const toIdx = notifications.to || 0;
    const total = notifications.total || 0;

    const markAllAsRead = () => {
        setIsProcessing(true);
        router.post(route('admin.notifications.read-all'), {}, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false)
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'announcement': return <Megaphone size={18} />;
            case 'notice': return <Info size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getIconClass = (type) => {
        switch (type) {
            case 'announcement': return 'bg-amber-50 text-amber-600 border border-amber-100';
            case 'notice': return 'bg-blue-50 text-blue-600 border border-blue-100';
            default: return 'bg-slate-50 text-slate-600 border border-slate-100';
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Notifications" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Notifications</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View and manage all system notifications</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllAsRead}
                        disabled={isProcessing || auth.user.unread_notifications_count === 0}
                        className="px-4 py-1.5 border border-[#ebebeb] text-[#202223] bg-white rounded-[3px] flex items-center gap-2 hover:bg-slate-50 transition-all font-bold text-[12px] shadow-sm disabled:opacity-50"
                    >
                        <Check size={14} /> Mark all as read
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="divide-y divide-[#ebebeb]">
                    {notifications.data.length > 0 ? (
                        notifications.data.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 transition-all relative flex gap-4 items-start ${!notif.read_at ? 'bg-blue-50/20' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${getIconClass(notif.data.type)}`}>
                                    {getIcon(notif.data.type)}
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className={`text-[13px] ${!notif.read_at ? 'font-bold text-[#202223]' : 'font-semibold text-slate-700'} truncate`}>
                                            {notif.data.title || 'System Notification'}
                                        </h3>
                                        <span className="text-[11px] text-[#6d7175] font-medium whitespace-nowrap shrink-0">
                                            {new Date(notif.created_at).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                                            })}
                                        </span>
                                    </div>
                                    <p className={`text-[13px] ${!notif.read_at ? 'text-slate-800' : 'text-[#6d7175]'} leading-relaxed`}>
                                        {notif.data.message}
                                    </p>
                                </div>
                                {!notif.read_at && (
                                    <div className="w-2 h-2 rounded-full bg-[#008060] shrink-0 mt-2"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-[14px] font-bold text-[#202223]">No notifications yet</h3>
                            <p className="text-[13px] text-[#6d7175] mt-1">When you receive notifications, they will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-[#ebebeb] flex items-center justify-between bg-slate-50/50">
                        <div className="text-[12px] text-[#6d7175]">
                            Showing {fromIdx} to {toIdx} of {total} results
                        </div>
                        <div className="flex gap-1">
                            {notifications.links.map((link, idx) => (
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
        </AdminLayout>
    );
};

export default Index;
