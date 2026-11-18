import React, { useMemo, useState } from "react";
import SchoolLogo from "@/Components/SchoolLogo";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ChevronsLeft,
    Settings,
    LogOut,
    Calendar,
    ClipboardCheck,
    Bell,
    Layers,
    Award,
    Wallet,
    BookMarked,
    FileCode,
    User,
    ChevronRight,
    ChevronDown,
    MessageSquare,
    Library,
    BarChart2
} from "lucide-react";

const getCleanPath = (url) => {
    try {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const parsed = new URL(url);
            return parsed.pathname;
        }
        return url.split('?')[0];
    } catch (e) {
        return url ? url.split('?')[0] : '';
    }
};

const safeRoute = (name, params, fallback = '#') => {
    try {
        if (typeof route === 'function') {
            return route(name, params);
        }
    } catch (e) {
        // Fallback gracefully if route does not exist
    }
    return fallback;
};

/*
|--------------------------------------------------------------------------
| TEACHER MENU (FOR TEACHER PORTAL)
|--------------------------------------------------------------------------
*/
const TEACHER_MENU = [
    {
        title: "ACADEMICS",
        items: [
            { key: "attendance", label: "Attendance", icon: ClipboardCheck, getPath: () => safeRoute('teacher.mark-attendance', undefined, '/teacher/attendance') },
            {
                key: "examinations",
                label: "Examinations",
                icon: Award,
                children: [
                    { label: "Marks Entry", getPath: () => safeRoute('teacher.marks.entry', undefined, '/teacher/exams/marks') },
                    { label: "Results Generate", getPath: () => safeRoute('teacher.results.generation', undefined, '/teacher/results/generation') },
                    { label: "Results Publish", getPath: () => safeRoute('teacher.results.publishIndex', undefined, '/teacher/results/publish') },
                ]
            },
            { key: "assignments", label: "Assignments", icon: BookMarked, getPath: () => safeRoute('teacher.assignments.index', undefined, '/teacher/assignments') },
            { key: "events", label: "Events", icon: Calendar, getPath: () => safeRoute('teacher.events.index', undefined, '/teacher/events') },
            { key: "routine", label: "Class Routine", icon: Calendar, getPath: () => safeRoute('teacher.routine.index', undefined, '/teacher/routine') },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            { key: "profile", label: "Settings", icon: Settings, getPath: () => safeRoute('profile.edit', undefined, '/profile') },
            { key: "logout", label: "Logout", icon: LogOut, getPath: () => "/logout", method: "post" },
        ]
    }
];

/*
|--------------------------------------------------------------------------
| STUDENT MENU (FOR STUDENT PORTAL)
|--------------------------------------------------------------------------
*/
const STUDENT_MENU = [
    {
        title: "ACADEMICS",
        items: [
            { key: "overview", label: "Dashboard", icon: LayoutDashboard },
            { key: "batches", label: "My Batches", icon: Layers },
            { key: "results", label: "Exams & Results", icon: Award },
            { key: "routine", label: "Class Routine", icon: Calendar },
            { key: "attendance", label: "My Attendance", icon: ClipboardCheck },
            { key: "fees", label: "Fees & Dues", icon: Wallet },
            { key: "assignments", label: "Assignments", icon: BookMarked },
            { key: "materials", label: "Study Materials", icon: FileCode },
            { key: "notices", label: "Notice Board", icon: Bell },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            { key: "profile", label: "My Profile", icon: Settings, getPath: () => safeRoute('profile.edit', undefined, '/profile') },
            { key: "logout", label: "Sign Out", icon: LogOut, getPath: () => "/logout", method: "post" },
        ],
    },
];

