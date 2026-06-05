import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { ClipboardCheck, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Pagination from '@/Components/ui/Pagination';

export default function MyAttendance({ auth, attendances }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'present':
                return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, label: 'Present' };
            case 'absent':
                return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, label: 'Absent' };
            case 'late':
                return { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: Clock, label: 'Late' };
            case 'half_day':
                return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, label: 'Half Day' };
            default:
                return { color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', icon: CalendarIcon, label: status };
        }
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="My Attendance" />

            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060]">
                        <ClipboardCheck size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Attendance</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">View your daily attendance history and remarks.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                            <CalendarIcon size={14} className="text-slate-400" />
                            Attendance Records
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {attendances.data.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Date</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {attendances.data.map((record) => {
                                        const config = getStatusConfig(record.status);
                                        const StatusIcon = config.icon;
                                        
                                        return (
                                            <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900 flex items-center gap-2">
                                                        <CalendarIcon size={14} className="text-slate-400" />
                                                        {new Date(record.date).toLocaleDateString('en-GB', { 
                                                            weekday: 'short', 
                                                            day: 'numeric', 
                                                            month: 'long', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                                                        config.bg, config.color, config.border
                                                    )}>
                                                        <StatusIcon size={12} strokeWidth={3} />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-600 font-medium">
                                                        {record.remarks || <span className="text-slate-300 italic">No remarks</span>}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <ClipboardCheck size={28} className="text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium text-sm">No attendance records found.</p>
                            </div>
                        )}
                    </div>

                    {attendances.last_page > 1 && (
                        <div className="p-4 border-t border-slate-100">
                            <Pagination links={attendances.links} />
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
