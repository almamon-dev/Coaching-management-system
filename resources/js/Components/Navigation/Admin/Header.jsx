import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Search, Bell, Settings, LogOut, Calendar, ChevronDown, AlignLeft, UserCheck, Users
} from "lucide-react";
import SchoolLogo from "@/Components/SchoolLogo";

const Header = ({ onMenuClick, onToggleSidebar }) => {
    const { auth, settings, url } = usePage();
    const currentPath = (url || "").split("?")[0].split("#")[0];
    const coachingMode = settings?.coaching_mode || "single";
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [switchingMode, setSwitchingMode] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const getPageTitle = (path) => {
        if (!path || path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
        if (path.startsWith('/admin/courses') || path.startsWith('/admin/subjects')) return 'Subject Management';
        if (path.startsWith('/admin/batches')) return 'Batch Management';
        if (path.startsWith('/admin/class-routines')) return 'Class Routine';
        if (path.startsWith('/admin/teachers')) return 'Teacher Management';
        if (path.startsWith('/admin/admissions')) return 'New Admission';
        if (path.startsWith('/admin/students')) return 'Student Management';
        if (path.startsWith('/admin/attendance')) return 'Student Attendance';
        if (path.startsWith('/admin/exams')) return 'Exams & Results';
        if (path.startsWith('/admin/assignments')) return 'Assignments & Homework';
        if (path.startsWith('/admin/study-materials')) return 'Study Materials';
        if (path.startsWith('/admin/fees')) return 'Fee Collection & Dues';
        if (path.startsWith('/admin/operational-accounts')) return 'Income & Expense';
        if (path.startsWith('/admin/reports')) return 'Reports & Analytics';
        if (path.startsWith('/admin/cms/landing')) return 'Landing Page CMS';
        if (path.startsWith('/admin/cms/about')) return 'About Page CMS';
        if (path.startsWith('/admin/cms/admission')) return 'Admission Instructions';
        if (path.startsWith('/admin/cms/footer-contact')) return 'Footer & Contact CMS';
        if (path.startsWith('/admin/notices')) return 'Notice Board';
        if (path.startsWith('/admin/events')) return 'Upcoming Events';
        if (path.startsWith('/admin/galleries')) return 'Photo Gallery';
        if (path.startsWith('/admin/testimonials')) return 'Success Stories & Stats';
        if (path.startsWith('/admin/permissions')) return 'Role Permissions';
        if (path.startsWith('/admin/activity-logs')) return 'Activity Logs';
        if (path.startsWith('/admin/settings')) return 'General Settings';
        if (path.startsWith('/admin/backup')) return 'Database Backup';
        return 'Admin Dashboard';
    };

    const handleModeSwitch = (targetMode) => {
        if (targetMode === coachingMode || switchingMode) return;
        setSwitchingMode(true);
        router.post(
            route("admin.settings.toggle-mode"),
            { mode: targetMode },
            {
                preserveScroll: true,
                onFinish: () => setSwitchingMode(false),
            }
        );
    };

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const markAllAsRead = () => {
        router.post(route("admin.notifications.read-all"), {}, {
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
        <header className="h-[70px] bg-white sticky top-0 z-30 flex items-center px-4 md:px-8 border-b border-slate-200/60 justify-between">

            {/* LEFT: Menu & Title */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                >
                    <AlignLeft size={20} />
                </button>
                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="hidden lg:flex w-9 h-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                >
                    <AlignLeft size={20} />
                </button>
                {/* Mobile: show logo when sidebar is hidden */}
                <Link href="/dashboard" className="flex items-center lg:hidden shrink-0">
                    <SchoolLogo variant="wide" className="h-[38px]" />
                </Link>
                <h2 className="text-[16px] font-bold text-slate-800 tracking-tight hidden lg:block">
                    {getPageTitle(currentPath)}
                </h2>

                {/* MIDDLE: Search Bar */}
                <div className="w-full max-w-[220px] xl:max-w-[320px] relative hidden md:block ml-4">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-[#f3f4f6] border-transparent text-[13px] font-medium text-slate-700 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* RIGHT side group */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Coaching Mode Switch (Single Teacher vs Multi-Teacher) */}
                <div
                    onClick={() => !switchingMode && handleModeSwitch(coachingMode === "single" ? "multi" : "single")}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200/90 cursor-pointer select-none transition-all shadow-xs shrink-0"
                    title={coachingMode === "single" ? "Currently Single Teacher. Click to switch to Multi-Teacher" : "Currently Multi-Teacher. Click to switch to Single Teacher"}
                >
                    <div className="flex items-center gap-1.5 select-none">
                        {coachingMode === "single" ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 whitespace-nowrap">
                                <UserCheck size={14} className="text-emerald-600 shrink-0" />
                                <span>Single Teacher</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 whitespace-nowrap">
                                <Users size={14} className="text-indigo-600 shrink-0" />
                                <span>Multi-Teacher</span>
                            </span>
                        )}
                    </div>

                    {/* Green Switch Toggle (matching user image) */}
                    <div
                        role="switch"
                        aria-checked={coachingMode === "multi"}
                        className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                            coachingMode === "single" ? "bg-emerald-600" : "bg-indigo-600"
                        } ${switchingMode ? "opacity-50" : ""}`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                coachingMode === "multi" ? "translate-x-4 sm:translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </div>
                </div>

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
                                    href={route('admin.notices.index')}
                                    onClick={() => setNotifOpen(false)}
                                    className="p-2.5 text-center border-t border-slate-100 block text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    View All Notices
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
                <div className="flex items-center gap-2.5 cursor-pointer group hover:bg-slate-50 pr-2 pl-1 py-1 rounded-full transition-colors relative" onClick={() => setOpen(!open)} ref={dropdownRef}>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <img
                            src={auth?.user?.profile_picture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=cbf4c9&color=166534`}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="leading-tight hidden sm:block">
                        <p className="text-[12.5px] font-bold text-slate-800">{auth?.user?.name || "Admin"}</p>
                        <p className="text-[10.5px] text-slate-500 font-medium capitalize">
                            {auth?.user?.roles?.filter(r => !['user', 'student'].includes(r)).join(', ') || auth?.user?.user_type || 'User'}
                        </p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 hidden sm:block ml-1 group-hover:text-slate-600 transition-colors" />

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 top-12 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                            <Link href={route("admin.settings.index")} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                <Settings size={15} className="text-slate-400" /> Center Settings
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
