import React, { useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, Calendar, MapPin, Clock, User, Layers } from 'lucide-react';

export default function Print({ routines, info, filters }) {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Group routines by day
    const routinesByDay = useMemo(() => {
        const grouped = {};
        days.forEach(day => grouped[day] = []);
        
        routines.forEach(routine => {
            if (grouped[routine.day]) {
                grouped[routine.day].push(routine);
            }
        });
        
        // Sort routines within each day by start time
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
        });
        
        return grouped;
    }, [routines]);

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        return `${hour}:${m} ${ampm}`;
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 print:p-0 print:bg-white text-slate-800 font-sans antialiased">
            <Head title="Print Routine" />
            <style>
                {`
                    @page { size: A4 landscape; margin: 10mm; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: transparent !important; }
                        .no-print { display: none !important; }
                    }
                `}
            </style>
            
            <div className="w-full max-w-[1300px] mx-auto bg-white p-6 print:p-0 print:max-w-none print:w-full print:shadow-none shadow-xl shadow-slate-100/50 border border-slate-200/60 print:border-none rounded-xl">
                
                {/* Control Action Bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 print:hidden">
                    <Link 
                        href={route('admin.class_routines.index')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[13px] font-semibold transition-colors"
                    >
                        <ArrowLeft size={15} />
                        Back to Routines
                    </Link>
                    
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 h-9 bg-emerald-600 text-white rounded-md text-[13px] font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/10 transition-all cursor-pointer"
                    >
                        <Printer size={15} />
                        Print Schedule
                    </button>
                </div>
                
                {/* Institutional Header */}
                <div className="text-center mb-6 pb-4 border-b-2 border-slate-900/10">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full mb-2 print:hidden">
                        <Calendar size={13} className="text-emerald-600" />
                        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">Academic Schedule</span>
                    </div>
                    <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 mb-1">Weekly Class Routine</h1>
                    <p className="text-[13px] text-slate-500 print:text-slate-700 font-medium max-w-xl mx-auto">{info || 'All Routines'}</p>
                </div>
                
                {routines.length > 0 ? (
                    <div className="w-full overflow-hidden">
                        <table className="w-full border-collapse border border-slate-300 print:border-black table-fixed">
                            <thead>
                                <tr>
                                    <th className="border border-slate-300 print:lack px-3 print:px-1 py-2.5 print:py-1.5 w-[120px] print:w-[80px] text-center font-bold print:text-black text-[13px] print:text-[11px] tracking-wide bg-slate-100 print:bg-transparent text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
                                        Day
                                    </th>
                                    <th className="border border-slate-300 print:lack px-4 print:px-2 py-2.5 print:py-1.5 text-left font-bold print:text-black text-[13px] print:text-[11px] tracking-wide bg-slate-100 print:bg-transparent text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
                                        Scheduled Classes
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {days.map(day => {
                                    const dayRoutines = routinesByDay[day] || [];
                                    
                                    return (
                                        <tr key={day}>
                                            <td className="border border-slate-300 print:border-black px-3 print:px-1 py-4 print:py-2 text-center font-bold text-slate-800 print:text-black text-[14px] print:text-[11px] tracking-wide align-middle bg-slate-50/50 print:bg-transparent uppercase">
                                                {day.substring(0, 3)}
                                            </td>
                                            <td className="border border-slate-300 print:border-black px-4 print:px-2 py-4 print:py-2 align-top">
                                                <div className="flex flex-wrap gap-4 print:gap-1.5">
                                                    {dayRoutines.map(routine => (
                                                        <div 
                                                            key={routine.id} 
                                                            className="border border-slate-300 print:border-black bg-white print:bg-transparent p-3 print:p-1.5 min-w-[200px] print:min-w-[120px] flex-1 max-w-[300px] print:max-w-none flex flex-col gap-1.5 print:gap-1 rounded-sm print:rounded-none"
                                                        >
                                                            {/* Card Time Meta */}
                                                            <div className="flex items-center justify-between gap-2 pb-1.5 print:pb-1 border-b border-slate-200 print:border-black">
                                                                <span className="text-[13px] print:text-[10px] font-bold text-slate-900 print:text-black">
                                                                    {formatTime(routine.start_time)}
                                                                </span>
                                                                {routine.room_number && (
                                                                    <span className="text-[12px] print:text-[9px] font-bold text-slate-600 print:text-black">
                                                                        Rm: {routine.room_number}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Subject Name */}
                                                            <div className="font-extrabold text-slate-900 print:text-black text-[14px] print:text-[11px] leading-tight tracking-tight mt-1 print:mt-0">
                                                                {routine.subject?.name}
                                                            </div>
                                                            
                                                            {/* Dynamic Meta Filter Row */}
                                                            {filters.teacher_id ? (
                                                                <div className="text-[12px] print:text-[9px] text-slate-700 print:text-black font-semibold mt-auto pt-2 print:pt-1 border-t border-slate-100 print:border-transparent">
                                                                    C: {routine.academic_class?.name} ({routine.section?.name})
                                                                </div>
                                                            ) : (
                                                                <div className="text-[12px] print:text-[9px] text-slate-700 print:text-black font-semibold mt-auto pt-2 print:pt-1 border-t border-slate-100 print:border-transparent">
                                                                    T: {routine.teacher?.name || 'N/A'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {dayRoutines.length === 0 && (
                                                        <div className="text-[14px] print:text-[11px] text-slate-400 print:text-black font-bold italic py-2 print:py-1 px-2 print:px-1 tracking-wide">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                        <p className="text-[14px] font-medium text-slate-400">No routines found for the selected criteria.</p>
                    </div>
                )}
                
                {/* Print Time Footer */}
                <div className="mt-6 text-center text-[11px] font-medium text-slate-400 print:text-slate-500 hidden print:block border-t border-slate-100 pt-4">
                    Generated and Printed on {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
}