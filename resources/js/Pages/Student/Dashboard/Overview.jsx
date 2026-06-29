import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, Calendar, Medal, Clock, Bell, FileText, CheckCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';

// --- MOCK DATA FOR STUDENT ---

const schedule = [
    { time: '08:00 AM', subject: 'Mathematics', room: 'Room 101', status: 'COMPLETED', statusColor: 'bg-emerald-100 text-emerald-700' },
    { time: '09:45 AM', subject: 'English', room: 'Room 102', status: 'ONGOING', statusColor: 'bg-blue-100 text-blue-700' },
    { time: '11:30 AM', subject: 'Physics', room: 'Room 205', status: 'UPCOMING', statusColor: 'bg-slate-100 text-slate-600' },
    { time: '01:15 PM', subject: 'Chemistry', room: 'Room 201', status: 'UPCOMING', statusColor: 'bg-slate-100 text-slate-600' },
];

const notices = [
    { title: 'School will remain closed on May 26', time: '2 hours ago' },
    { title: 'Midterm Exam Routine Published', time: '1 day ago' },
    { title: 'Science Fair Registration Open', time: '2 days ago' },
];

const stats = [
    { title: 'Attendance Rate', value: '92%', trend: 'Good Standing', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Current Rank', value: '5th', trend: 'In Section A', icon: Medal, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Assignments Due', value: '2', trend: 'This Week', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Upcoming Exams', value: '1', trend: 'Next Month', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function Overview({ auth, academicPerformance, latestExamName }) {
    const user = auth.user;
    
    // Fallback data if no real exam performance exists
    const chartData = (academicPerformance && academicPerformance.length > 0) 
        ? academicPerformance 
        : [
            { subject: 'No Exams Yet', score: 0 }
        ];

    return (
        <StudentLayout user={user}>
            <Head title="Student Dashboard" />
            <div className="space-y-6 max-w-full mx-auto">
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
                            Welcome back, {user.name.split(' ')[0]}! <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-[13px] text-slate-500 mt-1">Here's an overview of your academic progress and schedule.</p>
                    </div>
                    <Link
                        href={route('user.results.index')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#008060] text-white text-sm font-bold rounded-md hover:bg-[#006e52] transition-colors shadow-sm"
                    >
                        <FileText size={16} />
                        View Full Results
                    </Link>
                </div>

                {/* Top Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-500 mb-0.5 truncate">{stat.title}</p>
                                <h3 className="text-xl font-bold text-slate-800 leading-tight">{stat.value}</h3>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 truncate">
                                    {stat.trend}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Academic Performance Chart (Col span 2) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-2 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Recent Exam Performance</h2>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">{latestExamName || 'Midterm Exam'}</span>
                        </div>
                        <div className="h-[250px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} ticks={[0, 20, 40, 60, 80, 100]} />
                                    <RechartsTooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Today's Schedule (Col span 1) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[14px] font-bold text-slate-800">Today's Classes</h2>
                            <Clock size={14} className="text-slate-400" />
                        </div>
                        <div className="flex-1 relative ml-1">
                            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-slate-100"></div>
                            <div className="space-y-6">
                                {schedule.map((item, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white ${
                                            item.status === 'COMPLETED' ? 'bg-slate-300' : 
                                            item.status === 'ONGOING' ? 'bg-[#008060] ring-4 ring-[#008060]/20' : 'bg-slate-200'
                                        }`}></div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[13px] font-bold text-slate-800 leading-none">{item.subject}</p>
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${item.statusColor}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 mt-1">{item.time}</p>
                                            <p className="text-[10px] text-slate-400">{item.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Notice Board */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Recent Notices</h2>
                            <Link href="#" className="text-[11px] font-semibold text-[#008060] hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {notices.map((notice, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <Bell size={16} className="text-[#008060] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-700 leading-tight mb-1">{notice.title}</p>
                                        <p className="text-[10px] font-semibold text-slate-400">{notice.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Quick Links</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href={route('user.results.index')} className="p-4 border border-slate-100 rounded-lg hover:border-[#008060] hover:bg-[#008060]/5 transition-all group flex flex-col items-center justify-center text-center gap-2">
                                <FileText className="text-slate-400 group-hover:text-[#008060] transition-colors" size={24} />
                                <span className="text-[12px] font-bold text-slate-700">Exam Results</span>
                            </Link>
                            <div className="p-4 border border-slate-100 rounded-lg hover:border-[#008060] hover:bg-[#008060]/5 transition-all group flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
                                <BookOpen className="text-slate-400 group-hover:text-[#008060] transition-colors" size={24} />
                                <span className="text-[12px] font-bold text-slate-700">Library Books</span>
                            </div>
                            <div className="p-4 border border-slate-100 rounded-lg hover:border-[#008060] hover:bg-[#008060]/5 transition-all group flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
                                <Calendar className="text-slate-400 group-hover:text-[#008060] transition-colors" size={24} />
                                <span className="text-[12px] font-bold text-slate-700">Class Routine</span>
                            </div>
                            <Link href={route('user.attendance')} className="p-4 border border-slate-100 rounded-lg hover:border-[#008060] hover:bg-[#008060]/5 transition-all group flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
                                <CheckCircle className="text-slate-400 group-hover:text-[#008060] transition-colors" size={24} />
                                <span className="text-[12px] font-bold text-slate-700">Attendance</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
