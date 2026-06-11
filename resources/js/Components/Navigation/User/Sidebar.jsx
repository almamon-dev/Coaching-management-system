import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ChevronRight,
    ChevronsLeft,
    Settings,
    LogOut,
    Calendar,
    ClipboardCheck,
    Bell,
    GraduationCap,
    Clock,
    FileText,
    KeyRound,
    BookOpen,
    Users,
    Award,
    Wallet,
    MessageSquare,
    Library,
    BarChart2,
    UserCheck,
    UserPlus
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| STATIC STRUCTURAL SCHEMA (Zero Memory Overhead)
|--------------------------------------------------------------------------
*/
const TEACHER_MENU = [
    {
        title: "",
        items: [
            { key: "students", label: "Students", icon: Users, getPath: () => '#' },
            { key: "teachers", label: "Teachers", icon: GraduationCap, getPath: () => '#' },
            { key: "attendance", label: "Attendance", icon: ClipboardCheck, getPath: () => route('user.mark-attendance') },
            { key: "examinations", label: "Examinations", icon: FileText, getPath: () => '#' },
            { key: "results", label: "Results", icon: Award, getPath: () => '#' },
            { key: "assignments", label: "Assignments", icon: BookOpen, getPath: () => '#' },
            { key: "fees", label: "Fees & Payments", icon: Wallet, getPath: () => '#' },
            { key: "notices", label: "Notices", icon: Bell, getPath: () => '#' },
            { key: "messages", label: "Messages", icon: MessageSquare, getPath: () => '#' },
            { key: "events", label: "Events", icon: Calendar, getPath: () => '#' },
            { key: "library", label: "Library", icon: Library, getPath: () => '#' },
            { key: "reports", label: "Reports", icon: BarChart2, getPath: () => '#' },
            { key: "settings", label: "Settings", icon: Settings, getPath: () => '#' },
        ],
    },
];

const STUDENT_MENU = [
    {
        title: "",
        items: [
            {
                key: "attendance",
                label: "Attendance",
                icon: ClipboardCheck,
                children: [
                    { label: "Attendance History", getPath: () => '#' },
                    { label: "Attendance Summary", getPath: () => '#' },
                ],
            },
            {
                key: "results",
                label: "Results",
                icon: FileText,
                children: [
                    { label: "Exam Results", getPath: () => '#' },
                    { label: "GPA History", getPath: () => '#' },
                    { label: "Academic History", getPath: () => '#' },
                ],
            },
            { key: "notices", label: "Notices", icon: Bell, getPath: () => '#' },
            { key: "profile", label: "My Profile", icon: Settings, getPath: () => '#' },
            { key: "settings", label: "Settings", icon: KeyRound, getPath: () => '#' },
            { key: "logout", label: "Logout", icon: LogOut, getPath: () => "/logout", method: "post" },
        ],
    },
];

const GUARDIAN_MENU = [
    {
        title: "",
        items: [
            { key: "my_child", label: "My Child", icon: GraduationCap, getPath: () => '#' },
            { key: "attendance", label: "Attendance", icon: ClipboardCheck, getPath: () => '#' },
            { key: "results", label: "Results", icon: FileText, getPath: () => '#' },
            { key: "notices", label: "Notices", icon: Bell, getPath: () => '#' },
            { key: "profile", label: "Profile", icon: Settings, getPath: () => '#' },
            { key: "logout", label: "Logout", icon: LogOut, getPath: () => "/logout", method: "post" },
        ],
    },
];

/*
|--------------------------------------------------------------------------
| BITWISE FASTEST PATH MATCHER
|--------------------------------------------------------------------------
*/
const getRelativePath = (urlStr) => {
    if (!urlStr) return "";
    const cleanUrl = urlStr.charCodeAt(0) === 104
        ? "/" + urlStr.split(/\/+/).slice(2).join("/")
        : urlStr;
    return cleanUrl.split("?")[0].replace(/\/$/, "");
};

