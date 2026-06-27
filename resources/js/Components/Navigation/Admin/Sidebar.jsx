import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ChevronRight,
    ChevronsLeft,
    GraduationCap,
    Users,
    UserCheck,
    ShieldCheck,
    ClipboardCheck,
    BookOpen,
    Bell,
    FileText,
    Settings,
    LogOut,
    ShoppingCart
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| STATIC STRUCTURAL SCHEMA (Zero Memory Overhead)
|--------------------------------------------------------------------------
*/
const RAW_MENU_GROUPS = [
    {
        title: "",
        items: [
            {
                key: "academic",
                label: "Academic Management",
                icon: GraduationCap,
                children: [
                    { label: "Academic Years", getPath: () => route('admin.academic_sessions.index') },
                    { label: "Classes", getPath: () => route('admin.classes.index') },
                    { label: "Sections", getPath: () => route('admin.sections.index') },
                    { label: "Subjects", getPath: () => route('admin.subjects.index') },
                    { label: "Assign Subjects", getPath: () => route('admin.subject-allocation.index') },
                    { label: "Class Routine", getPath: () => route('admin.class_routines.index') },
                ],
            },
            {
                key: "students",
                label: "Student Management",
                icon: Users,
                children: [
                    { label: "Students", getPath: () => route('admin.students.index') },
                    { label: "New Admission", getPath: () => route('admin.students.create') },
                    { label: "Enrollments", getPath: () => '#' },
                    { label: "Student Promotion", getPath: () => '#' },
                    { label: "Roll Generation", getPath: () => '#' },
                    { label: "Student Transfer", getPath: () => '#' },
                ],
            },
            {
                key: "teachers",
                label: "Teacher Management",
                icon: UserCheck,
                children: [
                    { label: "Teachers", getPath: () => route('admin.teachers.index') },
                    { label: "Departments", getPath: () => route('admin.departments.index') },
                    { label: "Designations", getPath: () => route('admin.designations.index') },
                ],
            },
            {
                key: "guardians",
                label: "Guardian Management",
                icon: ShieldCheck,
                children: [
                    { label: "Guardians", getPath: () => '#' },
                ],
            },
            {
                key: "attendance",
                label: "Attendance Management",
                icon: ClipboardCheck,
                children: [
                    { label: "Student Attendance", getPath: () => route('admin.attendance.index') },
                    { label: "Teacher Attendance", getPath: () => '#' },
                    { label: "Daily Report", getPath: () => '#' },
                    { label: "Monthly Report", getPath: () => '#' },
                    { label: "Attendance Analytics", getPath: () => '#' },
                ],
            },
            {
                key: "examinations",
                label: "Examination Management",
                icon: BookOpen,
                children: [
                    { label: "Exams", getPath: () => '#' },
                    { label: "Marks Entry", getPath: () => '#' },
                    { label: "Grade Setup", getPath: () => '#' },
                    { label: "Result Generation", getPath: () => '#' },
                    { label: "Result Publish", getPath: () => '#' },
                ],
            },
            {
                key: "notice_board",
                label: "Notice Board",
                icon: Bell,
                children: [
                    { label: "Notices", getPath: () => '#' },
                    { label: "Announcements", getPath: () => '#' },
                ],
            },
            {
                key: "reports",
                label: "Reports",
                icon: FileText,
                children: [
                    { label: "Student Reports", getPath: () => '#' },
                    { label: "Attendance Reports", getPath: () => '#' },
                    { label: "Exam Reports", getPath: () => '#' },
                    { label: "Promotion Reports", getPath: () => '#' },
                    { label: "Export PDF/Excel", getPath: () => '#' },
                ],
            },
            {
                key: "settings",
                label: "Settings",
                icon: Settings,
                children: [
                    { label: "School Information", getPath: () => '#' },
                    { label: "User Roles", getPath: () => '#' },
                    { label: "Permissions", getPath: () => '#' },
                    { label: "SMS Settings", getPath: () => '#' },
                    { label: "Email Settings", getPath: () => '#' },
                    { label: "System Configuration", getPath: () => '#' },
                ],
            },
            {
                key: "logout",
                label: "Logout",
                icon: LogOut,
                getPath: () => "/logout",
                method: "post",
            },
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
    if (!targetPath) return false;
    const current = getRelativePath(currentPath);
    const target = getRelativePath(targetPath);
    if (current === target) return true;
    return current.startsWith(target + "/") && (/^\d+($|\/)/.test(current.substring(target.length + 1)) || current.substring(target.length + 1).startsWith('edit'));
};

/*
|--------------------------------------------------------------------------
| SUB-MENU ITEM COMPONENT (Inertia Prefetch + Zero Visual Effect)
|--------------------------------------------------------------------------
*/
const SubMenuItem = React.memo(({ child, currentPath }) => {
    const path = child.getPath();
    const childActive = checkPathActive(path, currentPath);

    return (
        <Link
            href={path}
            prefetch={["hover", "mount"]}
            showProgress={false}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12.5px] transition-all duration-150 group/sub
                ${childActive ? "text-[#008060] font-semibold bg-slate-50/50" : "text-slate-550 hover:text-[#008060] hover:bg-slate-50/30"}`}
        >
            <span className={`w-1 h-1 rounded-full transition-all duration-150 shrink-0 ${childActive ? "bg-[#008060] scale-125 shadow-[0_0_6px_#008060]" : "bg-slate-300 group-hover/sub:bg-[#008060]"
                }`} />
            <span>{child.label}</span>
        </Link>
    );
});

/*
|--------------------------------------------------------------------------
| NAV ITEM COMPONENT (Pure CSS Toggle + Zero JS Latency)
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
                    <input
                        type="checkbox"
                        defaultChecked={isChildActive}
                        className="peer hidden"
                    />

                    <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 group
                        peer-checked:[&_svg.chevron]:rotate-90 ${isChildActive ? "bg-[#f0f9f7] text-[#008060] font-semibold" : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        {Icon && (
                            <Icon
                                size={18}
                                strokeWidth={isChildActive ? 2.25 : 1.75}
                                className={`transition-colors duration-200 ${isChildActive ? "text-[#008060]" : "text-slate-400 group-hover:text-[#008060]"}`}
                            />
                        )}

                        {!isCollapsed && (
                            <>
                                <span className="text-[13px] font-medium truncate flex-1 tracking-tight">{item.label}</span>
                                <ChevronRight
                                    size={14}
                                    className="chevron transition-transform duration-150 text-slate-400 group-hover:text-[#008060]"
                                />
                            </>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                            <div className="overflow-hidden">
                                <div className="ml-5 space-y-0.5 mt-0.5">
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
            prefetch={item.method && item.method !== "get" ? undefined : ["hover", "mount"]}
            showProgress={false}
            method={item.method || "get"}
            as={item.method === "post" ? "button" : "a"}
            className="block w-full text-left focus:outline-none"
        >
            <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 group cursor-pointer
                ${isActive ? "bg-[#f0f9f7] text-[#008060] font-semibold" : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"}`}
            >
                {Icon && (
                    <Icon
                        size={18}
                        strokeWidth={isActive ? 2.25 : 1.75}
                        className={`transition-colors duration-200 ${isActive ? "text-[#008060]" : "text-slate-400 group-hover:text-[#008060]"}`}
                    />
                )}
                {!isCollapsed && (
                    <>
                        <span className="text-[13px] font-medium truncate flex-1 tracking-tight">{item.label}</span>
                        {item.key === "tickets" && openTicketsCount > 0 && (
                            <div className="px-1.5 min-w-[16px] h-4 rounded-full bg-[#008060] text-white text-[9px] flex items-center justify-center font-bold">{openTicketsCount}</div>
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

    const filteredMenuGroups = useMemo(() => {
        const processed = [];
        for (let g = 0; g < RAW_MENU_GROUPS.length; g++) {
            const group = RAW_MENU_GROUPS[g];
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
    }, [userRoles]);

    return (
        <div className="w-full h-full flex flex-col bg-white border-r border-slate-200/60 relative select-none">
            {/* BRANDING HEADER */}
            <div className="h-[60px] flex items-center px-4 shrink-0 bg-white border-b border-slate-200/60 overflow-hidden relative">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2 h-[45px]">
                        <div className="relative text-[#008060] bg-[#e6f2ef] p-1.5 rounded-lg">
                            <GraduationCap size={22} className="md:w-[22px] md:h-[22px]" strokeWidth={2} />
                        </div>
                        <span className="text-[18px] font-bold tracking-tight text-[#202223]">
                            School SMS
                        </span>
                    </Link>
                )}
            </div>

            {/* QUICK LINK: DASHBOARD */}
            <div className="p-2 shrink-0">
                <Link
                    href="/dashboard"
                    prefetch={["hover", "mount"]}
                    showProgress={false}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 group
                        ${currentPath === "/dashboard" ? "bg-[#f0f9f7] text-[#008060] font-bold" : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                    <LayoutDashboard size={18} className={currentPath === "/dashboard" ? "text-[#008060]" : "text-slate-400 group-hover:text-[#008060]"} />
                    {!isCollapsed && <span className="text-[13px] font-medium tracking-tight">Dashboard Overview</span>}
                </Link>
            </div>

            {/* MAIN NAVIGATION SCROLL AREA */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                {filteredMenuGroups.map((group) => (
                    <div key={group.title} className="mt-3.5">
                        {!isCollapsed && group.title && (
                            <div className="px-5 mb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{group.title}</span>
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
            </div>

        </div>
    );
}