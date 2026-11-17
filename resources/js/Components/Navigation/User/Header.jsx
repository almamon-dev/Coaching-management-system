import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Menu, Settings, LogOut, Calendar, ChevronDown, User, ShieldCheck, AlignLeft
} from "lucide-react";
import SchoolLogo from "@/Components/SchoolLogo";

const TAB_TITLES = {
    overview: "Dashboard Overview",
    batches: "My Enrolled Batches",
    results: "Exams & Marksheet",
    routine: "Class Routine & Schedule",
    attendance: "Attendance Record",
    fees: "Fees & Payment Invoices",
    assignments: "Course Assignments",
    materials: "Study Materials & Notes",
    notices: "Notice Board",
};

export default function Header({ onMenuClick, onToggleSidebar, isCollapsed, activeTab = 'overview' }) {
    const { auth, settings } = usePage().props;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = auth?.user;
    const studentProfile = user?.student_profile;
    const studentId = studentProfile?.student_id || "CSM-2026";
    const centerName = settings?.center_name || "Coaching Management System";

    const currentTitle = TAB_TITLES[activeTab] || "Student Portal";

    const handleLogout = () => {
        router.post(route("logout"));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const todayDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <header className="h-[64px] bg-white sticky top-0 z-30 flex items-center px-4 md:px-6 border-b border-slate-200/80 justify-between select-none">
            {/* LEFT SIDE: Menu Toggle & Title */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-[3px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                >
                    <Menu size={18} />
                </button>

                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center">
                    <SchoolLogo variant="wide" className="h-[28px]" />
                </div>

                {/* Desktop Breadcrumb / View Title */}
                <div className="hidden lg:flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-slate-400">Portal /</span>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">{currentTitle}</h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200">
                        {centerName}
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Date & Profile Dropdown */}
            <div className="flex items-center gap-3">
                {/* Current Date Badge */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600">
                    <Calendar size={12} className="text-[#16a34a]" />
                    <span>{todayDate}</span>
                </div>

                {/* Profile Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 p-1 rounded-[3px] hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-[4px] bg-[#16a34a] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                            <p className="text-[10px] font-mono text-[#16a34a] leading-tight">{studentId}</p>
                        </div>
                        <ChevronDown size={13} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[4px] shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                            <div className="px-3.5 py-2 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                            </div>

                            <Link
                                href="/profile"
                                onClick={() => setOpen(false)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#16a34a] transition-colors"
                            >
                                <Settings size={14} />
                                <span>Account Settings</span>
                            </Link>

                            <div className="border-t border-slate-100 my-1" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