const checkPathActive = (targetPath, currentPath) => {
    if (!targetPath || targetPath === '#') return false;
    const current = getRelativePath(currentPath);
    const target = getRelativePath(targetPath);
    if (current === target) return true;
    return current.startsWith(target + "/") && (/^\d+($|\/)/.test(current.substring(target.length + 1)) || current.substring(target.length + 1).startsWith('edit'));
};

/*
|--------------------------------------------------------------------------
| SUB-MENU ITEM COMPONENT
|--------------------------------------------------------------------------
*/
const SubMenuItem = React.memo(({ child, currentPath }) => {
    const path = child.getPath();
    const childActive = checkPathActive(path, currentPath);

    return (
        <Link
            href={path}
            prefetch={path !== '#' ? ["hover", "mount"] : undefined}
            showProgress={false}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 group/sub
                ${childActive ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-blue-600 hover:bg-slate-50/50"}`}
        >
            <span className={`w-1 h-1 rounded-full transition-all duration-150 shrink-0 ${childActive ? "bg-blue-600 scale-125" : "bg-slate-300 group-hover/sub:bg-blue-600"
                }`} />
            <span>{child.label}</span>
        </Link>
    );
});

/*
|--------------------------------------------------------------------------
| NAV ITEM COMPONENT
|--------------------------------------------------------------------------
*/
const NavItem = React.memo(({ item, isCollapsed, currentPath, openTicketsCount }) => {
    const hasChildren = !!item.children;

    const isActive = !hasChildren && checkPathActive(item.getPath(), currentPath);
    const isChildActive = useMemo(() => {
        if (!hasChildren) return false;
        for (let i = 0; i < item.children.length; i++) {
            if (checkPathActive(item.children[i].getPath(), currentPath)) return true;
        }
        return false;
    }, [hasChildren, item.children, currentPath]);

    const Icon = item.icon;

    if (hasChildren) {
        return (
            <div className="space-y-0.5">
                <label className="block w-full cursor-pointer select-none">
                    <input type="checkbox" defaultChecked={isChildActive} className="peer hidden" />

                    <div className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all duration-150 group
                        peer-checked:[&_svg.chevron]:rotate-90 ${isChildActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}
                    >
                        {Icon && (
                            <Icon size={15} strokeWidth={isChildActive ? 2 : 1.75} className={`transition-all duration-200 group-hover:scale-105 ${isChildActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"}`} />
                        )}

                        {!isCollapsed && (
                            <>
                                <span className="text-[11.5px] truncate flex-1 tracking-tight">{item.label}</span>
                                <ChevronRight size={13} className="chevron transition-transform duration-150 text-slate-400 group-hover:text-blue-600" />
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="ml-5 space-y-0.5 mt-0.5 border-l-2 border-slate-100 pl-1 py-1">
                                    {item.children.map((child) => (
                                        <SubMenuItem key={child.label} child={child} currentPath={currentPath} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </label>
            </div>
        );
    }

    const itemPath = item.getPath();
    return (
        <Link
            href={itemPath}
            prefetch={item.method && item.method !== "get" ? undefined : (itemPath !== '#' ? ["hover", "mount"] : undefined)}
            showProgress={false}
            method={item.method || "get"}
            as={item.method === "post" ? "button" : "a"}
            className="block w-full text-left focus:outline-none"
        >
            <div className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all duration-150 group cursor-pointer
                ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}
            >
                {Icon && (
                    <Icon size={15} strokeWidth={isActive ? 2 : 1.75} className={`transition-all duration-200 group-hover:scale-105 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"}`} />
                )}
                {!isCollapsed && (
                    <>
                        <span className="text-[11.5px] truncate flex-1 tracking-tight">{item.label}</span>
                        {item.key === "notices" && (
                            <div className="px-1.5 min-w-[16px] h-3.5 rounded text-blue-600 border border-blue-200 bg-blue-50 text-[9px] flex items-center justify-center font-bold">5</div>
                        )}
                    </>
                )}
            </div>
        </Link>
    );
});

/*
|--------------------------------------------------------------------------
| MAIN SIDEBAR COMPONENT
|--------------------------------------------------------------------------
*/
export default function Sidebar({ isCollapsed, toggleCollapse }) {
    const { url, props } = usePage();
    const currentPath = useMemo(() => url.split("?")[0], [url]);

    const userRoles = useMemo(() => props.auth?.user?.roles || [], [props.auth?.user?.roles]);
    const openTicketsCount = props.auth?.user?.open_tickets_count || 0;
    const isTeacher = props.auth?.user?.user_type === 'teacher' || userRoles.includes('teacher');

    const filteredMenuGroups = useMemo(() => {
        let menuGroupsToUse = TEACHER_MENU; // Force the detailed menu by default so you can see it!

        const processed = [];
        for (let g = 0; g < menuGroupsToUse.length; g++) {
            const group = menuGroupsToUse[g];
            const allowedItems = [];
            for (let i = 0; i < group.items.length; i++) {
                const item = group.items[i];
                if (!item.roles || item.roles.some(r => userRoles.includes(r))) {
                    allowedItems.push(item);
                }
            }
            if (allowedItems.length > 0) processed.push({ ...group, items: allowedItems });
        }
        return processed;
    }, [userRoles, props.auth?.user]);

    return (
        <div className="w-full h-full flex flex-col bg-white border-r border-slate-200/60 relative select-none">
            {/* BRANDING HEADER */}
            <div className="h-[70px] flex items-center px-4 shrink-0 bg-white border-b border-slate-100 overflow-hidden relative">
                {!isCollapsed && (
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-sm shrink-0">
                            <GraduationCap size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-black tracking-tight text-slate-800 leading-tight">
                                Lohadi High
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400">School Management System</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* MAIN NAVIGATION SCROLL AREA */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 flex flex-col">
                
                {/* QUICK LINK: DASHBOARD */}
                <div className="p-2 pb-0 shrink-0">
                    <Link
                        href={route('user.dashboard')}
                        prefetch={["hover", "mount"]}
                        showProgress={false}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all duration-150 group
                            ${currentPath === "/user/dashboard" ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}
                    >
                        <LayoutDashboard size={15} className={currentPath === "/user/dashboard" ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"} />
                        {!isCollapsed && <span className="text-[11.5px] tracking-tight">Dashboard</span>}
                    </Link>
                </div>

                {filteredMenuGroups.map((group, idx) => (
                    <div key={idx} className="mt-2 flex-1">
                        {!isCollapsed && group.title && (
                            <div className="px-5 mb-1 mt-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{group.title}</span>
                            </div>
                        )}
                        <div className="space-y-0.5 px-2">
                            {group.items.map((item) => (
                                <NavItem
                                    key={item.key}
                                    item={item}
                                    isCollapsed={isCollapsed}
                                    openTicketsCount={openTicketsCount}
                                    currentPath={currentPath}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* QUICK ACTIONS BLOCK */}
                {!isCollapsed && (
                    <div className="mt-4 px-3 shrink-0">
                        <h3 className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider mb-2 pl-2">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <UserCheck size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-emerald-700 text-left">Mark<br/>Attendance</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-blue-700 text-left">Enter<br/>Marks</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <Bell size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-amber-700 text-left">Add<br/>Notice</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <BookOpen size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-purple-700 text-left">Add<br/>Assignment</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                    <UserPlus size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-cyan-700 text-left">Admit<br/>Student</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <Wallet size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-red-700 text-left">Collect<br/>Fees</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group">
                                <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <FileText size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-indigo-700 text-left">Generate<br/>Report</span>
                            </button>
                            <button className="flex items-center gap-1.5 p-1.5 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition-colors group">
                                <div className="w-5 h-5 rounded bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                    <Users size={10} />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-600 leading-tight group-hover:text-slate-800 text-left">Manage<br/>Staff</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* TRIGGER COLLAPSE */}
            <button
                onClick={toggleCollapse}
                className="absolute top-5 -right-3.5 z-[110] w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm focus:outline-none"
            >
                <ChevronsLeft size={14} className={isCollapsed ? 'rotate-180' : ''} />
            </button>
        </div>
    );
}
