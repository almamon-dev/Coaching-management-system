import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Clock } from 'lucide-react';

export default function Routine({ auth, routines = [], studentInfo }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; 
        return `${h}:${minutes} ${ampm}`;
    };

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <StudentLayout user={auth.user}>
            <Head title="Class Routine" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Class Routine</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View your daily class schedule and room assignments.</p>
                </div>
            </div>

            <div>
                    {studentInfo ? (
                        <>
                            {/* Top Info Card */}
                            <div className="bg-white border border-[#e1e8e1] shadow-sm mb-6 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 font-sans text-[14px] text-[#333]">
                                    <div>
                                        <span className="font-bold">Name: </span>
                                        <span>{studentInfo.name}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold">Program: </span>
                                        <span>{studentInfo.program}</span>
                                    </div>
                                    <div className="text-right row-span-2 flex flex-col items-end justify-center">
                                        <div className="flex items-center gap-2 text-[#0bd462] bg-[#f0fdf4] px-4 py-2 rounded-md border border-[#bbf7d0]">
                                            <Clock size={18} className="animate-pulse" />
                                            <span className="font-bold text-[16px] font-sans tracking-wide">
                                                {currentTime.toLocaleTimeString('en-US')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <span className="font-bold">Student Id: </span>
                                        <span>{studentInfo.student_id}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold">Batch: </span>
                                        <span>{studentInfo.batch || '193'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Card */}
                            <div className="bg-white border border-[#e1e8e1] shadow-sm mb-12">
                                <div className="p-5 pb-4">
                                    <h2 className="text-[22px] font-bold text-[#0aa84e]">Class Routine</h2>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-center border-collapse font-sans min-w-[700px] border-t-0 [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tr:last-child>td]:border-b-0">
                                        <thead>
                                            <tr className="bg-[#0bd462] text-white">
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Formal Code</th>
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[35%]">Course Title</th>
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Class & Sec</th>
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Day</th>
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Room</th>
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Time Slot</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routines.length > 0 ? routines.map((routine, idx) => {
                                                const isToday = routine.day === currentDay;
                                                return (
                                                    <tr key={routine.id} className={isToday ? "bg-[#e8f7e8]" : "bg-white"}>
                                                        <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333]">
                                                            {routine.subject?.code || 'N/A'}
                                                        </td>
                                                        <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333]">
                                                            {routine.subject?.name || 'N/A'}
                                                        </td>
                                                        <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333]">
                                                            {routine.section?.name || 'N/A'}
                                                        </td>
                                                        <td className={`py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] ${isToday ? "font-bold text-[#008f39]" : "text-[#333]"}`}>
                                                            {routine.day}
                                                        </td>
                                                        <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] text-[#333]">
                                                            {routine.room_number || '-'}
                                                        </td>
                                                        <td className={`py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] ${isToday ? "font-bold text-[#008f39]" : "text-[#333]"}`}>
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <Clock size={13} className={isToday ? "text-[#008f39]" : "text-[#666]"} />
                                                                <span>{formatTime(routine.start_time)} - {formatTime(routine.end_time)}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr>
                                                    <td colSpan="6" className="py-8 text-center text-[14px] text-[#555]">
                                                        No classes scheduled
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white border border-[#e1e8e1] shadow-sm p-12 text-center text-[#555] font-sans">
                            <h5 className="text-[16px] font-bold">No routine available</h5>
                            <p className="text-[14px] mt-1">
                                You are not currently enrolled in any class.
                            </p>
                        </div>
                    )}
            </div>
        </StudentLayout>
    );
}
