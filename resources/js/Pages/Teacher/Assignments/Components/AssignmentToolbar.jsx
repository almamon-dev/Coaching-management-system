import React, { useState } from 'react';
import { Search, X, RotateCcw, ChevronDown, Check, Trash2 } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import ColumnManager from '@/Pages/Admin/AcademicClasses/Components/ColumnManager';

export default function AssignmentToolbar({ search, setSearch, handleReset, columns, visibleColumns, toggleColumn, selectedIds, handleClearSelection, handleBulkDelete }) {
    const [showSelectionMenu, setShowSelectionMenu] = useState(false);

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {selectedIds.length > 0 && (
                <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-3 animate-in slide-in-from-top-1 duration-200 shadow-sm border-b border-[#ebebeb]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div 
                                onClick={() => setShowSelectionMenu(!showSelectionMenu)}
                                className="flex items-center gap-2 px-2.5 h-[36px] bg-[#f1f1f1] border border-[#d1d1d1] rounded-[4px] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                            >
                                <div className="w-[17px] h-[17px] bg-[#008060] border-[#008060] rounded-[3px] flex items-center justify-center">
                                    <Check size={11} strokeWidth={4} className="text-white" />
                                </div>
                                <span className="text-[13px] font-bold text-[#202223]">
                                    {selectedIds.length} selected
                                </span>
                                <ChevronDown size={14} className={`text-[#6d7175] transition-transform ${showSelectionMenu ? "rotate-180" : ""}`} />
                            </div>
                            {showSelectionMenu && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowSelectionMenu(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-auto min-w-full bg-white border border-[#d1d1d1] rounded-[4px] shadow-lg z-40 py-1 animate-in fade-in zoom-in-95 duration-100">
                                        <button 
                                            onClick={() => { handleClearSelection(); setShowSelectionMenu(false); }}
                                            className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#f6f6f7] text-[#202223] transition-colors whitespace-nowrap"
                                        >
                                            Deselect all
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="h-4 w-[1px] bg-[#d1d1d1] mx-1" />
                        <button onClick={handleBulkDelete} className="h-[36px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#bf0711] hover:bg-[#fbeae5] transition-all flex items-center gap-1.5 shadow-sm">
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleClearSelection} className="p-1.5 text-[#6d7175] hover:text-[#202223] transition-colors border-l border-[#ebebeb] pl-3"><X size={16} /></button>
                    </div>
                </div>
            )}
            <div className={`p-3 flex items-center justify-between gap-4 transition-opacity duration-200 ${selectedIds.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search assignments..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none w-full"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors bg-transparent border-none cursor-pointer">
                            <X size={14} />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={handleReset} className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group cursor-pointer" title="Reset Filters">
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />
                    <ColumnManager columns={columns} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
                </div>
            </div>
        </div>
    );
}
