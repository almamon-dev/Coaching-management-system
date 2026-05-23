import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    Settings2, Eye, EyeOff, GripVertical, Monitor, FileText, 
    Activity, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLUMN_ICONS = {
    name: Monitor,
    description: FileText,
    status: Activity,
    created_at: Calendar,
};

/**
 * ColumnManager Dropdown for Counters (Portal Enabled)
 * Handles column visibility for the Counter management table with a portal to prevent overflow clipping.
 */
const ColumnManager = ({ 
    columns, 
    visibleColumns, 
    toggleColumn, 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.right - 240 + window.scrollX // width is 240px, align right edge
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                onClick={handleToggle}
                className={cn(
                    "h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:bg-[#f6f6f7] transition-all focus:outline-none",
                    isOpen && "bg-[#f1f1f1] ring-1 ring-[#008060] border-[#008060]"
                )}
                title="Table settings"
                type="button"
            >
                <Settings2 size={14} />
            </button>

            {/* Dropdown Menu using React Portal */}
            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: coords.top + 4,
                        left: coords.left,
                        width: '240px',
                        zIndex: 999999
                    }}
                    className="origin-top-right bg-white border border-[#ebebeb] rounded-[4px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 select-none text-slate-700"
                >
                    {/* Columns Section */}
                    <div className="p-3">
                        <h3 className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider mb-2 px-1">Visible Columns</h3>
                        <div className="space-y-0.5 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {columns.map((col) => {
                                const isVisible = visibleColumns.includes(col.id);
                                const Icon = COLUMN_ICONS[col.id] || Monitor;
                                return (
                                    <div 
                                        key={col.id}
                                        className="flex items-center justify-between p-1.5 hover:bg-[#f6f6f7] rounded-[4px] group cursor-pointer transition-colors"
                                        onClick={() => toggleColumn(col.id)}
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
                                                {col.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isVisible ? (
                                                <Eye size={14} className="text-[#008060]" />
                                            ) : (
                                                <EyeOff size={14} className="text-[#bababa]" />
                                            )}
                                            <GripVertical size={14} className="text-[#bababa] cursor-grab active:cursor-grabbing" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ColumnManager;
