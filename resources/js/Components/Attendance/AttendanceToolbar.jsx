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
    processing,
    isAttendanceTaken = false
}) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="px-3 sm:px-4 py-2 border-b border-slate-200/80 bg-white flex items-center justify-between gap-2 overflow-x-auto no-scrollbar flex-nowrap">
            {/* Left: Quick Stat Pills (Always strictly ONE line, compact and clean) */}
            <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
                <span className="inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                    <span className="text-slate-500 text-[11px]">Total</span>
                    <b className="tabular-nums font-bold text-slate-900">{stats.total}</b>
                </span>

                <span className="inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Present</span>
                    <b className="tabular-nums font-bold text-emerald-700">{stats.present}</b>
                </span>

                <span className="inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>Absent</span>
                    <b className="tabular-nums font-bold text-rose-700">{stats.absent}</b>
                </span>

                <span className="inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span>Late</span>
                    <b className="tabular-nums font-bold text-amber-700">{stats.late}</b>
                </span>

                <span className="inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                    <span>Leave</span>
                    <b className="tabular-nums font-bold text-purple-700">{stats.onLeave}</b>
                </span>
            </div>

            {/* Right: Date Picker, Bulk & Save Actions (Always strictly ONE line, matching h-8 height) */}
            <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
                {/* Date Picker */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-[3px] px-2 h-8 text-xs shadow-2xs focus-within:border-[#16a34a] shrink-0">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <input
                        type="date"
                        value={data.date}
                        onChange={handleDateChange}
                        max={today}
                        className="border-none bg-transparent p-0 text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer w-[114px] h-full leading-none"
                    />
                </div>

                {/* Status Indicator for Selected Date (New Record vs Update Mode) */}
                {isAttendanceTaken ? (
                    <span
                        className="hidden sm:inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0"
                        title="Attendance was previously recorded for this date. You are editing/updating it."
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                        <span>Update Mode</span>
                    </span>
                ) : (
                    <span
                        className="hidden sm:inline-flex items-center gap-1 px-2 h-8 rounded-[3px] text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0"
                        title="No attendance recorded yet for this date."
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>New Record</span>
                    </span>
                )}

                {/* Bulk Actions Dropdown */}
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                        className={`inline-flex items-center justify-center gap-1 px-2.5 h-8 border rounded-[3px] text-xs font-semibold transition-colors cursor-pointer shrink-0 leading-none ${selectedIds.length > 0
                            ? 'bg-emerald-50 border-[#16a34a] text-[#16a34a]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <span>Bulk Action</span> {selectedIds.length > 0 && `(${selectedIds.length})`}
                        <ChevronDown size={13} className="shrink-0" />
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
                    className="inline-flex items-center justify-center gap-1 px-2.5 h-8 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-[3px] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors cursor-pointer shrink-0 leading-none"
                    title="Set all students to present"
                >
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>All Present</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleQuickAction('MarkAllAbsent')}
                    className="inline-flex items-center justify-center gap-1 px-2.5 h-8 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-[3px] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors cursor-pointer shrink-0 leading-none"
                    title="Set all students to absent"
                >
                    <XCircle size={13} className="text-rose-600 shrink-0" />
                    <span>All Absent</span>
                </button>

                {/* Save Attendance Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 h-8 text-white text-xs font-bold rounded-[3px] shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0 leading-none ${
                        isAttendanceTaken
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-[#16a34a] hover:bg-[#15803d]'
                    }`}
                >
                    <Save size={13} className="shrink-0" />
                    <span>
                        {processing
                            ? (isAttendanceTaken ? 'Updating...' : 'Saving...')
                            : (isAttendanceTaken ? 'Update Attendance' : 'Save Attendance')}
                    </span>
                </button>
            </div>
        </div>
    );
}
