import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, Users, UserCheck, Download } from 'lucide-react';

export default function MonthlyReport({ auth, month, type, reportData }) {
    const handleFilterChange = (key, value) => {
        router.get(route('admin.attendance.monthly_report'), {
            month: key === 'month' ? value : month,
            type: key === 'type' ? value : type
        }, { preserveState: true });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Monthly Attendance Report" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#008060]" />
                        Monthly Attendance Report
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View aggregate attendance data for an entire month</p>
                </div>
                <div>
                    <a 
                        href={route('admin.attendance.export_monthly', { month, type })}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d1d1] rounded-[4px] text-[13px] font-medium text-[#202223] hover:bg-[#f9fafb] shadow-sm transition-colors"
                    >
                        <Download size={16} /> Export Excel
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] mb-8">
                {/* Filters */}
                <div className="px-4 py-4 border-b border-[#ebebeb] bg-[#f8f9fa] flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 bg-white border border-[#d1d1d1] rounded-[3px] px-3 py-1.5 shadow-sm">
                        <CalendarDays size={14} className="text-[#6d7175]" />
                        <input 
                            type="month" 
                            value={month} 
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="border-none bg-transparent p-0 text-[13px] font-medium text-[#202223] focus:ring-0 cursor-pointer w-[125px]"
                        />
                    </div>

                    <div className="flex items-center rounded-[3px] border border-[#d1d1d1] bg-white overflow-hidden shadow-sm p-0.5">
                        <button 
                            onClick={() => handleFilterChange('type', 'student')}
                            className={`flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium rounded-[2px] transition-colors ${type === 'student' ? 'bg-[#e6f2ef] text-[#008060]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Users size={14} /> Students
                        </button>
                        <button 
                            onClick={() => handleFilterChange('type', 'teacher')}
                            className={`flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium rounded-[2px] transition-colors ${type === 'teacher' ? 'bg-[#e6f2ef] text-[#008060]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <UserCheck size={14} /> Teachers
                        </button>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f4f6f8] border-b border-[#ebebeb]">
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] w-[300px]">Name</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] text-center w-[120px]">Present</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] text-center w-[120px]">Absent</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] text-center w-[120px]">Late</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] text-center w-[120px]">On Leave</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] text-right">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {reportData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100 shadow-sm">
                                                <CalendarDays size={28} className="text-slate-400" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-[15px] font-bold text-slate-800 mb-1">No monthly records</h3>
                                            <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                                There are no attendance records for this month. Change the month or add attendance records first.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : reportData.map((data) => {
                                let pctColor = 'text-emerald-700';
                                if (data.percentage < 80) pctColor = 'text-amber-600';
                                if (data.percentage < 60) pctColor = 'text-red-600';
                                if (data.percentage === 0) pctColor = 'text-slate-400';

                                return (
                                    <tr key={data.id} className="border-b border-[#ebebeb] hover:bg-[#f9fafb]">
                                        <td className="py-3 px-4 text-[13px] font-semibold text-[#202223]">
                                            {data.name}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] font-bold text-emerald-600 text-center">
                                            {data.present}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] font-bold text-red-600 text-center">
                                            {data.absent}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] font-bold text-amber-600 text-center">
                                            {data.late}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] font-bold text-purple-600 text-center">
                                            {data.on_leave}
                                        </td>
                                        <td className={`py-3 px-4 text-[14px] font-bold text-right ${pctColor}`}>
                                            {data.percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
