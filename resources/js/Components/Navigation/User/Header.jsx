import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Search, Bell, Menu, Settings, LogOut, Globe, GraduationCap
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
        <header className="h-[60px] bg-white sticky top-0 z-[50] flex items-center px-4 md:px-6 border-b border-slate-200/60 shadow-sm">
            {/* LEFT: Mobile Menu Only */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* SPACER */}
            <div className="flex-1" />

            {/* RIGHT side group */}
            <div className="flex items-center gap-2">
                {/* Visit Site */}
                <a
                    href="/"
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-[#008060] hover:bg-[#f1f8f5] transition-all border border-slate-200"
                    title="Visit Frontend"
                >
                    <Globe size={17} strokeWidth={2} />
                </a>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-[#f04f23] transition-all relative border border-slate-200"
                    >
                        <Bell size={17} strokeWidth={2} />
                        {auth?.user?.unread_notifications_count > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#f04f23] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {auth.user.unread_notifications_count}
                            </span>
                        )}
                    </button>
                    {notifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-[13px] font-bold text-slate-900">Notifications</h3>
                                {auth?.user?.unread_notifications_count > 0 && (
                                    <button onClick={markAllAsRead} className="text-[10px] text-[#f04f23] font-semibold hover:underline">Mark all as read</button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {auth?.user?.notifications?.length > 0 ? (
                                    auth.user.notifications.map((notif) => (
                                        <div key={notif.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-50 text-slate-600">
                                                    <Bell size={15} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[12px] text-slate-800 font-medium group-hover:text-[#f04f23] transition-colors leading-snug">
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
                                className="p-2.5 text-center border-t border-slate-100 block text-[11px] font-bold text-[#f04f23] hover:bg-[#fff5f2] transition-colors"
                            >
                                View All Notifications
                            </Link>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2 ml-2" ref={dropdownRef}>
                    <div className="text-right leading-tight hidden sm:block mr-1">
                        <p className="text-[13px] font-bold text-slate-700">{auth?.user?.name || "User"}</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Staff Member</p>
                    </div>
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-9 h-9 rounded-full border border-slate-200 p-0.5 hover:border-[#f04f23] transition-all relative overflow-hidden ring-2 ring-slate-100 shadow-sm"
                    >
                        <img
                            src={auth?.user?.profile_picture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'User'}&background=f04f23&color=fff`}
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
                            <Link href={route("profile.edit")} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                <Settings size={15} className="text-slate-400" /> Manage Account
                            </Link>
                            <div className="my-1 border-t border-slate-50"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 font-bold transition-colors">
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
