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
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f4f6f8] border-b border-[#ebebeb]">
                            <th className="py-2.5 pl-4 pr-3 w-[40px]">
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.length === data.attendances.length && data.attendances.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer" 
                                />
                            </th>
                            <th className="py-2.5 px-3 text-[12px] font-semibold text-[#202223] w-[140px]">Student ID</th>
                            <th className="py-2.5 px-3 text-[12px] font-semibold text-[#202223] w-[260px]">Student Name</th>
                            <th className="py-2.5 px-3 text-[12px] font-semibold text-[#202223] w-[340px]">Status</th>
                            <th className="py-2.5 pr-4 pl-3 text-[12px] font-semibold text-[#202223]">Remarks (Optional)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-16 text-center">
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
                                    className={`border-b border-[#ebebeb] hover:bg-[#f9fafb] transition-colors ${isSelected ? 'bg-[#f4f9f8]' : ''}`}
                                >
                                    <td className="py-2 pl-4 pr-3">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleSelect(student.id)}
                                            className="w-4 h-4 rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer" 
                                        />
                                    </td>
                                    <td className="py-2 px-3 text-[13px] font-semibold text-[#202223]">STU-{String(student.id).padStart(4, '0')}</td>
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-3">
                                            <img src={avatarUrl} alt={student.name} className="w-8 h-8 rounded-[4px] border border-[#ebebeb]" />
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-semibold text-[#202223] leading-tight">{student.name}</span>
                                                <span className="text-[12px] text-[#6d7175] mt-0.5">{student.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-3">
                                        <StatusRadio 
                                            status={attendanceData.status} 
                                            studentId={student.id} 
                                            onChange={(val) => handleStatusChange(student.id, val)} 
                                        />
                                    </td>
                                    <td className="py-2 pr-4 pl-3">
                                        <input 
                                            type="text" 
                                            value={attendanceData.remarks}
                                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                            placeholder="Add remark..." 
                                            className={`w-full border rounded-[3px] px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060] transition-colors shadow-sm ${attendanceData.remarks ? 'border-[#008060] text-[#202223] bg-white' : 'border-[#d1d1d1] text-[#202223] bg-white hover:border-[#8c9196]'}`}
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
