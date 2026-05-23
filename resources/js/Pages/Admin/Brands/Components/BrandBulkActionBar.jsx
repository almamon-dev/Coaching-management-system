import React from 'react';
import { Trash2, Check, X, ChevronDown, Eye, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BrandBulkActionBar Component
 * Standardized premium floating action bar for brands.
 */
const BrandBulkActionBar = ({
    selectedCount,
    totalCount,
    perPageCount,
    onClear,
    onBulkDelete,
    onSelectAllAcrossPages,
    selectAllAcrossPages,
    showOnlySelected,
    setShowOnlySelected,
    onMarkAsStatus
}) => {
    const [showSelectionMenu, setShowSelectionMenu] = React.useState(false);
    const [showMarkAsMenu, setShowMarkAsMenu] = React.useState(false);

    return (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
                {/* Selection Count Dropdown */}
                <div className="relative">
                    <div
                        onClick={() => setShowSelectionMenu(!showSelectionMenu)}
                        className="flex items-center gap-2 px-2.5 h-[36px] bg-[#f1f1f1] border border-[#d1d1d1] rounded-[4px] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                    >
                        <div className="w-[17px] h-[17px] bg-[#008060] border-[#008060] rounded-[3px] flex items-center justify-center">
                            <Check size={11} strokeWidth={4} className="text-white" />
                        </div>
                        <span className="text-[13px] font-bold text-[#202223]">
                            {selectAllAcrossPages ? `All ${totalCount.toLocaleString()}+` : selectedCount} selected
                        </span>
                        <ChevronDown size={14} className={cn("text-[#6d7175] transition-transform", showSelectionMenu && "rotate-180")} />
                    </div>

                    {showSelectionMenu && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowSelectionMenu(false)} />
                            <div className="absolute top-full left-0 mt-1 w-auto min-w-full bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 py-1 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={() => { onClear(); setShowSelectionMenu(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap"
                                >
                                    Deselect all
                                </button>
                                {!selectAllAcrossPages && totalCount > perPageCount && (
                                    <button
                                        onClick={() => { onSelectAllAcrossPages(); setShowSelectionMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap font-bold"
                                    >
                                        Select all {totalCount.toLocaleString()} brands
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="h-4 w-[1px] bg-[#d1d1d1] mx-1" />

                {/* Primary Actions */}
                <div className="flex items-center gap-1.5">
                    {onMarkAsStatus && (
                        <div className="relative">
                            <button 
                                onClick={() => setShowMarkAsMenu(!showMarkAsMenu)}
                                className="h-[36px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                Mark as
                                <ChevronDown size={14} className={cn("text-[#6d7175] transition-transform", showMarkAsMenu && "rotate-180")} />
                            </button>

                            {showMarkAsMenu && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowMarkAsMenu(false)} />
                                    <div className="absolute top-full mt-1 left-0 w-[180px] bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 py-1 animate-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => { onMarkAsStatus(1); setShowMarkAsMenu(false); }}
                                            className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#008060] font-bold transition-colors flex items-center gap-2"
                                        >
                                            <Eye size={14} /> Set as Active
                                        </button>
                                        <button
                                            onClick={() => { onMarkAsStatus(0); setShowMarkAsMenu(false); }}
                                            className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#6d7175] font-bold transition-colors flex items-center gap-2"
                                        >
                                            <Edit3 size={14} /> Set as Inactive
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onBulkDelete}
                        className="h-[36px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#bf0711] hover:bg-[#fbeae5] transition-all flex items-center gap-1.5 shadow-sm"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div
                    onClick={() => setShowOnlySelected(!showOnlySelected)}
                    className="flex items-center gap-2 cursor-pointer group select-none"
                >
                    <div className={cn(
                        "w-[34px] h-[18px] rounded-full relative transition-all duration-200",
                        showOnlySelected ? "bg-[#008060]" : "bg-[#d1d1d1] group-hover:bg-[#bababa]"
                    )}>
                        <div className={cn(
                            "absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-all duration-200",
                            showOnlySelected ? "left-[18px]" : "left-[2px]"
                        )} />
                    </div>
                    <span className="text-[12px] font-medium text-[#202223]">Show all selected</span>
                </div>
                <button
                    onClick={onClear}
                    className="p-1.5 text-[#6d7175] hover:text-[#202223] transition-colors border-l border-[#ebebeb] pl-3"
                    title="Close selection"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default BrandBulkActionBar;
