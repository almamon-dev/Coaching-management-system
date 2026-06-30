import React from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

export default function Routine({ auth, routines }) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        return `${h}:${minutes} ${ampm}`;
    };

    return (
        <TeacherLayout user={auth.user}>
            <Head title="My Class Routine" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <Calendar size={24} className="text-[#008060]"/> My Class Routine
                </h1>
                <p className="text-[13px] text-slate-500 mt-1">View your weekly class schedule and subject assignments.</p>
            </div>

            <div className="space-y-6">
                {daysOfWeek.map((day) => {
                    const dayRoutines = routines[day] || [];
                    
                    if (dayRoutines.length === 0) return null;

                    return (
                        <div key={day} className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-[#f8f9fa] border-b border-slate-200 px-5 py-3">
                                <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">{day}</h3>
                            </div>
                            <div className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="py-3 px-5 text-[12px] font-bold text-slate-500 w-[200px]">Time</th>
                                                <th className="py-3 px-5 text-[12px] font-bold text-slate-500">Subject</th>
                                                <th className="py-3 px-5 text-[12px] font-bold text-slate-500">Class & Section</th>
                                                <th className="py-3 px-5 text-[12px] font-bold text-slate-500 w-[150px]">Room</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dayRoutines.map((routine) => (
                                                <tr key={routine.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                                                            <Clock size={14} className="text-blue-500"/>
                                                            {formatTime(routine.start_time)} - {formatTime(routine.end_time)}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#008060]">
                                                            <BookOpen size={14} className="text-[#008060]"/>
                                                            {routine.subject?.name || 'Unknown'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                            Class {routine.academic_class?.name} • Sec {routine.section?.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                                                            <MapPin size={14} className="text-orange-500"/>
                                                            {routine.room_number || 'TBA'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {Object.keys(routines).length === 0 && (
                    <div className="bg-white rounded-[6px] border border-dashed border-[#d1d1d1] p-12 text-center bg-slate-50/50">
                        <Calendar className="mx-auto mb-3 text-slate-400" size={40} />
                        <h5 className="text-[15px] font-bold text-slate-700">No classes scheduled</h5>
                        <p className="text-[13px] text-[#6d7175] mt-1 max-w-sm mx-auto">
                            You have no classes assigned in your routine for the current week.
                        </p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
