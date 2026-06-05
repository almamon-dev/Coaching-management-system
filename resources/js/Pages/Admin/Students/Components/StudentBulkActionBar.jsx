import React from 'react';
import { Trash2, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const StudentBulkActionBar = ({
    selectedCount,
    totalCount,
    perPageCount,
    selectAllAcrossPages,
    onClear,
    onBulkDelete,
    onSelectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected
}) => {
    const isAllCurrentPageSelected = selectedCount === perPageCount && perPageCount > 0;
    const isAllSelected = selectAllAcrossPages || (isAllCurrentPageSelected && totalCount === perPageCount);

    return (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center bg-[#008060] text-white text-[12px] font-bold h-[22px] px-2 rounded-[3px] shadow-sm">
                        {selectAllAcrossPages ? totalCount : selectedCount}
                    </span>
                    <span className="text-[13px] font-bold text-[#202223]">
                        {selectedCount === 1 ? 'student selected' : 'students selected'}
                    </span>
                </div>

                {!isAllSelected && isAllCurrentPageSelected && totalCount > perPageCount && (
                    <>
                        <div className="w-[1px] h-4 bg-[#d1d1d1]"></div>
                        <button
                            onClick={onSelectAllAcrossPages}
                            className="text-[13px] font-bold text-[#008060] hover:text-[#006e52] hover:underline transition-all cursor-pointer bg-transparent border-none outline-none"
                        >
                            Select all {totalCount} students in store
                        </button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowOnlySelected(!showOnlySelected)}
                    className={cn(
                        "h-[32px] px-3 rounded-[3px] text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-sm border outline-none cursor-pointer",
                        showOnlySelected
                            ? "bg-[#e4f1ef] border-[#008060] text-[#008060]"
                            : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                    )}
                >
                    <Eye size={14} />
                    {showOnlySelected ? 'Show All' : 'Show Selected'}
                </button>

                <div className="w-[1px] h-4 bg-[#d1d1d1] mx-1"></div>

                <button
                    onClick={onBulkDelete}
                    className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#d82c0d] rounded-[3px] text-[12px] font-bold hover:bg-[#fff5f5] hover:border-[#d82c0d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer outline-none"
                >
                    <Trash2 size={14} />
                    Delete students
                </button>
                <button
                    onClick={onClear}
                    className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:bg-[#f6f6f7] transition-all cursor-pointer outline-none"
                    title="Clear selection"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default StudentBulkActionBar;
