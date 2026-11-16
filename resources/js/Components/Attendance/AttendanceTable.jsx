import React from 'react';
import { CalendarCheck, GraduationCap, User } from 'lucide-react';

export default function AttendanceTable({
    students = [],
    data,
    selectedIds = [],
    toggleSelectAll,
    toggleSelect,
    handleStatusChange,
    handleRemarkChange,
    auth
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/90 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-3.5 w-10 text-center">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === (data.attendances?.length || 0) && (data.attendances?.length || 0) > 0}
                                onChange={toggleSelectAll}
                                className="w-3.5 h-3.5 rounded-[2px] border-slate-300 text-[#16a34a] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                        </th>
                        <th className="py-3 px-3.5 w-32 font-bold">Student ID</th>
                        <th className="py-3 px-3.5 min-w-[220px]">Student Name</th>
                        <th className="py-3 px-3.5 min-w-[290px]">Attendance Status</th>
                        <th className="py-3 px-3.5 min-w-[180px]">Remarks (Optional)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-full mb-3 border border-slate-100">
                                        <GraduationCap size={24} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-0.5">No students found in this batch</h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        There are no active students enrolled in this batch. Enroll students or switch to another batch.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => {
                            const attendanceData = data.attendances?.find(a => a.id === student.id) || {};
                            const isSelected = selectedIds.includes(student.id);
                            const studentCode = student.student_id || ('STU-' + String(student.id).padStart(4, '0'));

                            return (
                                <tr
                                    key={student.id}
                                    className={`hover:bg-slate-50/60 transition-colors ${
                                        isSelected ? 'bg-emerald-50/30' : ''
                                    }`}
                                >
                                    <td className="py-2.5 px-3.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(student.id)}
                                            className="w-3.5 h-3.5 rounded-[2px] border-slate-300 text-[#16a34a] focus:ring-0 cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-2.5 px-3.5 text-xs font-bold text-[#16a34a] tabular-nums">
                                        {studentCode}
                                    </td>
                                    <td className="py-2.5 px-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-[4px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                                                {student.name?.charAt(0) || <User size={14} />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-slate-900 truncate">{student.name}</span>
                                                <span className="text-[11px] text-slate-500 truncate">{student.phone || student.email || 'No contact'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3.5">
                                        <StatusRadio
                                            status={attendanceData.status || 'present'}
                                            onChange={(val) => handleStatusChange(student.id, val)}
                                        />
                                    </td>
                                    <td className="py-2.5 px-3.5">
                                        <input
                                            type="text"
                                            value={attendanceData.remarks || ''}
                                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                            placeholder="Optional note..."
                                            className="w-full h-8 border border-slate-200 focus:border-[#16a34a] focus:ring-0 rounded-[3px] px-2.5 text-xs text-slate-700 transition-colors bg-white"
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Table Footer */}
            <div className="bg-slate-50/80 px-4 py-2.5 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500 font-medium">
                <span>Showing {students.length} student{students.length === 1 ? '' : 's'}</span>
                <div className="flex items-center gap-1.5">
                    <CalendarCheck size={13} className="text-slate-400" />
                    <span>Attendance verified by <b className="text-slate-800">{auth?.user?.name || 'Admin'}</b></span>
                </div>
            </div>
        </div>
    );
}

function StatusRadio({ status, onChange }) {
    const options = [
        {
            value: 'present',
            label: 'Present',
            active: 'bg-emerald-600 text-white font-bold shadow-xs',
            inactive: 'bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-700',
        },
        {
            value: 'absent',
            label: 'Absent',
            active: 'bg-rose-600 text-white font-bold shadow-xs',
            inactive: 'bg-white text-slate-600 hover:bg-slate-50 hover:text-rose-700',
        },
        {
            value: 'late',
            label: 'Late',
            active: 'bg-amber-500 text-white font-bold shadow-xs',
            inactive: 'bg-white text-slate-600 hover:bg-slate-50 hover:text-amber-700',
        },
        {
            value: 'on_leave',
            label: 'Leave',
            active: 'bg-purple-600 text-white font-bold shadow-xs',
            inactive: 'bg-white text-slate-600 hover:bg-slate-50 hover:text-purple-700',
        },
    ];

    return (
        <div className="inline-flex rounded-[3px] border border-slate-200 p-0.5 bg-slate-50 gap-0.5">
            {options.map((opt) => {
                const isSelected = status === opt.value || (opt.value === 'on_leave' && status === 'leave');
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1 text-xs rounded-[2px] transition-all cursor-pointer ${
                            isSelected ? opt.active : opt.inactive
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
