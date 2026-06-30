import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Calendar, Clock, CheckCircle, Bell, BookOpen, ClipboardCheck, ArrowRight, UserCheck, FileText, GraduationCap 
} from 'lucide-react';

export default function TeacherOverview({ auth, schedule = [], notices = [], stats = {} }) {
    const user = auth.user;

    const quickActions = [
        { title: 'Mark Attendance', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', link: route('teacher.mark-attendance', { date: new Date().toISOString().split('T')[0] }) },
        { title: 'Exam Marks', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: route('teacher.marks.entry') },
        { title: 'My Routine', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', link: route('teacher.routine.index') },
        { title: 'Leave Application', icon: ClipboardCheck, color: 'text-orange-600', bg: 'bg-orange-50', link: '#' },
    ];

    const displayStats = [
        { title: 'Classes Today', value: stats.classes_today || '0', trend: 'Assigned for today', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Pending Tasks', value: stats.pending_tasks || '0', trend: 'Requires attention', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Total Classes', value: stats.total_classes || '0', trend: 'Weekly schedule', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayStats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-[6px] border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-slate-500 mb-1 truncate">{stat.title}</p>
                                <h3 className="text-2xl font-black text-slate-800 leading-tight">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 truncate uppercase tracking-wider">
                                    {stat.trend}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap size={16}/> Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} href={action.link} className="bg-white rounded-[6px] border border-slate-200 p-4 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-[#008060] hover:shadow-md transition-all group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                    <action.icon size={20} strokeWidth={2} />
                                </div>
                                <span className="text-[12px] font-bold text-slate-700 text-center">{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Schedule (Col span 2) */}
                    <div className="bg-white rounded-[6px] border border-slate-200 shadow-sm lg:col-span-2 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><Clock size={16} className="text-[#008060]"/> Your Classes Today</h2>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{schedule.length} Classes</span>
                        </div>
                        <div className="flex-1 relative ml-2 mt-2">
                            {schedule.length > 0 ? (
                                <>
                                    <div className="absolute top-2 bottom-2 left-[5px] w-[2px] bg-slate-100"></div>
                                    <div className="space-y-6">
                                        {schedule.map((item, idx) => (
                                            <div key={idx} className="relative pl-7 group">
                                                <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${
                                                    item.status === 'COMPLETED' ? 'bg-slate-300' : 
                                                    item.status === 'ONGOING' ? 'bg-[#008060] ring-4 ring-[#008060]/20' : 'bg-slate-200'
                                                }`}></div>
                                                <div className="flex flex-col gap-1 p-3 -mt-2 rounded-[6px] border border-transparent group-hover:border-slate-200 group-hover:bg-slate-50 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[14px] font-bold text-slate-800 leading-none">{item.subject}</p>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.statusColor}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-[12px] font-bold text-[#008060] flex items-center gap-1.5"><Clock size={12}/> {item.time}</p>
                                                        <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5 border-l border-slate-300 pl-3"><Users size={12}/> {item.room}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-[14px] font-bold text-slate-600">No classes scheduled for today.</p>
                                    <p className="text-[12px] text-slate-400 mt-1">Enjoy your free time!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notice Board */}
                    <div className="bg-white rounded-[6px] border border-slate-200 shadow-sm p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><Bell size={16} className="text-orange-500"/> Staff Notices</h2>
                            <Link href="#" className="text-[11px] font-bold text-[#008060] hover:underline flex items-center gap-1">View All <ArrowRight size={10}/></Link>
                        </div>
                        <div className="space-y-3 flex-1">
                            {notices.map((notice, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-[6px] border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                        <Bell size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-800 leading-tight mb-1">{notice.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{notice.time}</p>
                                    </div>
                                </div>
                            ))}
                            {notices.length === 0 && (
                                <div className="text-center py-6 text-slate-400 text-[12px] font-medium">
                                    No new notices.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
