import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ClipboardCheck, Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import InputError from '@/Components/ui/InputError';
import Notify from '@/Utils/Notify';

export default function AttendanceIndex({ date, students }) {
    const { data, setData, post, processing, errors } = useForm({
        date: date,
        attendances: students,
    });

    const handleStatusChange = (index, status) => {
        const newAttendances = [...data.attendances];
        newAttendances[index].status = status;
        setData('attendances', newAttendances);
    };

    const handleRemarksChange = (index, value) => {
        const newAttendances = [...data.attendances];
        newAttendances[index].remarks = value;
        setData('attendances', newAttendances);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.attendance.store'), {
            preserveScroll: true,
        });
    };

    const handleDateChange = (e) => {
        router.get(route('admin.attendance.index'), { date: e.target.value }, {
            preserveState: true,
            replace: true,
        });
    };

    const markAllAs = (status) => {
        const newAttendances = data.attendances.map(s => ({ ...s, status }));
        setData('attendances', newAttendances);
    };

    return (
        <AdminLayout>
            <Head title="Attendance Management" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <ClipboardCheck className="text-[#008060]" />
                            Attendance Management
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Record and manage daily attendance for students.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-200">
                            <CalendarIcon size={18} className="text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">Date:</span>
                        </div>
                        <input 
                            type="date" 
                            value={data.date}
                            onChange={handleDateChange}
                            className="border-none text-sm font-medium text-slate-900 focus:ring-0 bg-transparent p-1"
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={submit}>
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-600 mr-2">Quick Mark All:</span>
                                <button type="button" onClick={() => markAllAs('present')} className="px-3 py-1.5 text-xs font-bold bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">Present</button>
                                <button type="button" onClick={() => markAllAs('absent')} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">Absent</button>
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2 bg-[#008060] text-white text-sm font-bold rounded-lg hover:bg-[#006e52] transition-colors disabled:opacity-50 shadow-sm"
                            >
                                <Save size={16} />
                                Save Attendance
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Student Name</th>
                                        <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs text-center w-[300px]">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Remarks (Optional)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.attendances.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{student.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center bg-slate-100/50 p-1 rounded-lg border border-slate-200/60">
                                                    {['present', 'absent', 'late', 'half_day'].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => handleStatusChange(index, status)}
                                                            className={cn(
                                                                "flex-1 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all",
                                                                student.status === status
                                                                    ? status === 'present' ? 'bg-green-500 text-white shadow-sm'
                                                                    : status === 'absent' ? 'bg-red-500 text-white shadow-sm'
                                                                    : status === 'late' ? 'bg-orange-500 text-white shadow-sm'
                                                                    : 'bg-yellow-500 text-white shadow-sm'
                                                                    : "text-slate-500 hover:bg-slate-200/50"
                                                            )}
                                                        >
                                                            {status.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="text" 
                                                    value={student.remarks || ''}
                                                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="w-full text-sm border-slate-200 rounded-lg focus:border-[#008060] focus:ring-[#008060] placeholder:text-slate-400"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {data.attendances.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                                    <ClipboardCheck size={24} className="text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No students found for attendance marking.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
