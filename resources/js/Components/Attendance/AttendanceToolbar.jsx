import React from 'react';
import { Calendar, ChevronDown, RefreshCcw, Save, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AttendanceToolbar({
    stats,
    data,
    handleDateChange,
    selectedIds = [],
    bulkDropdownOpen,
    setBulkDropdownOpen,
    handleSelectedBulkAction,
    handleQuickAction,
    processing
}) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Quick Stat Pills */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-1">Summary:</span>
                
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    <span>Total</span>
                    <b className="tabular-nums font-bold text-slate-900">{stats.total}</b>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Present</span>
                    <b className="tabular-nums font-bold text-emerald-700">{stats.present}</b>
                    <span className="text-[10px] text-emerald-600 font-normal">({stats.presentPct}%)</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>Absent</span>
                    <b className="tabular-nums font-bold text-rose-700">{stats.absent}</b>
                    <span className="text-[10px] text-rose-600 font-normal">({stats.absentPct}%)</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Late</span>
                    <b className="tabular-nums font-bold text-amber-700">{stats.late}</b>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>Leave</span>
                    <b className="tabular-nums font-bold text-purple-700">{stats.onLeave}</b>
                </span>
            </div>

            {/* Right: Date Picker, Bulk & Save Actions */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Date Picker */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-[3px] px-2.5 h-8 text-xs shadow-2xs focus-within:border-[#16a34a]">
                    <Calendar size={13} className="text-slate-400" />
                    <input
                        type="date"
                        value={data.date}
                        onChange={handleDateChange}
                        max={today}
                        className="border-none bg-transparent p-0 text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer w-[118px]"
                    />
                </div>

                {/* Bulk Actions Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                        className={`flex items-center justify-center gap-1.5 px-3 h-8 border rounded-[3px] text-xs font-semibold transition-colors cursor-pointer ${
                            selectedIds.length > 0
                                ? 'bg-emerald-50 border-[#16a34a] text-[#16a34a]'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        Bulk Action {selectedIds.length > 0 && `(${selectedIds.length})`}
                        <ChevronDown size={13} />
                    </button>
                    {bulkDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 shadow-lg rounded-[3px] overflow-hidden z-30 py-1">
                            <button
                                type="button"
                                onClick={() => handleSelectedBulkAction('present')}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                            >
                                <CheckCircle2 size={13} className="text-emerald-600" /> Mark Present
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelectedBulkAction('absent')}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 cursor-pointer"
                            >
                                <XCircle size={13} className="text-rose-600" /> Mark Absent
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelectedBulkAction('late')}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                            >
                                <Clock size={13} className="text-amber-600" /> Mark Late
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelectedBulkAction('on_leave')}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Mark On Leave
                            </button>
                        </div>
                    )}
                </div>

                {/* Reset / Mark All Present */}
                <button
                    type="button"
                    onClick={() => handleQuickAction('MarkAllPresent')}
                    className="flex items-center justify-center gap-1 px-3 h-8 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-[3px] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Set all students to present"
                >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>All Present</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleQuickAction('MarkAllAbsent')}
                    className="flex items-center justify-center gap-1 px-3 h-8 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-[3px] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Set all students to absent"
                >
                    <XCircle size={13} className="text-rose-600" />
                    <span>All Absent</span>
                </button>

                {/* Save Attendance Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center justify-center gap-1.5 px-4 h-8 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                    <Save size={13} />
                    <span>{processing ? 'Saving...' : 'Save Attendance'}</span>
                </button>
            </div>
        </div>
    );
}
