import React from 'react';
import { CalendarCheck, UserCheck } from 'lucide-react';

export default function TeacherAttendanceTable({
    teachers,
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
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[140px]">Employee ID</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[260px]">Teacher Name</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[340px]">Status</th>
                            <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Remarks (Optional)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-16 text-center border border-[#e5e7e5]">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100 shadow-sm">
                                            <UserCheck size={28} className="text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-slate-800 mb-1">No teachers found</h3>
                                        <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                            There are no teachers available for attendance tracking. Please add teachers to the system first.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : teachers.map((teacher) => {
                            const attendanceData = data.attendances.find(a => a.id === teacher.id) || {};
                            const isSelected = selectedIds.includes(teacher.id);
                            
                            return (
                                <tr 
                                    key={teacher.id} 
                                    className={`hover:bg-slate-50/40 transition-colors group ${isSelected ? 'bg-emerald-50/30' : 'bg-white'}`}
                                >
                                    <td className="py-1.5 px-2 border border-[#e5e7e5] text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => toggleSelect(teacher.id)}
                                            className="w-3.5 h-3.5 rounded-[2px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] cursor-pointer" 
                                        />
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] font-medium text-[#333]">{teacher.employee_id}</td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <div className="flex items-center gap-2">
                                            <img src={teacher.avatar} alt={teacher.name} className="w-7 h-7 rounded-[3px] border border-[#ebebeb]" />
                                            <div className="flex flex-col">
                                                <span className="text-[12.5px] font-medium text-[#333] leading-tight">{teacher.name}</span>
                                                <span className="text-[11.5px] text-[#666] mt-0.5">{teacher.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <StatusRadio 
                                            teacherId={teacher.id}
                                            status={attendanceData.status} 
                                            onChange={(val) => handleStatusChange(teacher.id, val)} 
                                        />
                                    </td>
                                    <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                        <input 
                                            type="text" 
                                            value={attendanceData.remarks}
                                            onChange={(e) => handleRemarkChange(teacher.id, e.target.value)}
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

function StatusRadio({ teacherId, status, onChange }) {
    const options = [
        {
            value: 'present',
            label: 'Present',
            activeClass: 'bg-emerald-50/80 border-emerald-300 text-emerald-800 font-bold',
            radioColor: 'text-emerald-600 focus:ring-emerald-500',
        },
        {
            value: 'absent',
            label: 'Absent',
            activeClass: 'bg-rose-50/80 border-rose-300 text-rose-800 font-bold',
            radioColor: 'text-rose-600 focus:ring-rose-500',
        },
        {
            value: 'late',
            label: 'Late',
            activeClass: 'bg-amber-50/80 border-amber-300 text-amber-800 font-bold',
            radioColor: 'text-amber-500 focus:ring-amber-500',
        },
        {
            value: 'on_leave',
            label: 'Leave',
            activeClass: 'bg-purple-50/80 border-purple-300 text-purple-800 font-bold',
            radioColor: 'text-purple-600 focus:ring-purple-500',
        },
    ];

    return (
        <div className="flex items-center gap-1.5 flex-nowrap">
            {options.map((opt) => {
                const isSelected = status === opt.value || (opt.value === 'on_leave' && status === 'leave');
                return (
                    <label
                        key={opt.value}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] border text-xs cursor-pointer select-none transition-all ${
                            isSelected
                                ? `${opt.activeClass} shadow-2xs`
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        <input
                            type="radio"
                            name={`teacher_status_${teacherId}`}
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => onChange(opt.value)}
                            className={`w-3.5 h-3.5 border-slate-300 cursor-pointer focus:ring-0 focus:ring-offset-0 ${opt.radioColor}`}
                        />
                        <span className="leading-none text-[11.5px]">{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
}
