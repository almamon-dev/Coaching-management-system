import React from 'react';
import { Trash2, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BulkActionBar({
    selectedCount,
    totalCount,
    itemNoun,
    onClear,
    onDelete,
    onShowSelected,
    selectAllAcrossPages,
    onSelectAllAcrossPages
}) {
    return (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center bg-[#008060] text-white text-[12px] font-bold h-[22px] px-2 rounded-[3px] shadow-sm">
                        {selectAllAcrossPages ? totalCount : selectedCount}
                    </span>
                    <span className="text-[13px] font-bold text-[#202223]">
                        {selectedCount === 1 ? `${itemNoun.replace(/s$/, '')} selected` : `${itemNoun} selected`}
                    </span>
                </div>
                
                {onSelectAllAcrossPages && !selectAllAcrossPages && totalCount > selectedCount && (
                    <>
                        <div className="w-[1px] h-4 bg-[#d1d1d1] mx-1 hidden sm:block"></div>
                        <button 
                            onClick={onSelectAllAcrossPages}
                            className="text-[13px] font-bold text-[#008060] hover:text-[#006e52] hover:underline transition-all cursor-pointer bg-transparent border-none outline-none hidden sm:block"
                        >
                            Select all {totalCount} {itemNoun} in store
                        </button>
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                {onShowSelected && (
                    <button 
                        onClick={onShowSelected}
                        className="h-[32px] px-3 bg-white rounded-[3px] border border-[#d1d1d1] text-[#202223] text-[12px] font-bold hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer outline-none"
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Show Selected</span>
                    </button>
                )}
                
                <div className="w-[1px] h-4 bg-[#d1d1d1] mx-1 hidden sm:block"></div>

                {onDelete && (
                    <button 
                        onClick={onDelete}
                        className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#d82c0d] rounded-[3px] text-[12px] font-bold hover:bg-[#fff5f5] hover:border-[#d82c0d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer outline-none"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete {itemNoun}</span>
                    </button>
                )}
                <button 
                    onClick={onClear}
                    className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:bg-[#f6f6f7] transition-all cursor-pointer outline-none ml-1"
                    title="Clear selection"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
