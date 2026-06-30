import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, Check, RotateCcw, ShoppingBag, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const getNotifMeta = (type) => {
    switch (type) {
        case 'return_updated':
            return {
                icon: RotateCcw,
                iconClass: 'bg-indigo-50 text-indigo-600',
                label: 'Return Update',
            };
        case 'order_status':
            return {
                icon: ShoppingBag,
                iconClass: 'bg-green-50 text-green-600',
                label: 'Order Update',
            };
        default:
            return {
                icon: Bell,
                iconClass: 'bg-slate-50 text-slate-500',
                label: 'Notification',
            };
    }
};

const Notifications = ({ auth, notifications }) => {
    const user = auth.user;
    const [isProcessing, setIsProcessing] = useState(false);

    const markAllAsRead = () => {
        setIsProcessing(true);
        router.post(route('user.notifications.read-all'), {}, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false),
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handleClick = (notif) => {
        if (notif.data?.type === 'return_updated' && notif.data?.order_number) {
            router.get(`/user/orders/${notif.data.order_number}/track`);
        }
    };

    return (
        <StudentLayout user={user}>
            <Head title="My Notifications" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Notifications</h1>
                    <p className="text-slate-400 text-[11px] font-medium mt-1">Your order updates and alerts</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    disabled={isProcessing || user.unread_notifications_count === 0}
                    className="h-[36px] px-4 border border-slate-200 text-slate-600 rounded-[2px] flex items-center gap-1.5 hover:bg-slate-50 transition-all font-bold text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Check size={13} /> Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.data.length > 0 ? (
                    notifications.data.map((notif) => {
                        const meta = getNotifMeta(notif.data?.type);
                        const Icon = meta.icon;
                        const isUnread = !notif.read_at;
                        const isClickable = notif.data?.type === 'return_updated';

                        return (
                            <div
                                key={notif.id}
                                onClick={isClickable ? () => handleClick(notif) : undefined}
                                className={cn(
                                    "bg-white border border-slate-200 rounded-[4px] p-4 flex gap-4 transition-all group",
                                    isClickable ? "cursor-pointer hover:border-[#4f46e5]/30 hover:shadow-sm" : "",
                                    isUnread ? "border-l-2 border-l-[#4f46e5]" : ""
                                )}
                            >
                                {/* Icon */}
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform", meta.iconClass, isClickable ? "group-hover:scale-105" : "")}>
                                    <Icon size={18} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                    meta.iconClass
                                                )}>
                                                    {meta.label}
                                                </span>
                                                {isUnread && (
                                                    <span className="w-2 h-2 bg-[#4f46e5] rounded-full inline-block"></span>
                                                )}
                                            </div>
                                            <p className={cn(
                                                "text-[13px] leading-snug",
                                                isUnread ? "font-semibold text-[#081621]" : "font-medium text-slate-600"
                                            )}>
                                                {notif.data?.message}
                                            </p>

                                            {/* Return-specific extra details */}
                                            {notif.data?.type === 'return_updated' && (
                                                <div className="mt-2 flex flex-wrap gap-3">
                                                    {notif.data.order_number && (
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            Order: <span className="text-[#4f46e5] font-bold">#{notif.data.order_number}</span>
                                                        </span>
                                                    )}
                                                    {notif.data.status && (
                                                        <span className="text-[11px] text-slate-400 font-medium capitalize">
                                                            Status: <span className="text-[#008060] font-bold">{notif.data.status}</span>
                                                        </span>
                                                    )}
                                                    {notif.data.admin_note && (
                                                        <span className="text-[11px] text-slate-400 font-medium italic">
                                                            Note: <span className="text-slate-600">"{notif.data.admin_note}"</span>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {new Date(notif.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                                                {new Date(notif.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </p>
                                        </div>
                                    </div>

                                    {isClickable && (
                                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#4f46e5] opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Order Tracking <ChevronRight size={12} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white border border-slate-200 rounded-[4px] p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={30} className="text-slate-200" />
                        </div>
                        <h3 className="text-[15px] font-bold text-slate-700">No notifications yet</h3>
                        <p className="text-[12px] text-slate-400 mt-1">When you receive updates about your orders or returns, they'll appear here.</p>
                    </div>
                )}

                {/* Pagination */}
                {(notifications.prev_page_url || notifications.next_page_url) && (
                    <div className="flex items-center justify-between gap-1 mt-4 pt-4 border-t border-slate-100">
                        <span className="text-[12px] text-slate-400 font-medium">
                            Showing {notifications.data.length} notifications
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(notifications.prev_page_url)}
                                disabled={!notifications.prev_page_url}
                                className="px-3 h-[30px] text-[11px] font-bold rounded-[2px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(notifications.next_page_url)}
                                disabled={!notifications.next_page_url}
                                className="px-3 h-[30px] text-[11px] font-bold rounded-[2px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Notifications;
