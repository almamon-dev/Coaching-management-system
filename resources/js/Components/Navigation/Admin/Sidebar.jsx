import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ChevronRight,
    ChevronsLeft,
    Settings,
    LogOut,
    Boxes,
    Package,
    Store,
    Sparkles,
    BadgePercent,
    KeyRound,
    Headset,
    Nut,
    Truck,
    FileText
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| STATIC STRUCTURAL SCHEMA (Zero Memory Overhead)
|--------------------------------------------------------------------------
*/
const RAW_MENU_GROUPS = [
    {
        title: "MAIN",
        items: [
            {
                key: "inventory",
                label: "Inventory",
                icon: Package,
                roles: ["Super Admin", "Inventory Manager", "Customer Support"],
                children: [
                    { label: "All Products", getPath: () => route('admin.products.index') },
                    { label: "Add Product", getPath: () => route('admin.products.create') },
                    { label: "Questions", getPath: () => route('admin.questions.index') },
                    { label: "Reviews", getPath: () => route('admin.reviews.index') },
                ],
            },
            {
                key: "catalog",
                label: "Catalog",
                icon: Boxes,
                roles: ["Super Admin", "Inventory Manager"],
                children: [
                    { label: "Categories", getPath: () => route('admin.categories.index') },
                    { label: "Variants", getPath: () => route('admin.variants.index') },
                    { label: "Brands", getPath: () => route('admin.brands.index') },
                ],
            },
            {
                key: "sales",
                label: "Sales",
                icon: BadgePercent,
                roles: ["Super Admin", "Sales Agent"],
                children: [
                    { label: "Orders", getPath: () => route('admin.orders.index') },
                    { label: "Transactions", getPath: () => route('admin.transactions.index') },
                    { label: "Returns", getPath: () => route('admin.logistics.returns.index') },
                ],
            },
            {
                key: "tickets",
                label: "Support Tickets",
                icon: Headset,
                getPath: () => route('admin.tickets.index'),
                roles: ["Super Admin", "Customer Support"],
            },
            {
                key: "repairs",
                label: "Repair Servicing",
                icon: Nut,
                roles: ["Super Admin"],
                children: [
                    { label: "Repair Tickets", getPath: () => route('admin.repairs.index') },
                    { label: "Counter Desks", getPath: () => route('admin.counters.index') },
                ],
            },
            {
                key: "marketing",
                label: "Marketing",
                icon: Sparkles,
                roles: ["Super Admin", "Marketing Specialist"],
                children: [
                    { label: "Coupons", getPath: () => route('admin.marketing.coupons.index') },
                    { label: "Offers", getPath: () => route('admin.marketing.offers.index') },
                ],
            },
        ],
    },

    {
        title: "PARTNERS",
        items: [
            {
                key: "marketplace",
                label: "Marketplace",
                icon: Store,
                roles: ["Super Admin"],
                children: [
                    { label: "Suppliers", getPath: () => route('admin.suppliers.index') },
                    { label: "Warehouses", getPath: () => route('admin.warehouses.index') },
                ],
            },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            {
                key: "pages",
                label: "Page Management",
                icon: FileText,
                getPath: () => route('admin.pages.index'),
                roles: ["Super Admin"],
            },
            {
                key: "settings",
                label: "Settings",
                icon: Settings,
                roles: ["Super Admin"],
                children: [
                    { label: "Website System", getPath: () => route('admin.settings.website.system') },
                    { label: "Company Info", getPath: () => route('admin.settings.website.company') },
                    { label: "Email Settings", getPath: () => route('admin.settings.system.email') },
                    { label: "Payment Gateways", getPath: () => route('admin.settings.financial.gateway') },
                    { label: "Shipping & Delivery", getPath: () => route('admin.logistics.configuration.index') },
                    { label: "Admin Profile", getPath: () => route('admin.settings.general.profile') },
                    { label: "Security", getPath: () => route('admin.settings.general.security') },
                ],
            },
            {
                key: "access",
                label: "Access Control",
                icon: KeyRound,
                roles: ["Super Admin"],
                children: [
                    { label: "Users", getPath: () => route('admin.users.index') },
                    { label: "Roles", getPath: () => route('admin.roles.index') },
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
                                className={`transition-all duration-200 group-hover:scale-105 ${isChildActive ? "text-[#008060]" : "text-slate-400 group-hover:text-[#008060]"}`}
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
                        <div className="max-h-0 overflow-hidden peer-checked:max-h-60 peer-checked:mt-0.5 ml-5 space-y-0.5 will-change-[max-height]">
                            {item.children.map((child) => (
                                <SubMenuItem key={child.label} child={child} currentPath={currentPath} />
                            ))}
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
                        className={`transition-all duration-200 group-hover:scale-105 ${isActive ? "text-[#008060]" : "text-slate-400 group-hover:text-[#008060]"}`}
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
                    <Link href="/" className="flex-shrink-0 flex items-center h-[45px]">
                        <img src="/images/logo-indigo.png" alt="Admin Logo" className="h-full w-auto object-contain scale-[1.35] origin-left -translate-y-1" />
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
                        {!isCollapsed && (
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

            {/* TRIGGER COLLAPSE */}
            <button
                onClick={toggleCollapse}
                className="absolute top-4 -right-3 z-[110] w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#008060] transition-colors shadow-sm focus:outline-none"
            >
                <ChevronsLeft size={11} className={isCollapsed ? 'rotate-180' : ''} />
            </button>
        </div>
    );
}