export default function Sidebar({ isCollapsed, toggleCollapse, activeTab = 'overview', onTabChange }) {
    const { url, props } = usePage();
    const currentPath = useMemo(() => getCleanPath(url), [url]);
    const [openMenus, setOpenMenus] = useState({});

    const authUser = props.auth?.user;
    const studentProfile = authUser?.student_profile;
    const isStaff = authUser?.user_type === 'staff' || authUser?.user_type === 'teacher';

    const studentName = authUser?.name || "Student";
    const studentId = studentProfile?.student_id || "UCCA-STUDENT";
    const courseTitle = studentProfile?.course?.title || studentProfile?.batch?.name || "Student Portal";

    const menuGroups = isStaff ? TEACHER_MENU : STUDENT_MENU;

    const handleItemClick = (item) => {
        if (item.method === 'post' || item.getPath) return;
        if (onTabChange) {
            onTabChange(item.key);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white border-r border-slate-200/80 relative select-none">
            {/* BRANDING HEADER */}
            <div className="h-[64px] flex items-center px-4 shrink-0 bg-white border-b border-slate-200/80 overflow-hidden relative">
                {!isCollapsed ? (
                    <Link href="/" className="flex items-center px-1 h-[64px]">
                        <SchoolLogo variant="wide" className="h-[36px]" />
                    </Link>
                ) : (
                    <Link href="/" className="flex items-center justify-center w-full h-[64px]">
                        <SchoolLogo variant="icon" className="h-[32px] w-[32px]" />
                    </Link>
                )}
            </div>

            {/* MINI PROFILE CARD (STUDENT INFO) */}
            {!isStaff && (
                <div className="px-3 pt-3 shrink-0">
                    {!isCollapsed ? (
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-[4px] flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-[4px] bg-[#16a34a] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                                {studentName.charAt(0) || 'S'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{studentName}</p>
                                <p className="text-[10.5px] font-mono font-semibold text-[#16a34a] truncate mt-0.5">{studentId}</p>
                                <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{courseTitle}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center py-1">
                            <div 
                                className="w-8 h-8 rounded-[4px] bg-[#16a34a] text-white font-bold flex items-center justify-center text-xs shadow-2xs"
                                title={`${studentName} (${studentId})`}
                            >
                                {studentName.charAt(0) || 'S'}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MAIN NAVIGATION SCROLL AREA */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col">
                {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} className={gIdx > 0 ? "mt-4 pt-3 border-t border-slate-100" : ""}>
                        {!isCollapsed && group.title && (
                            <div className="px-4 mb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.title}</span>
                            </div>
                        )}

                        <div className="space-y-1 px-2.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isPost = item.method === "post";
                                const hasCustomPath = !!item.getPath;

                                const itemCleanPath = item.getPath ? getCleanPath(item.getPath()) : '';

                                // Check if this item is currently active
                                const isActive = !isStaff
                                    ? (item.getPath
                                        ? currentPath === itemCleanPath
                                        : (activeTab === item.key && (currentPath === "/user/dashboard" || currentPath === "/dashboard" || currentPath.includes("dashboard"))))
                                    : (item.getPath
                                        ? (currentPath === itemCleanPath || (itemCleanPath !== '/' && currentPath.startsWith(itemCleanPath + '/')))
                                        : false);

                                const buttonContent = (
                                    <div
                                        className={`flex items-center gap-3 px-3 py-2 rounded-[3px] text-xs transition-all duration-150 group cursor-pointer relative ${
                                            isActive
                                                ? "bg-[#16a34a]/10 text-[#16a34a] font-bold"
                                                : "text-slate-600 hover:bg-[#16a34a]/5 hover:text-[#16a34a] font-medium"
                                        }`}
                                    >
                                        {/* Active bar on left */}
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#16a34a] rounded-r-full" />
                                        )}

                                        {Icon && (
                                            <Icon
                                                size={16}
                                                className={`shrink-0 transition-transform group-hover:scale-105 ${
                                                    isActive ? "text-[#16a34a]" : "text-slate-400 group-hover:text-[#16a34a]"
                                                }`}
                                            />
                                        )}

                                        {!isCollapsed && (
                                            <span className="truncate flex-1 tracking-tight text-[12.5px]">{item.label}</span>
                                        )}

                                        {/* Collapsed Tooltip */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                                                {item.label}
                                            </div>
                                        )}
                                    </div>
                                );

                                // Nested Children (Dropdown)
                                if (item.children && item.children.length > 0) {
                                    const isChildActive = item.children.some(child => {
                                        const p = child.getPath ? getCleanPath(child.getPath()) : '';
                                        return currentPath === p || (p !== '/' && currentPath.startsWith(p + '/'));
                                    });
                                    const isOpen = openMenus[item.key] ?? isChildActive;

                                    return (
                                        <div key={item.key} className="space-y-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setOpenMenus(prev => ({ ...prev, [item.key]: !isOpen }))}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] text-xs transition-all duration-150 group cursor-pointer ${
                                                    isChildActive
                                                        ? "bg-[#16a34a]/10 text-[#16a34a] font-bold"
                                                        : isOpen
                                                            ? "text-slate-900 bg-slate-50 font-semibold"
                                                            : "text-slate-600 hover:bg-[#16a34a]/5 hover:text-[#16a34a] font-medium"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {Icon && (
                                                        <Icon
                                                            size={16}
                                                            className={`shrink-0 transition-transform group-hover:scale-105 ${
                                                                isChildActive ? "text-[#16a34a]" : "text-slate-400 group-hover:text-[#16a34a]"
                                                            }`}
                                                        />
                                                    )}
                                                    {!isCollapsed && (
                                                        <span className="truncate flex-1 tracking-tight text-[12.5px]">{item.label}</span>
                                                    )}
                                                </div>
                                                {!isCollapsed && (
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-slate-600" : "text-slate-400"}`}
                                                    />
                                                )}
                                            </button>

                                            {/* Sub-items */}
                                            {isOpen && !isCollapsed && (
                                                <div className="pl-7 pr-1 py-1 space-y-0.5">
                                                    {item.children.map((child, cIdx) => {
                                                        const childPath = child.getPath ? child.getPath() : '#';
                                                        const childClean = getCleanPath(childPath);
                                                        const isSubActive = currentPath === childClean || (childClean !== '/' && currentPath.startsWith(childClean + '/'));
                                                        return (
                                                            <Link
                                                                key={cIdx}
                                                                href={childPath}
                                                                className={`block px-3 py-1.5 rounded-[3px] text-[11.5px] transition-colors ${
                                                                    isSubActive
                                                                        ? "text-[#16a34a] font-bold bg-[#16a34a]/10"
                                                                        : "text-slate-500 hover:text-[#16a34a] hover:bg-slate-50 font-medium"
                                                                }`}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                // Logout Button (POST)
                                if (isPost) {
                                    return (
                                        <Link
                                            key={item.key}
                                            href={item.getPath()}
                                            method="post"
                                            as="button"
                                            className="w-full text-left focus:outline-none"
                                        >
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-[3px] text-xs text-rose-600 hover:bg-rose-50 font-medium transition-all cursor-pointer group relative">
                                                {Icon && <Icon size={16} className="text-rose-500 shrink-0" />}
                                                {!isCollapsed && <span className="truncate text-[12.5px] font-semibold">{item.label}</span>}
                                                {isCollapsed && (
                                                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                                                        {item.label}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                }

                                // External Link (Profile / Custom Path)
                                if (hasCustomPath) {
                                    return (
                                        <Link
                                            key={item.key}
                                            href={item.getPath()}
                                            className="block w-full focus:outline-none"
                                        >
                                            {buttonContent}
                                        </Link>
                                    );
                                }

                                // In-Dashboard Tab Switcher
                                if (onTabChange) {
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => handleItemClick(item)}
                                            className="w-full text-left focus:outline-none"
                                        >
                                            {buttonContent}
                                        </button>
                                    );
                                }

                                // Fallback Link with query parameter
                                return (
                                    <Link
                                        key={item.key}
                                        href={route('user.dashboard', { tab: item.key })}
                                        className="block w-full focus:outline-none"
                                    >
                                        {buttonContent}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* COLLAPSE / EXPAND TOGGLE BUTTON */}
            <button
                type="button"
                onClick={toggleCollapse}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute top-5 -right-3.5 z-50 w-7 h-7 bg-white border border-slate-200/90 rounded-full flex items-center justify-center text-slate-400 hover:text-[#16a34a] hover:border-emerald-300 transition-all shadow-2xs focus:outline-none cursor-pointer"
            >
                <ChevronsLeft size={14} className={isCollapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
        </div>
    );
}
