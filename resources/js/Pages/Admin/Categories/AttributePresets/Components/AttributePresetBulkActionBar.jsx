import React from 'react';
import { ChevronDown, Trash2, Check, X, Eye, Edit3, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const AttributePresetBulkActionBar = ({ 
    selectedCount = 0, 
    onClear, 
    onBulkDelete, 
    totalCount = 0,
    perPageCount = 0,
    selectAllAcrossPages = false,
    onSelectAllAcrossPages,
    showOnlySelected = false,
    setShowOnlySelected,
    onMarkAsStatus
}) => {
    const [showSelectionMenu, setShowSelectionMenu] = React.useState(false);
    const [showMarkAsMenu, setShowMarkAsMenu] = React.useState(false);

    const safeTotalCount = Number(totalCount || 0);

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
                            {selectAllAcrossPages ? `All ${safeTotalCount.toLocaleString()}+` : selectedCount} selected
                        </span>
                        <ChevronDown size={14} className={cn("text-[#6d7175] transition-transform", showSelectionMenu && "rotate-180")} />
                    </div>

                    {showSelectionMenu && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowSelectionMenu(false)} />
                            <div className="absolute top-full left-0 mt-1 w-auto min-w-full bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 py-1 animate-in fade-in zoom-in-95 duration-100">
                                <button 
                                    onClick={() => { onClear?.(); setShowSelectionMenu(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap"
                                >
                                    Deselect all
                                </button>
                                {!selectAllAcrossPages && (
                                    <button 
                                        onClick={() => { onSelectAllAcrossPages?.(); setShowSelectionMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap"
                                    >
                                        Select all {safeTotalCount.toLocaleString()} presets
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
                                            onClick={() => {
                                                onMarkAsStatus('active');
                                                setShowMarkAsMenu(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] flex items-center gap-2 transition-colors"
                                        >
                                            <Eye size={12} className="text-[#6d7175]" />
                                            <span className="font-medium text-[#202223]">Set as Active</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onMarkAsStatus('inactive');
                                                setShowMarkAsMenu(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] flex items-center gap-2 transition-colors"
                                        >
                                            <Edit3 size={12} className="text-[#6d7175]" />
                                            <span className="font-medium text-[#202223]">Set as Inactive</span>
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

export default AttributePresetBulkActionBar;
