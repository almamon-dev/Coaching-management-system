import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, FileText, PieChart as PieChartIcon } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Attendance({ auth, attendances, stats, filters }) {
    
    const [selectedMonth, setSelectedMonth] = useState(filters?.month || new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(filters?.year || new Date().getFullYear());

    const handleFilterChange = (month, year) => {
        router.get(route('user.attendance'), { month, year }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'present':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'absent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'late':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'on_leave':
            case 'half_day':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const months = [
        { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
        { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
        { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
        { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => ({ id: currentYear - i, name: (currentYear - i).toString() }));

    // Chart Data Preparation
    const chartData = [
        { name: 'Present', value: stats?.total_present || 0, color: '#059669' },
        { name: 'Absent', value: stats?.total_absent || 0, color: '#DC2626' },
        { name: 'Late', value: stats?.total_late || 0, color: '#D97706' },
        { name: 'Leave', value: stats?.total_leave || 0, color: '#2563EB' },
    ].filter(item => item.value > 0);

    const hasData = chartData.length > 0;
    const currentMonthName = months.find(m => m.id === selectedMonth)?.name;

    // Calendar Generation Logic
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    
    const calendarDays = [];
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    // Map attendances to a fast lookup dictionary by day
    const attendanceMap = {};
    if (attendances && attendances.length > 0) {
        attendances.forEach(record => {
            const d = new Date(record.date);
            attendanceMap[d.getDate()] = record;
        });
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <UserLayout user={auth?.user}>
            <Head title="My Attendance" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Attendance Record</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Track your presence and attendance history.</p>
                </div>
            </div>

            <div className="bg-white rounded-[6px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                
                {/* Left side: Title and Custom Date Picker */}
                <div className="flex flex-col">
                    <h2 className="text-[16px] font-bold text-[#202223] mb-1">Attendance Calendar</h2>
                    <div className="relative inline-flex items-center">
                        <select
                            value={`${selectedYear}-${selectedMonth}`}
                            onChange={(e) => {
                                const [y, m] = e.target.value.split('-');
                                setSelectedMonth(parseInt(m));
                                setSelectedYear(parseInt(y));
                                handleFilterChange(parseInt(m), parseInt(y));
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            {years.map(y => (
                                <optgroup key={y.id} label={y.name}>
                                    {months.map(m => (
                                        <option key={`${y.id}-${m.id}`} value={`${y.id}-${m.id}`}>
                                            {m.name} {y.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 text-[14px] text-slate-600 font-medium cursor-pointer hover:text-slate-800 transition-colors">
                            {currentMonthName} {selectedYear}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Right side: Vertical Bordered Stats */}
                <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                    <div className="flex flex-col pl-3 border-l-4 border-slate-300">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{daysInMonth}</span>
                        <span className="text-[12px] text-slate-500 font-medium">Total Days</span>
                    </div>
                    <div className="flex flex-col pl-3 border-l-4 border-[#059669]">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{stats?.total_present || 0}</span>
                        <span className="text-[12px] text-slate-500 font-medium">Present</span>
                    </div>
                    <div className="flex flex-col pl-3 border-l-4 border-[#D97706]">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{stats?.total_late || 0}</span>
                        <span className="text-[12px] text-slate-500 font-medium">Late</span>
                    </div>
                    <div className="flex flex-col pl-3 border-l-4 border-[#8B5CF6]">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">0</span>
                        <span className="text-[12px] text-slate-500 font-medium">Half Day</span>
                    </div>
                    <div className="flex flex-col pl-3 border-l-4 border-[#3B82F6]">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{stats?.total_leave || 0}</span>
                        <span className="text-[12px] text-slate-500 font-medium">Leave</span>
                    </div>
                    <div className="flex flex-col pl-3 border-l-4 border-[#DC2626]">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{stats?.total_absent || 0}</span>
                        <span className="text-[12px] text-slate-500 font-medium">Absent</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-[6px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-[#ebebeb] bg-[#f9fbfb]">
                    {weekDays.map((day, idx) => (
                        <div key={idx} className="py-3 px-2 text-center text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-r border-[#ebebeb] last:border-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Body */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => {
                        const record = day ? attendanceMap[day] : null;
                        const isToday = day && new Date().getDate() === day && new Date().getMonth() + 1 === selectedMonth && new Date().getFullYear() === selectedYear;

                        return (
                            <div 
                                key={index} 
                                className={`min-h-[110px] p-2 border-b border-r border-[#ebebeb] flex flex-col relative transition-colors ${!day ? 'bg-slate-50' : 'bg-white hover:bg-[#f9fbfb]'}`}
                            >
                                {day && (
                                    <>
                                        <span className={`text-[13px] font-bold mb-2 flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-[#008060] text-white shadow-sm' : 'text-slate-700'}`}>
                                            {day}
                                        </span>
                                        
                                        {record ? (
                                            <div className={`mt-auto w-full text-center py-1.5 px-1 rounded-[4px] border ${getStatusStyle(record.status)} flex flex-col items-center justify-center`}>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{formatStatus(record.status)}</span>
                                                {record.remarks && (
                                                    <span className="text-[9px] font-medium opacity-80 mt-0.5 truncate w-full px-1" title={record.remarks}>
                                                        {record.remarks}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-auto flex items-center justify-center py-1">
                                                <span className="text-[10px] text-slate-300 font-medium">-</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </UserLayout>
    );
}
