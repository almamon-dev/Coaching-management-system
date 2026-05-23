import React, { memo } from 'react';
import { Link } from '@inertiajs/react';
import { User, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = memo(({ url, user, navigation, isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-[110] lg:relative lg:z-0 lg:block w-72 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>

            <div className="relative bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden h-fit lg:sticky lg:top-[76px]">
                <div className="p-5 bg-[#081621] text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold truncate w-40">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate w-40">{user.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="py-2 space-y-1">
                    {navigation.map((item) => {
                        const currentPath = url.split('?')[0];
                        const itemPath = item.href.includes('://')
                            ? new URL(item.href).pathname
                            : item.href.split('?')[0];

                        const isActive = currentPath === itemPath;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch
                                className={cn(
                                    "flex items-center justify-between px-4 py-2.5 rounded-[1px] text-[13px] font-bold transition-all group relative",
                                    isActive
                                        ? "bg-[#008060]/5 text-[#008060]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-[#081621]"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#008060]"></div>
                                )}

                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={cn(isActive ? "text-[#008060]" : "text-slate-400 group-hover:text-[#081621]")} />
                                    {item.name}
                                </div>
                                {isActive && <ChevronRight size={14} className="opacity-50" />}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-slate-100 px-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-sm transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </Link>
                    </div>
                </nav>
            </div>
        </aside>
    );
});



export default Sidebar;
