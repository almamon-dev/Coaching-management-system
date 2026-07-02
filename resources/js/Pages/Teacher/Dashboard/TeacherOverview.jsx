import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Users, Calendar as CalendarIcon, Clock, CheckCircle, Bell, BookOpen, ClipboardCheck, ArrowRight, UserCheck, FileText, GraduationCap, ChevronRight 
} from 'lucide-react';

export default function TeacherOverview({ auth, weeklyRoutine = {}, today, notices = [], upcomingExams = [], stats = {}, attendances = [], attendanceStats = {}, filters = {} }) {
    const user = auth.user;

    const quickActions = [
        { title: 'Attendance', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', link: route('teacher.mark-attendance', { date: new Date().toISOString().split('T')[0] }) },
        { title: 'Marks', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: route('teacher.marks.entry') },
        { title: 'Routine', icon: CalendarIcon, color: 'text-purple-600', bg: 'bg-purple-50', link: route('teacher.routine.index') },
        { title: 'Leave', icon: ClipboardCheck, color: 'text-orange-600', bg: 'bg-orange-50', link: '#' },
    ];

    const displayStats = [
        { title: 'Classes Today', value: stats.classes_today || '0', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Pending Tasks', value: stats.pending_tasks || '0', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Total Classes', value: stats.total_classes || '0', icon: CalendarIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    // Attendance Calendar Logic
    const [selectedMonth, setSelectedMonth] = useState(filters.month || new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(filters.year || new Date().getFullYear());
    
    // Notice/Exam Tabs
    const [activeSidebarTab, setActiveSidebarTab] = useState('notices');

    // Flatten routine for full table
    const flatRoutine = [];
    const orderedDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    orderedDays.forEach(day => {
        if (weeklyRoutine[day]) {
            flatRoutine.push(...weeklyRoutine[day]);
        }
    });

    const handleFilterChange = (month, year) => {
        router.get(route('teacher.dashboard'), { month, year }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'present': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'absent': return 'bg-red-100 text-red-800 border-red-200';
            case 'late': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'on_leave':
            case 'half_day': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
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
    const currentMonthName = months.find(m => m.id === selectedMonth)?.name;

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const attendanceMap = {};
    if (attendances && attendances.length > 0) {
        attendances.forEach(record => {
            const d = new Date(record.date);
            attendanceMap[d.getDate()] = record;
        });
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <TeacherLayout user={user}>
            <Head title="Teacher Dashboard" />
            <div className="space-y-4 max-w-full mx-auto pb-4">
                
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
                            Welcome back, {user.name.split(' ')[0]}! <span className="text-lg">👋</span>
                        </h1>
                        <p className="text-[12px] text-slate-500 mt-0.5">Here's your schedule and overview for today.</p>
                    </div>
                    {/* Quick Actions in Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} href={action.link} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-slate-200 shadow-sm text-[12px] font-bold hover:shadow-md hover:border-slate-300 transition-all ${action.bg} ${action.color}`}>
                                <action.icon size={14} strokeWidth={2.5} />
                                {action.title}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Display Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {displayStats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-[6px] border border-slate-200 p-3 shadow-sm flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={18} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-500 mb-0.5 truncate">{stat.title}</p>
                                <h3 className="text-xl font-black text-slate-800 leading-none">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {/* Attendance Calendar (Takes up 2 columns) */}
                    <div className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden flex flex-col xl:col-span-2">
                        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5"><CalendarIcon size={16} className="text-[#008060]"/> Attendance</h2>
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
                                    <div className="flex items-center gap-1 text-[12px] text-slate-700 font-bold cursor-pointer hover:bg-slate-200 transition-colors bg-slate-100 py-1 px-2 rounded">
                                        {currentMonthName} {selectedYear}
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex flex-col pl-2 border-l-2 border-[#059669]">
                                    <span className="text-[13px] font-bold text-slate-800 leading-none">{attendanceStats?.total_present || 0}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">Present</span>
                                </div>
                                <div className="flex flex-col pl-2 border-l-2 border-[#D97706]">
                                    <span className="text-[13px] font-bold text-slate-800 leading-none">{attendanceStats?.total_late || 0}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">Late</span>
                                </div>
                                <div className="flex flex-col pl-2 border-l-2 border-[#3B82F6]">
                                    <span className="text-[13px] font-bold text-slate-800 leading-none">{attendanceStats?.total_leave || 0}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">Leave</span>
                                </div>
                                <div className="flex flex-col pl-2 border-l-2 border-[#DC2626]">
                                    <span className="text-[13px] font-bold text-slate-800 leading-none">{attendanceStats?.total_absent || 0}</span>
                                    <span className="text-[9px] text-slate-500 font-medium">Absent</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white">
                            <div className="grid grid-cols-7 border-b border-[#ebebeb] bg-slate-50">
                                {weekDays.map((day, idx) => (
                                    <div key={idx} className="py-1.5 px-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider border-r border-[#ebebeb] last:border-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {calendarDays.map((day, index) => {
                                    const record = day ? attendanceMap[day] : null;
                                    const isToday = day && new Date().getDate() === day && new Date().getMonth() + 1 === selectedMonth && new Date().getFullYear() === selectedYear;

                                    return (
                                        <div 
                                            key={index} 
                                            className={`min-h-[50px] p-1 border-b border-r border-[#ebebeb] flex flex-col relative ${!day ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50 transition-colors'}`}
                                        >
                                            {day && (
                                                <>
                                                    <span className={`text-[10px] font-bold mb-0.5 flex items-center justify-center w-4 h-4 rounded-full ${isToday ? 'bg-[#008060] text-white shadow-sm' : 'text-slate-600'}`}>
                                                        {day}
                                                    </span>
                                                    
                                                    {record ? (
                                                        <div className={`mt-auto w-full text-center py-0.5 px-0.5 rounded-[3px] border ${getStatusStyle(record.status)}`}>
                                                            <span className="text-[9px] font-bold uppercase tracking-tight leading-none block line-clamp-1">{formatStatus(record.status)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-auto flex items-center justify-center h-[12px]">
                                                            <span className="text-[9px] text-slate-200 font-medium">-</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Notices and Exams only, matching calendar height */}
                    <div className="flex flex-col gap-4 xl:col-span-1 h-full">
                        {/* Notice & Upcoming Events */}
                        <div className="bg-white rounded-[6px] border border-slate-200 shadow-sm flex flex-col h-full min-h-[280px]">
                            <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
                                <button 
                                    onClick={() => setActiveSidebarTab('notices')}
                                    className={`flex-1 text-[11px] font-bold py-2 border-b-2 transition-all ${activeSidebarTab === 'notices' ? 'border-[#008060] text-slate-800' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                                >
                                    Notices
                                </button>
                                <button 
                                    onClick={() => setActiveSidebarTab('exams')}
                                    className={`flex-1 text-[11px] font-bold py-2 border-b-2 transition-all ${activeSidebarTab === 'exams' ? 'border-[#008060] text-slate-800' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                                >
                                    Upcoming Exams
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                {activeSidebarTab === 'notices' && (
                                    <>
                                        {notices.map((notice, idx) => (
                                            <div key={idx} className="flex gap-2 items-start p-2 bg-slate-50/50 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer">
                                                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Bell size={10} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5 truncate">{notice.title}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{notice.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {notices.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 text-[11px] font-medium">
                                                No notices available.
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {activeSidebarTab === 'exams' && (
                                    <>
                                        {upcomingExams.map((exam, idx) => (
                                            <div key={idx} className="flex gap-2 items-center p-2 bg-slate-50/50 rounded border border-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                                                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex flex-col items-center justify-center shrink-0 leading-none">
                                                    <span className="text-[8px] uppercase font-bold">{exam.date.split(' ')[0]}</span>
                                                    <span className="text-[11px] font-black">{exam.date.split(' ')[1].replace(',', '')}</span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">{exam.title}</p>
                                                    <p className="text-[9px] font-bold text-[#008060] flex items-center gap-0.5">View Details <ChevronRight size={10}/></p>
                                                </div>
                                            </div>
                                        ))}
                                        {upcomingExams.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 text-[11px] font-medium">
                                                No upcoming exams.
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Class Routine Table */}
                <div className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4 max-h-[300px]">
                    <div className="p-3 border-b border-slate-200 shrink-0 bg-slate-50/50">
                        <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-1.5"><CalendarIcon size={16} className="text-[#008060]"/> Class Routine</h2>
                    </div>
                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left text-[12px] relative">
                            <thead className="bg-[#10b981] text-white sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Formal Code</th>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Course Title</th>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Class & Sec</th>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Day</th>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Room</th>
                                    <th className="py-2.5 px-4 font-bold whitespace-nowrap">Time Slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flatRoutine.map((item, idx) => (
                                    <tr key={item.id || idx} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
                                        <td className="py-2.5 px-4 font-medium text-slate-700">{item.code}</td>
                                        <td className="py-2.5 px-4 font-medium text-slate-700">{item.subject}</td>
                                        <td className="py-2.5 px-4 text-slate-600">{item.class_sec}</td>
                                        <td className="py-2.5 px-4 text-slate-600">{item.day}</td>
                                        <td className="py-2.5 px-4 text-slate-600">{item.room}</td>
                                        <td className="py-2.5 px-4 text-slate-600 flex items-center gap-1.5">
                                            <Clock size={12} className="text-slate-400" />
                                            {item.time}
                                        </td>
                                    </tr>
                                ))}
                                {flatRoutine.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-6 text-center text-slate-500 font-medium">
                                            No routine assigned.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar,
                .custom-scrollbar-x::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track,
                .custom-scrollbar-x::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb,
                .custom-scrollbar-x::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb,
                .custom-scrollbar-x:hover::-webkit-scrollbar-thumb {
                    background-color: #94a3b8;
                }
            `}</style>
        </TeacherLayout>
    );
}
