import React from 'react';
import { Trash2, X, Eye } from 'lucide-react';

export default function BulkActionBar({
    selectedCount = 0,
    totalCount = 0,
    itemNoun = 'items',
    onClear,
    onDelete,
    onShowSelected,
    selectAllAcrossPages,
    onSelectAllAcrossPages,
}) {
    return (
        <div className="absolute inset-0 bg-slate-100/95 backdrop-blur-xs z-20 flex items-center justify-between px-4 border-b border-[#ebebeb] animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-[13px]">
                <span className="text-slate-800">
                    <strong>{selectAllAcrossPages ? totalCount : selectedCount}</strong>{' '}
                    {selectedCount === 1 ? itemNoun.replace(/s$/, '') : itemNoun} selected.
                </span>
                {onSelectAllAcrossPages && !selectAllAcrossPages && totalCount > selectedCount && (
                    <button
                        type="button"
                        onClick={onSelectAllAcrossPages}
                        className="text-[#16a34a] font-bold hover:text-[#15803d] underline decoration-[#16a34a]/40 hover:decoration-[#16a34a] underline-offset-2 transition-colors ml-1 cursor-pointer bg-transparent border-none outline-none hidden sm:inline"
                    >
                        Select all {totalCount} {itemNoun}
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                {onShowSelected && (
                    <button
                        type="button"
                        onClick={onShowSelected}
                        className="h-[28px] px-3 bg-white border border-slate-200 text-slate-700 rounded-md text-[12px] font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-none cursor-pointer outline-none"
                    >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Show Selected</span>
                    </button>
                )}

                {onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="h-[28px] px-3 bg-white border border-red-200 text-red-600 rounded-md text-[12px] font-bold hover:bg-red-50 transition-all flex items-center gap-1.5 shadow-none cursor-pointer outline-none"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                )}

                {onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="h-7 w-7 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer outline-none shadow-none group"
                        title="Clear selection"
                    >
                        <X size={14} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
