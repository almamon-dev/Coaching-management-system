import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import SchoolLogo from "@/Components/SchoolLogo";
import {
    LayoutDashboard,
    ChevronRight,
    GraduationCap,
    Users,
    UserCheck,
    ClipboardCheck,
    BookOpen,
    Bell,
    FileText,
    Settings,
    LogOut,
    Wallet,
    FileCode,
    Shield,
    DollarSign,
} from "lucide-react";

export default function Sidebar({ isCollapsed }) {
    const { url, props } = usePage();
    const coachingMode = props?.settings?.coaching_mode || "single";
    const centerName = props?.settings?.center_name || "Ullash Coaching Center";
    const currentPath = url.split("?")[0];

    const getCleanPath = (fullUrlOrPath) => {
        if (!fullUrlOrPath) return "";
        try {
            return fullUrlOrPath.startsWith("http") ? new URL(fullUrlOrPath).pathname : fullUrlOrPath;
        } catch (e) {
            return fullUrlOrPath;
        }
    };

    const checkActiveItem = (item) => {
        if (item.route && typeof route !== "undefined") {
            try {
                if (route().current(item.route)) return true;
            } catch (e) { }
        }
        if (item.path) {
            const clean = getCleanPath(item.path);
            if (currentPath === clean || currentPath.startsWith(clean + '/')) return true;
        }
        if (item.children) {
            return item.children.some(child => checkActiveItem(child));
        }
        return false;
    };

    const [openMenus, setOpenMenus] = useState(() => {
        const initial = {};
        if (currentPath.includes('/admin/courses') || currentPath.includes('/admin/batches') || currentPath.includes('/admin/class-routines')) {
            initial.course_routine = true;
        }
        if (currentPath.includes('/admin/exams') || currentPath.includes('/admin/assignments') || currentPath.includes('/admin/study-materials')) {
            initial.academic_content = true;
        }
        if (currentPath.includes('/admin/permissions') || currentPath.includes('/admin/activity-logs')) {
            initial.security_logs = true;
        }
        if (currentPath.includes('/admin/settings') || currentPath.includes('/admin/backup')) {
            initial.system_config = true;
        }
        return initial;
    });

    const menuGroups = [
        {
            title: "MAIN",
            items: [
                {
                    label: "Dashboard",
                    path: route('admin.dashboard'),
                    icon: <LayoutDashboard size={18} />,
                    route: "admin.dashboard"
                },
                {
                    label: "Academic Setup",
                    icon: <BookOpen />,
                    key: "course_routine",
                    children: [
                        { label: "Subject Management", path: route('admin.courses.index'), route: "admin.courses.index" },
                        { label: "Batch Management", path: route('admin.batches.index'), route: "admin.batches.index" },
                        { label: "Class Routine", path: route('admin.class-routines.index'), route: "admin.class-routines.index" },
                    ]
                },
                ...(coachingMode === "multi"
                    ? [
                        {
                            label: "Teacher Management",
                            path: route('admin.teachers.index'),
                            icon: <UserCheck />,
                            route: "admin.teachers.index"
                        }
                    ]
                    : []),
                {
                    label: "New Admission",
                    path: route('admin.admissions.create'),
                    icon: <GraduationCap />,
                    route: "admin.admissions.create"
                },
                {
                    label: "Student Management",
                    path: route('admin.students.index'),
                    icon: <Users />,
                    route: "admin.students.index"
                },
                {
                    label: "Student Attendance",
                    path: route('admin.attendance.index'),
                    icon: <ClipboardCheck />,
                    route: "admin.attendance.index"
                },
                {
                    label: "Academic Content",
                    icon: <FileCode />,
                    key: "academic_content",
                    children: [
                        { label: "Exams & Results", path: route('admin.exams.index'), route: "admin.exams.index" },
                        { label: "Assignments & Homework", path: route('admin.assignments.index'), route: "admin.assignments.index" },
                        { label: "Study Materials", path: route('admin.study-materials.index'), route: "admin.study-materials.index" },
                    ]
                },
                {
                    label: "Fee Collection & Dues",
                    path: route('admin.fees.index'),
                    icon: <Wallet />,
                    route: "admin.fees.index"
                },
                {
                    label: "Income & Expense",
                    path: route('admin.operational-accounts.index'),
                    icon: <DollarSign />,
                    route: "admin.operational-accounts.index"
                },
                {
                    label: "Notice Board",
                    path: route('admin.notices.index'),
                    icon: <Bell />,
                    route: "admin.notices.index"
                },
                {
                    label: "Reports & Analytics",
                    path: route('admin.reports.index'),
                    icon: <FileText />,
                    route: "admin.reports.index"
                },
            ]
        },
        {
            title: "SETTINGS",
            items: [
                ...(coachingMode === "multi"
                    ? [
                        {
                            label: "Security & Access",
                            icon: <Shield />,
                            key: "security_logs",
                            children: [
                                { label: "Role Permissions", path: route('admin.permissions.index'), route: "admin.permissions.index" },
                                { label: "Activity Logs", path: route('admin.activity-logs.index'), route: "admin.activity-logs.index" },
                            ]
                        }
                    ]
                    : []),
                {
                    label: "System Configuration",
                    icon: <Settings />,
                    key: "system_config",
                    children: [
                        { label: "General Settings", path: route('admin.settings.index'), route: "admin.settings.index" },
                        { label: "Database Backup", path: route('admin.backup.index'), route: "admin.backup.index" },
                    ]
                },
                {
                    label: "Logout",
                    path: "/logout",
                    icon: <LogOut />,
                    method: "post",
                }
            ]
        }
    ];

    const renderMenuItem = (item) => {
        const active = checkActiveItem(item);
        const isOpen = openMenus[item.key];

        const content = (
            <>
                <div className={`flex-shrink-0 ${isCollapsed ? 'mb-1' : 'mr-3'} transition-transform duration-200 group-hover:scale-105 ${active || isOpen ? 'text-[#16a34a]' : 'text-slate-400 group-hover:text-[#16a34a]'}`}>
                    {React.cloneElement(item.icon, {
                        size: isCollapsed ? 22 : 18,
                        strokeWidth: active || isOpen ? 2 : 1.5
                    })}
                </div>

                {!isCollapsed && (
                    <span className={`font-semibold leading-tight transition-all duration-200 text-[13px] flex-1 text-left whitespace-nowrap truncate ${active || isOpen ? 'text-[#16a34a]' : 'text-slate-600'}`}>
                        {item.label}
                    </span>
                )}

                {!isCollapsed && item.children && (
                    <ChevronRight
                        size={14}
                        className={`flex-shrink-0 transition-all duration-200 text-slate-300 group-hover:text-slate-500 ${isOpen ? 'rotate-90 text-[#16a34a]' : ''}`}
                    />
                )}

                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                        {item.label}
                    </div>
                )}
            </>
        );

        if (item.children) {
            return (
                <div key={item.key || item.label}>
                    <button
                        type="button"
                        onClick={() => setOpenMenus(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`w-full flex transition-all duration-200 group relative rounded-[3px] cursor-pointer
                            ${isCollapsed
                                ? 'flex-col items-center justify-center py-2.5 px-1'
                                : 'flex-row items-center py-2 px-3'}
                            ${active || isOpen
                                ? 'bg-[#16a34a]/10 text-[#16a34a]'
                                : 'text-[#475467] hover:bg-[#16a34a]/5 hover:text-[#16a34a]'}`}
                    >
                        {content}
                    </button>

                    {!isCollapsed && isOpen && (
                        <div className="ml-6 mt-1 space-y-0.5 relative pl-3">
                            {item.children.map((child, index) => {
                                const isLast = index === item.children.length - 1;
                                const isChildActive = checkActiveItem(child);

                                return (
                                    <div key={child.label} className="relative flex items-center group">
                                        <div className="absolute -left-3.5 top-0 bottom-0 w-3.5 flex items-center justify-center pointer-events-none">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 16 32">
                                                <line
                                                    x1="6" y1="0" x2="6" y2="16"
                                                    className={isChildActive ? "text-[#16a34a]" : "text-slate-300"}
                                                    stroke="currentColor" strokeWidth="1.5"
                                                />
                                                {!isLast && (
                                                    <line
                                                        x1="6" y1="16" x2="6" y2="32"
                                                        className="text-slate-300"
                                                        stroke="currentColor" strokeWidth="1.5"
                                                    />
                                                )}
                                                <line
                                                    x1="6" y1="16" x2="16" y2="16"
                                                    className={isChildActive ? "text-[#16a34a]" : "text-slate-300"}
                                                    stroke="currentColor" strokeWidth="1.5"
                                                />
                                            </svg>
                                        </div>

                                        <Link
                                            href={child.path}
                                            className={`flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[12.5px] transition-all relative rounded ${isChildActive
                                                ? "text-[#16a34a] font-bold"
                                                : "text-[#475467] hover:text-[#16a34a] font-medium"
                                                }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isChildActive
                                                ? "bg-[#16a34a] shadow-sm shadow-[#16a34a]/50 ring-2 ring-[#16a34a]/20"
                                                : "bg-slate-300 group-hover:bg-[#16a34a]"
                                                }`} />
                                            <span className="truncate">{child.label}</span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        if (item.method === "post") {
            return (
                <Link
                    key={item.label}
                    href={item.path}
                    method="post"
                    as="button"
                    className={`w-full flex transition-all duration-200 group relative rounded-[3px] cursor-pointer
                        ${isCollapsed
                            ? 'flex-col items-center justify-center py-2.5 px-1'
                            : 'flex-row items-center py-2 px-3'}
                        ${active
                            ? 'bg-[#16a34a]/10 text-[#16a34a]'
                            : 'text-[#475467] hover:bg-[#16a34a]/5 hover:text-[#16a34a]'}`}
                >
                    {content}
                </Link>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.path}
                className={`w-full flex transition-all duration-200 group relative rounded-[3px]
                    ${isCollapsed
                        ? 'flex-col items-center justify-center py-2.5 px-1'
                        : 'flex-row items-center py-2 px-3'}
                    ${active
                        ? 'bg-[#16a34a]/10 text-[#16a34a]'
                        : 'text-[#475467] hover:bg-[#16a34a]/5 hover:text-[#16a34a]'}`}
            >
                {content}
            </Link>
        );
    };

    return (
        <aside className="bg-white min-h-screen transition-all duration-300 shrink-0 flex flex-col w-full select-none">
            {/* BRANDING HEADER */}
            <div className={`h-[64px] flex items-center border-b border-slate-100 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                <Link href="/admin/dashboard" className="flex flex-col items-start gap-0.5 min-w-0">
                    {isCollapsed ? (
                        <SchoolLogo variant="sidebar-icon" />
                    ) : (
                        <>
                            <SchoolLogo variant="sidebar" />
                        </>
                    )}
                </Link>
            </div>

            {/* NAVIGATION SCROLL AREA */}
            <div className="p-3 space-y-5 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        {!isCollapsed && <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{group.title}</p>}
                        <div className="space-y-1">
                            {group.items.map(renderMenuItem)}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
