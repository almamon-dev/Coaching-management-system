import React, { useState, useRef, useEffect } from 'react';
import { Settings2, Eye, EyeOff, GripVertical, CheckSquare, Hash, Calendar, Tag, Activity, Settings, User, Mail, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_ICONS = {
    name: User,
    title: User,
    email: Mail,
    roles: Shield,
    status: Activity,
    created_at: Calendar,
    date: Calendar,
    id: Hash,
    serial: Hash,
    tags: Tag,
    actions: Settings,
};

export default function ColumnManager({ columns, visibleColumns, toggleColumn }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter out actions or internal columns if needed, but usually we just show all toggleable columns
    const toggleableColumns = columns.filter(col => col.accessor && col.header);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer outline-none",
                    isOpen
                        ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                        : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                )}
                title="Manage Columns"
            >
                <Settings2 size={14} className={isOpen ? "text-[#008060]" : "text-[#6d7175]"} />
                Columns
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-[240px] origin-top-right bg-white border border-[#ebebeb] rounded-[4px] shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3">
                        <h3 className="text-[11px] font-bold text-[#6d7175] mb-2 px-1">Visible Columns</h3>
                        <div className="space-y-0.5 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {toggleableColumns.map((col) => {
                                const isVisible = visibleColumns.includes(col.accessor);
                                const Icon = col.icon || DEFAULT_ICONS[col.accessor] || CheckSquare;
                                return (
                                    <div 
                                        key={col.accessor}
                                        className="flex items-center justify-between p-1.5 hover:bg-[#f6f6f7] rounded-[4px] group cursor-pointer transition-colors"
                                        onClick={() => toggleColumn(col.accessor)}
                                    >
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className={cn(
                                                "w-6 h-6 rounded flex items-center justify-center transition-colors",
                                                isVisible ? "bg-[#e4f1ef] text-[#008060]" : "bg-transparent text-[#bababa]"
                                            )}>
                                                <Icon size={14} />
                                            </div>
                                            <span className={cn(
                                                "text-[12px] truncate",
                                                isVisible ? "text-[#202223] font-semibold" : "text-[#bababa]"
                                            )}>
                                                {col.header}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isVisible ? (
                                                <Eye size={14} className="text-[#008060]" />
                                            ) : (
                                                <EyeOff size={14} className="text-[#bababa]" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
