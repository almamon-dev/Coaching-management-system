import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo
} from "react";

import Header from "../Components/Navigation/User/Header";
import Sidebar from "../Components/Navigation/User/Sidebar";

import Notify from "@/Utils/Notify";
import { usePage } from "@inertiajs/react";

/*
|--------------------------------------------------------------------------
| MEMOIZED COMPONENTS
|--------------------------------------------------------------------------
*/

const MemoSidebar = memo(Sidebar);
const MemoHeader = memo(Header);

/*
|--------------------------------------------------------------------------
| MAIN LAYOUT
|--------------------------------------------------------------------------
*/

export default function TeacherLayout({ children }) {

    const { flash } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("user-sidebar");
        return saved ? JSON.parse(saved) : false;
    });

    /*
    |--------------------------------------------------------------------------
    | TOGGLE SIDEBAR
    |--------------------------------------------------------------------------
    */

    const handleToggleSidebar = useCallback(() => {
        setIsCollapsed((prev) => {
            const updated = !prev;
            localStorage.setItem("user-sidebar", JSON.stringify(updated));
            return updated;
        });
    }, []);

    /*
    |--------------------------------------------------------------------------
    | MOBILE MENU
    |--------------------------------------------------------------------------
    */

    const handleMobileMenu = useCallback(() => {
        setIsMobileOpen(true);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | FLASH NOTIFICATION
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (flash?.success) {
            Notify.success("Success", flash.success);
        }
        if (flash?.error) {
            Notify.error("Error", flash.error);
        }
    }, [flash]);

    /*
    |--------------------------------------------------------------------------
    | CLOSE MOBILE ON RESIZE
    |--------------------------------------------------------------------------
    */

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
        <div className="h-screen overflow-hidden bg-[#f6f6f7]">

            {/* MOBILE OVERLAY */}
            {isMobileOpen && (
                <div
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-[100]
                    h-screen bg-white border-r border-slate-200
                    will-change-transform
                    lg:translate-x-0
                    transition-transform duration-200 lg:transition-none
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "w-[68px]" : "w-[280px]"}
                `}
            >
                <MemoSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={handleToggleSidebar}
                />
            </aside>

            {/* MAIN WRAPPER */}
            <div
                className={`
                    h-screen flex flex-col
                    transition-none
                    ${isCollapsed ? "lg:pl-[68px]" : "lg:pl-[280px]"}
                `}
            >
                {/* HEADER */}
                <MemoHeader
                    onMenuClick={handleMobileMenu}
                />

                {/* CONTENT */}
                <main
                    className="
                        flex-1 overflow-y-auto
                        no-scrollbar
                        contain-layout
                    "
                >
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
