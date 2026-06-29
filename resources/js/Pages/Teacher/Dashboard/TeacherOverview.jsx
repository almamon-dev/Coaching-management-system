import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Calendar, Clock, CheckCircle, Bell, BookOpen, ClipboardCheck 
} from 'lucide-react';

const schedule = [
    { time: '08:00 AM', subject: 'Mathematics (Class 10-A)', room: 'Room 101', status: 'COMPLETED', statusColor: 'bg-emerald-100 text-emerald-700' },
    { time: '09:45 AM', subject: 'Mathematics (Class 9-B)', room: 'Room 105', status: 'ONGOING', statusColor: 'bg-blue-100 text-blue-700' },
    { time: '11:30 AM', subject: 'Advanced Math (Class 11-A)', room: 'Room 205', status: 'UPCOMING', statusColor: 'bg-slate-100 text-slate-600' },
];

const notices = [
    { title: 'Staff Meeting at 4 PM', time: '2 hours ago' },
    { title: 'Submit Midterm Exam Questions', time: '1 day ago' },
];

const stats = [
    { title: 'Classes Today', value: '3', trend: '1 completed', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Pending Tasks', value: '2', trend: 'Due this week', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Students Present', value: '85%', trend: 'Average today', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Upcoming Events', value: '1', trend: 'Next week', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function TeacherOverview({ auth }) {
    const user = auth.user;

    return (
        <TeacherLayout user={user}>
            <Head title="Teacher Dashboard" />
            <div className="space-y-6 max-w-full mx-auto">
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
                            Welcome back, Teacher {user.name.split(' ')[0]}! <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-[13px] text-slate-500 mt-1">Here's your schedule and tasks for today.</p>
                    </div>
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
                    {/* Today's Schedule (Col span 2) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-2 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[14px] font-bold text-slate-800">Your Classes Today</h2>
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

                    {/* Notice Board */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Staff Notices</h2>
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
                </div>
            </div>
        </TeacherLayout>
    );
}
