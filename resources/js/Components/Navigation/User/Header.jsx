import React, { useState, useRef, useEffect, memo } from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, Bell, ShoppingCart, Menu, X, RotateCcw } from 'lucide-react';

const Header = memo(({ user, isSidebarOpen, setIsSidebarOpen }) => {
    const [notifOpen, setNotifOpen] = useState(false);
    const notificationRef = useRef(null);

    const markAllAsRead = () => {
        router.post(route("user.notifications.read-all"), {}, {
            preserveScroll: true,
            onSuccess: () => setNotifOpen(false)
        });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between gap-8">
                <div className="flex items-center gap-6 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-sm transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link href="/" prefetch className="flex-shrink-0 flex items-center gap-2 h-[45px]">
                        <div className="relative text-[#16a34a]">
                            <ShoppingCart size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={2.5} />
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f59e0b] rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-[20px] font-black tracking-tight text-[#16a34a]">
                            DailyFresh
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 max-w-xl relative group">
                    <input
                        type="text"
                        placeholder="Search for products, orders or help..."
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-[2px] pl-4 pr-12 text-sm focus:bg-white focus:border-[#4f46e5] focus:ring-0 transition-all placeholder:text-slate-400"
                    />
                    <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-[#4f46e5]">
                        <Search size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 md:gap-5">
                    <div className="flex items-center border-r border-slate-100 pr-2 md:pr-5 gap-1 md:gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="p-2 text-slate-500 hover:text-[#4f46e5] hover:bg-slate-50 rounded-full transition-all relative"
                            >
                                <Bell size={20} />
                                {user?.unread_notifications_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 min-w-[12px] h-[12px] bg-[#4f46e5] border-2 border-white rounded-full flex items-center justify-center"></span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <h3 className="text-[13px] font-bold text-slate-900">Notifications</h3>
                                        {user?.unread_notifications_count > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-[10px] text-[#4f46e5] font-semibold hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {user?.notifications?.length > 0 ? (
                                            user.notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => {
                                                        setNotifOpen(false);
                                                        if (notif.data.type === 'return_updated') {
                                                            router.get(`/user/orders/${notif.data.order_number}/track`);
                                                        }
                                                    }}
                                                    className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] text-[#4f46e5] flex items-center justify-center shrink-0">
                                                            {notif.data.type === 'return_updated' ? (
                                                                <RotateCcw size={15} />
                                                            ) : (
                                                                <Bell size={15} />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[12px] text-slate-800 font-medium group-hover:text-[#4f46e5] transition-colors leading-snug">
                                                                {notif.data.message}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-[10px] text-slate-400">
                                                                    {new Date(notif.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                                </p>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                                <p className="text-[10px] text-slate-400 lowercase">
                                                                    {new Date(notif.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell size={18} className="text-slate-300" />
                                                </div>
                                                <p className="text-[12px] text-slate-500 font-medium">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="p-2 text-slate-500 hover:text-[#4f46e5] hover:bg-slate-50 rounded-full transition-all relative">
                            <ShoppingCart size={20} />
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#4f46e5] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">3</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pl-1">
                        <div className="hidden sm:block text-right">
                            <p className="text-[12px] font-bold text-[#081621] leading-none">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Account</p>
                        </div>
                        <button className="w-9 h-9 rounded-[2px] bg-[#4f46e5] flex items-center justify-center text-white font-black text-sm border border-white/20 shadow-sm">
                            {user.name.charAt(0)}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
});

export default Header;
