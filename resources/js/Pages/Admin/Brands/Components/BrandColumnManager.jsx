import React, { useState, useRef, useEffect } from 'react';
import { 
    Settings2, Eye, EyeOff, GripVertical, Tag, Link as LinkIcon, 
    Hash, Activity, Calendar, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLUMN_ICONS = {
    brand: Award,
    slug: LinkIcon,
    products: Hash,
    status: Activity,
    created_at: Calendar,
};

/**
 * ColumnManager Dropdown for Brands
 * Handles column visibility for the Brands management table.
 */
const BrandColumnManager = ({ 
    columns, 
    visibleColumns, 
    toggleColumn, 
}) => {
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

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[4px] hover:bg-[#f6f6f7] transition-all shadow-sm",
                    isOpen && "bg-[#f1f1f1] ring-1 ring-[#008060] border-[#008060]"
                )}
                title="Table settings"
            >
                <Settings2 size={14} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-1 w-[240px] origin-top-right bg-white border border-[#ebebeb] rounded-[4px] shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    
                    {/* Columns Section */}
                    <div className="p-3">
                        <h3 className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider mb-2 px-1">Visible Columns</h3>
                        <div className="space-y-0.5 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {columns.map((col) => {
                                const isVisible = visibleColumns.includes(col.id);
                                const Icon = COLUMN_ICONS[col.id] || Tag;
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
                </div>
            )}
        </div>
    );
};

export default BrandColumnManager;
