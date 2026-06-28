import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FileText, Calendar, Users, UserCheck, Download } from 'lucide-react';

export default function DailyReport({ auth, date, type, stats, attendances }) {
    const handleFilterChange = (key, value) => {
        router.get(route('admin.attendance.daily_report'), {
            date: key === 'date' ? value : date,
            type: key === 'type' ? value : type
        }, { preserveState: true });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Daily Attendance Report" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#008060]" />
                        Daily Attendance Report
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View attendance statistics and detailed records for a specific day</p>
                </div>
                <div>
                    <a 
                        href={route('admin.attendance.export_daily', { date, type })}
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
                        <Calendar size={14} className="text-[#6d7175]" />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => handleFilterChange('date', e.target.value)}
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

                {/* Stats Summary */}
                <div className="p-6 border-b border-[#ebebeb]">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-4 text-center">
                            <div className="text-[24px] font-bold text-slate-800">{stats.total}</div>
                            <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Total {type === 'student' ? 'Students' : 'Teachers'}</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-[4px] p-4 text-center">
                            <div className="text-[24px] font-bold text-emerald-700">{stats.present}</div>
                            <div className="text-[12px] font-semibold text-emerald-600 uppercase tracking-wider mt-1">Present</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-[4px] p-4 text-center">
                            <div className="text-[24px] font-bold text-red-700">{stats.absent}</div>
                            <div className="text-[12px] font-semibold text-red-600 uppercase tracking-wider mt-1">Absent</div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-4 text-center">
                            <div className="text-[24px] font-bold text-amber-700">{stats.late}</div>
                            <div className="text-[12px] font-semibold text-amber-600 uppercase tracking-wider mt-1">Late</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-[4px] p-4 text-center">
                            <div className="text-[24px] font-bold text-purple-700">{stats.on_leave}</div>
                            <div className="text-[12px] font-semibold text-purple-600 uppercase tracking-wider mt-1">On Leave</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f4f6f8] border-b border-[#ebebeb]">
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] w-[300px]">Name</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] w-[200px]">Email</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223] w-[150px]">Status</th>
                                <th className="py-2.5 px-4 text-[12px] font-semibold text-[#202223]">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {attendances.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100 shadow-sm">
                                                <FileText size={28} className="text-slate-400" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-[15px] font-bold text-slate-800 mb-1">No daily records</h3>
                                            <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                                                There are no attendance records for this specific date. Try selecting a different date or type.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendances.map((record) => {
                                let statusColor = 'bg-slate-100 text-slate-800';
                                if (record.status === 'present') statusColor = 'bg-emerald-100 text-emerald-800';
                                if (record.status === 'absent') statusColor = 'bg-red-100 text-red-800';
                                if (record.status === 'late') statusColor = 'bg-amber-100 text-amber-800';
                                if (record.status === 'on_leave') statusColor = 'bg-purple-100 text-purple-800';

                                return (
                                    <tr key={record.id} className="border-b border-[#ebebeb] hover:bg-[#f9fafb]">
                                        <td className="py-3 px-4 text-[13px] font-semibold text-[#202223]">
                                            {record.user?.name || 'Unknown User'}
                                        </td>
                                        <td className="py-3 px-4 text-[13px] text-[#6d7175]">
                                            {record.user?.email || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                {record.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-[13px] text-[#6d7175] italic">
                                            {record.remarks || '-'}
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
