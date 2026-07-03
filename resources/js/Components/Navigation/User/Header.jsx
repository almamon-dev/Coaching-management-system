import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Search, Bell, Menu, Settings, LogOut, Calendar, ChevronDown
} from "lucide-react";

const Header = ({ onMenuClick }) => {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const markAllAsRead = () => {
        router.post(route("user.notifications.read-all"), {}, {
            preserveScroll: true,
            onSuccess: () => setNotifOpen(false)
        });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-[70px] bg-white sticky top-0 z-[50] flex items-center px-4 md:px-8 border-b border-slate-200/60 justify-between">
            
            {/* LEFT: Mobile Menu Button & Search Bar */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                >
                    <Menu size={20} />
                </button>

                {/* Mobile: show logo */}
                <Link href="/" className="flex items-center lg:hidden shrink-0">
                    <img src="/images/school-logo-wide.png" alt="Logo" className="h-[38px] w-auto" />
                </Link>

                {/* MIDDLE: Search Bar */}
                <div className="w-full max-w-[400px] relative hidden md:block">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-[#f3f4f6] border-transparent text-[13px] font-medium text-slate-700 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400" 
                    />
                </div>
            </div>

            {/* RIGHT side group */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                
                {/* Notifications & Calendar Icons */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all relative"
                        >
                            <Bell size={18} strokeWidth={2} />
                            {auth?.user?.unread_notifications_count > 0 && (
                                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {auth.user.unread_notifications_count}
                                </span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="text-[13px] font-bold text-slate-900">Notifications</h3>
                                    {auth?.user?.unread_notifications_count > 0 && (
                                        <button onClick={markAllAsRead} className="text-[10px] text-blue-600 font-semibold hover:underline">Mark all as read</button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {auth?.user?.notifications?.length > 0 ? (
                                        auth.user.notifications.map((notif) => (
                                            <div key={notif.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                                                        <Bell size={15} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[12px] text-slate-800 font-medium group-hover:text-blue-600 transition-colors leading-snug">
                                                            {notif.data.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-[10px] text-slate-400">
                                                                {new Date(notif.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
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
                                <Link
                                    href={route('user.notifications.index')}
                                    onClick={() => setNotifOpen(false)}
                                    className="p-2.5 text-center border-t border-slate-100 block text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>

                    <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all hidden sm:flex">
                        <Calendar size={18} strokeWidth={2} />
                    </button>
                </div>

                <div className="w-px h-6 bg-slate-200/80 mx-1 hidden sm:block"></div>

                {/* Profile */}
                <div className="flex items-center gap-2.5 cursor-pointer group hover:bg-slate-50 pl-2 pr-1 py-1 rounded-full transition-colors relative" onClick={() => setOpen(!open)} ref={dropdownRef}>
                    <div className="text-right leading-tight hidden sm:block">
                        <p className="text-[12.5px] font-bold text-slate-800">{auth?.user?.name || "Demo User"}</p>
                        <p className="text-[10.5px] text-slate-500 font-medium">Staff Member</p>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <img
                            src={auth?.user?.profile_picture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'User'}&background=cbf4c9&color=166534`}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <ChevronDown size={14} className="text-slate-400 hidden sm:block mr-1 group-hover:text-slate-600 transition-colors" />

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 top-12 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                            <Link href={route("profile.edit")} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                <Settings size={15} className="text-slate-400" /> Manage Account
                            </Link>
                            <div className="my-1 border-t border-slate-50"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 font-bold transition-colors">
                                <LogOut size={15} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
