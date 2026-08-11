import React from 'react';
import { Calendar, ChevronDown, RefreshCcw, Save } from 'lucide-react';

export default function AttendanceToolbar({
    title = "Total Students:",
    stats,
    data,
    handleDateChange,
    selectedIds,
    bulkDropdownOpen,
    setBulkDropdownOpen,
    handleSelectedBulkAction,
    handleQuickAction,
    processing
}) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="px-4 py-3 border-b border-[#ebebeb] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-2 xl:mb-0">
                <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-semibold text-slate-700">{title}</span>
                    <span className="font-bold text-[#008060]">{stats.total}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                    <span className="font-semibold text-slate-700">Present:</span>
                    <span className="font-bold text-[#10b981]">{stats.present}</span>
                    <span className="text-slate-500 font-medium text-[11px]">({stats.presentPct}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
                    <span className="font-semibold text-slate-700">Absent:</span>
                    <span className="font-bold text-[#ef4444]">{stats.absent}</span>
                    <span className="text-slate-500 font-medium text-[11px]">({stats.absentPct}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                    <span className="font-semibold text-slate-700">Late:</span>
                    <span className="font-bold text-[#f59e0b]">{stats.late}</span>
                    <span className="text-slate-500 font-medium text-[11px]">({stats.latePct}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></div>
                    <span className="font-semibold text-slate-700">On Leave:</span>
                    <span className="font-bold text-[#8b5cf6]">{stats.onLeave}</span>
                    <span className="text-slate-500 font-medium text-[11px]">({stats.onLeavePct}%)</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                {/* Date Picker */}
                <div className="flex-grow sm:flex-grow-0 flex items-center gap-2 bg-white border border-[#d1d1d1] rounded-[3px] px-3 h-[34px] box-border shadow-sm focus-within:border-[#008060] focus-within:ring-1 focus-within:ring-[#008060] transition-all">
                    <Calendar size={14} className="text-[#6d7175]" />
                    <input 
                        type="date" 
                        value={data.date} 
                        onChange={handleDateChange}
                        max={today}
                        className="border-none bg-transparent p-0 text-[13px] font-medium text-[#202223] focus:ring-0 cursor-pointer w-full sm:w-[125px] h-full"
                    />
                </div>

                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                        className={`flex items-center justify-center gap-1.5 px-3 h-[34px] box-border border rounded-[3px] text-[12px] font-semibold transition-colors ${selectedIds.length > 0 ? 'bg-[#e6f2ef] border-[#008060] text-[#008060] hover:bg-[#d0e8e1]' : 'bg-white border-[#d1d1d1] text-[#202223] hover:bg-slate-50'}`}
                    >
                        Bulk Actions {selectedIds.length > 0 && `(${selectedIds.length})`} <ChevronDown size={14} />
                    </button>
                    {bulkDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-[#d1d1d1] shadow-lg rounded-[4px] overflow-hidden z-20">
                            <div className="py-1">
                                <button type="button" onClick={() => handleSelectedBulkAction('present')} className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#202223] hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mark Present
                                </button>
                                <button type="button" onClick={() => handleSelectedBulkAction('absent')} className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#202223] hover:bg-red-50 hover:text-red-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Mark Absent
                                </button>
                                <button type="button" onClick={() => handleSelectedBulkAction('late')} className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#202223] hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Mark Late
                                </button>
                                <button type="button" onClick={() => handleSelectedBulkAction('on_leave')} className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#202223] hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Mark On Leave
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button 
                    type="button"
                    onClick={() => handleQuickAction('Clear')}
                    className="flex items-center justify-center gap-1.5 px-3 h-[34px] box-border bg-white border border-[#d1d1d1] text-[#202223] text-[12px] font-semibold rounded-[3px] hover:bg-slate-50 transition-colors"
                >
                    <RefreshCcw size={13} /> Reset All
                </button>
                <button 
                    type="submit" 
                    disabled={processing} 
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 h-[34px] box-border bg-[#008060] text-white text-[12px] font-bold rounded-[3px] hover:bg-[#006e52] shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <Save size={14} /> Save
                </button>
            </div>
        </div>
    );
}
