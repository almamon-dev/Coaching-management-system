import React from 'react';
import { CalendarCheck, GraduationCap } from 'lucide-react';

export default function AttendanceTable({
    students,
    data,
    selectedIds,
    toggleSelectAll,
    toggleSelect,
    handleStatusChange,
    handleRemarkChange,
    auth
}) {
    return (
        <>
            <div className="overflow-x-auto h-auto">
                <table className="w-full text-left border-collapse font-sans border-t-0 [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tr:last-child>td]:border-b-0">
                    <thead>
                        <tr className="bg-[#0bd462] text-white">
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[40px] text-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.length === data.attendances.length && data.attendances.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-3.5 h-3.5 rounded-[2px] border-white/40 bg-transparent text-[#008060] focus:ring-0 focus:ring-offset-0 cursor-pointer checked:border-white checked:bg-white checked:text-[#0bd462]" 
                                />
                            </th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[140px]">Student ID</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[260px]">Student Name</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[340px]">Status</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Remarks (Optional)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-16 text-center border border-[#e5e7e5]">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100 shadow-sm">
                                            <GraduationCap size={28} className="text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-slate-800 mb-1">No students found</h3>
                                        <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                            There are no students available for attendance tracking. Please add students to the system first.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : students.map((student) => {
                            const attendanceData = data.attendances.find(a => a.id === student.id) || {};
                            const isSelected = selectedIds.includes(student.id);
                            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0D8ABC&color=fff`;
                            
                            return (
                                <tr 
                                    key={student.id} 
                                    className={`hover:bg-slate-50/40 transition-colors group ${isSelected ? 'bg-emerald-50/30' : 'bg-white'}`}
                                >
                                    <td className="py-1.5 px-2 border border-[#e5e7e5] text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleSelect(student.id)}
                                            className="w-3.5 h-3.5 rounded-[2px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer" 
                                        />
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] font-medium text-[#333]">STU-{String(student.id).padStart(4, '0')}</td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <div className="flex items-center gap-2">
                                            <img src={avatarUrl} alt={student.name} className="w-7 h-7 rounded-[3px] border border-[#ebebeb]" />
                                            <div className="flex flex-col">
                                                <span className="text-[12.5px] font-medium text-[#333] leading-tight">{student.name}</span>
                                                <span className="text-[11.5px] text-[#666] mt-0.5">{student.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <StatusRadio 
                                            status={attendanceData.status} 
                                            studentId={student.id} 
                                            onChange={(val) => handleStatusChange(student.id, val)} 
                                        />
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <input 
                                            type="text" 
                                            value={attendanceData.remarks}
                                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                            placeholder="Add remark..." 
                                            className={`w-full h-[30px] border-[#d1d1d1] focus:border-[#0bd462] focus:ring-[#0bd462] shadow-none rounded-[3px] px-2 text-[12.5px] transition-colors`}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="bg-[#f4f6f8] px-4 py-3 flex items-center justify-end rounded-b-[4px] border-t border-[#ebebeb]">
                <div className="text-[12px] font-medium text-[#6d7175] flex items-center gap-1.5">
                    <CalendarCheck size={14} className="text-[#6d7175]" />
                    Attendance recorded by <span className="font-semibold text-[#202223]">{auth?.user?.name || 'Admin'}</span>
                </div>
            </div>
        </>
    );
}

function StatusRadio({ status, studentId, onChange }) {
    const options = [
        { value: 'present', label: 'Present', activeColor: 'text-emerald-700 bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300 z-10', baseColor: 'text-[#6d7175] border-[#d1d1d1] bg-white hover:bg-[#f9fafb]' },
        { value: 'absent', label: 'Absent', activeColor: 'text-red-700 bg-red-50 border-red-300 ring-1 ring-red-300 z-10', baseColor: 'text-[#6d7175] border-[#d1d1d1] bg-white hover:bg-[#f9fafb]' },
        { value: 'late', label: 'Late', activeColor: 'text-amber-700 bg-amber-50 border-amber-300 ring-1 ring-amber-300 z-10', baseColor: 'text-[#6d7175] border-[#d1d1d1] bg-white hover:bg-[#f9fafb]' },
        { value: 'on_leave', label: 'On Leave', activeColor: 'text-purple-700 bg-purple-50 border-purple-300 ring-1 ring-purple-300 z-10', baseColor: 'text-[#6d7175] border-[#d1d1d1] bg-white hover:bg-[#f9fafb]' },
    ];

    return (
        <div className="flex items-center shadow-sm rounded-[3px] overflow-hidden group/radios w-full min-w-[280px]">
            {options.map((opt, i) => {
                const isActive = status === opt.value;
                const isFirst = i === 0;
                const isLast = i === options.length - 1;
                
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`relative flex-1 px-2 py-1.5 text-[12px] font-semibold border-y border-r transition-all
                            ${isFirst ? 'border-l rounded-l-[3px]' : ''} 
                            ${isLast ? 'rounded-r-[3px]' : ''}
                            ${!isActive && !isLast ? 'border-r-[#d1d1d1]' : ''}
                            ${isActive ? opt.activeColor : opt.baseColor}
                        `}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
