import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Settings2, X } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import { cn } from '@/lib/utils';
import ColumnManager from './ColumnManager';

export default function Toolbar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    advancedFilters,
    showAdvanced,
    setShowAdvanced,
    onRefresh,
    columns,
    visibleColumns,
    toggleColumn
}) {
    return (
        <div className="w-full p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                <TextInput 
                    type="text" 
                    placeholder={searchPlaceholder} 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-9 shadow-none w-full border-[#d1d1d1] focus:border-[#008060] focus:ring-[#008060] h-[36px] text-[13px] rounded-[3px]"
                />
                {searchQuery && (
                    <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors border-none bg-transparent cursor-pointer">
                        <X size={14} />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                {advancedFilters && (
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={cn(
                            "h-[32px] px-3 rounded-[3px] border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer outline-none",
                            showAdvanced
                                ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                                : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                        )}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                    </button>
                )}
                <button 
                    onClick={onRefresh}
                    className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" 
                    title="Refresh"
                >
                    <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                </button>
                
                {columns && visibleColumns && (
                    <>
                        <div className="w-[1px] h-4 bg-[#ebebeb] mx-1"></div>
                        <ColumnManager 
                            columns={columns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
