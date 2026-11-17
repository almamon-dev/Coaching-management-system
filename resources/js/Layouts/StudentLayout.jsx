import React, {
    useState,
    useEffect,
    useCallback,
    memo
} from "react";

import Header from "../Components/Navigation/User/Header";
import Sidebar from "../Components/Navigation/User/Sidebar";

import Notify from "@/Utils/Notify";
import { usePage } from "@inertiajs/react";

const MemoSidebar = memo(Sidebar);
const MemoHeader = memo(Header);

export default function StudentLayout({ children, activeTab, onTabChange }) {
    const { flash } = usePage().props;

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        const saved = localStorage.getItem("student-sidebar");
        return saved ? JSON.parse(saved) : false;
    });

    const handleToggleSidebar = useCallback(() => {
        setIsCollapsed((prev) => {
            const updated = !prev;
            if (typeof window !== "undefined") {
                localStorage.setItem("student-sidebar", JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const handleMobileMenu = useCallback(() => {
        setIsMobileOpen(true);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    // Flash notification listener
    useEffect(() => {
        if (flash?.success) {
            Notify.success("Success", flash.success);
        }
        if (flash?.error) {
            Notify.error("Error", flash.error);
        }
    }, [flash]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="h-screen overflow-hidden bg-[#f8fafc] print:h-auto print:overflow-visible print:bg-white">

            {/* MOBILE OVERLAY */}
            {isMobileOpen && (
                <div
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-40
                    h-screen bg-white border-r border-slate-200/80 shadow-2xs
                    will-change-transform
                    lg:translate-x-0
                    transition-all duration-200
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "w-[68px]" : "w-[240px]"}
                    print:hidden
                `}
            >
                <MemoSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={handleToggleSidebar}
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setIsMobileOpen(false);
                        if (onTabChange) onTabChange(tab);
                    }}
                />
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div
                className={`
                    h-screen flex flex-col
                    transition-all duration-200
                    ${isCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"}
                    print:pl-0 print:h-auto
                `}
            >
                {/* TOP HEADER */}
                <div className="print:hidden">
                    <MemoHeader
                        onMenuClick={handleMobileMenu}
                        onToggleSidebar={handleToggleSidebar}
                        isCollapsed={isCollapsed}
                        activeTab={activeTab}
                    />
                </div>

                {/* SCROLLABLE MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto no-scrollbar print:overflow-visible print:p-0">
                    <div className="p-4 md:p-6 lg:p-6 print:p-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
