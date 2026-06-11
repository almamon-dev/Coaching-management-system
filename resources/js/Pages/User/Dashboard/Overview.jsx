import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, GraduationCap, UserCheck, Wallet, Calendar, Bell, 
    ChevronDown, FileText, BookOpen, CheckCircle, Clock 
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA ---

const stats = [
    { title: 'Total Students', value: '1,250', trend: '▲ 3.2% this month', trendUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Teachers', value: '85', trend: '▲ 1.2% this month', trendUp: true, icon: GraduationCap, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { title: "Today's Attendance", value: '94%', trend: '▲ 2.6% from yesterday', trendUp: true, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Pending Fees', value: '৳ 2.5M', trend: '▼ 4.3% from last month', trendUp: false, icon: Wallet, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Upcoming Exams', value: '8', trend: 'This month', trendUp: null, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'New Notices', value: '5', trend: 'Unread', trendUp: null, icon: Bell, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

const attendanceTrend = [
    { day: 'Sun', value: 65 }, { day: 'Mon', value: 85 }, { day: 'Tue', value: 75 },
    { day: 'Wed', value: 82 }, { day: 'Thu', value: 90 }, { day: 'Fri', value: 95 }, { day: 'Sat', value: 70 }
];

const classAttendance = [
    { name: 'Class 10-A', value: 95, color: '#3b82f6' },
    { name: 'Class 10-B', value: 93, color: '#10b981' },
    { name: 'Class 9-A', value: 96, color: '#f59e0b' },
    { name: 'Class 9-B', value: 92, color: '#8b5cf6' },
    { name: 'Others', value: 91, color: '#94a3b8' },
];

const feeCollection = [
    { name: 'Collected', value: 70, color: '#10b981', amount: '৳ 6.0M (70%)' },
    { name: 'Pending', value: 25, color: '#f59e0b', amount: '৳ 2.5M (25%)' },
    { name: 'Overdue', value: 5, color: '#ef4444', amount: '৳ 500K (5%)' },
];

const schedule = [
    { time: '08:00 AM', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 101', status: 'COMPLETED', statusColor: 'bg-emerald-100 text-emerald-700' },
    { time: '09:45 AM', subject: 'English', class: 'Class 10-B', room: 'Room 102', status: 'ONGOING', statusColor: 'bg-blue-100 text-blue-700' },
    { time: '11:30 AM', subject: 'Physics', class: 'Class 9-A', room: 'Room 205', status: 'UPCOMING', statusColor: 'bg-slate-100 text-slate-600' },
    { time: '01:15 PM', subject: 'Chemistry', class: 'Class 9-B', room: 'Room 201', status: 'UPCOMING', statusColor: 'bg-slate-100 text-slate-600' },
];

const tasks = [
    { title: 'Grade Midterm Papers', time: 'Today, 5:00 PM', priority: 'HIGH', priorityColor: 'text-red-500', icon: FileText, iconColor: 'text-emerald-500 bg-emerald-50' },
    { title: 'Submit Weekly Lesson Plan', time: 'Tomorrow', priority: 'MEDIUM', priorityColor: 'text-orange-500', icon: BookOpen, iconColor: 'text-orange-500 bg-orange-50' },
    { title: 'Review Leave Applications', time: 'Tomorrow', priority: 'LOW', priorityColor: 'text-green-500', icon: CheckCircle, iconColor: 'text-cyan-500 bg-cyan-50' },
    { title: 'Update Student Records', time: 'May 25, 2024', priority: 'MEDIUM', priorityColor: 'text-blue-500', icon: Users, iconColor: 'text-blue-500 bg-blue-50' },
];

const examResults = [
    { class: 'Class 10-A', exam: 'Midterm Exam', score: '87%', topper: 'John Doe' },
    { class: 'Class 10-B', exam: 'Midterm Exam', score: '83%', topper: 'Jane Smith' },
    { class: 'Class 9-A', exam: 'Midterm Exam', score: '89%', topper: 'Mike Johnson' },
    { class: 'Class 9-B', exam: 'Midterm Exam', score: '81%', topper: 'Sara Khan' },
];

const notices = [
    { title: 'School will remain closed on May 26', time: '2 hours ago' },
    { title: 'Parent Teacher Meeting on May 30', time: '5 hours ago' },
    { title: 'Midterm Exam Routine Published', time: '1 day ago' },
    { title: 'Science Fair Registration Open', time: '2 days ago' },
    { title: 'Library Book Submission Notice', time: '3 days ago' },
];

const events = [
    { date: '25', month: 'MAY', title: 'Science Fair', time: '10:00 AM - 02:00 PM' },
    { date: '30', month: 'MAY', title: 'Parent Teacher Meeting', time: '09:00 AM - 12:00 PM' },
    { date: '05', month: 'JUN', title: 'Midterm Exams Start', time: 'All Day' },
    { date: '10', month: 'JUN', title: 'School Picnic', time: '08:00 AM - 05:00 PM' },
];

const activities = [
    { user: 'John Doe', action: 'Submitted assignment', time: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
    { user: 'Jane Smith', action: 'Paid fees ৳ 15,000', time: '15 min ago', icon: Wallet, color: 'text-orange-500 bg-orange-50' },
    { user: 'Mike Johnson', action: 'Marked present', time: '30 min ago', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random' },
    { user: 'Sara Khan', action: 'Submitted assignment', time: '1 hour ago', icon: FileText, color: 'text-emerald-500 bg-emerald-50' },
    { user: 'System', action: 'New notice published', time: '2 hours ago', icon: Bell, color: 'text-blue-500 bg-blue-50' },
    { user: 'Admin', action: 'Added new student', time: '3 hours ago', avatar: 'https://ui-avatars.com/api/?name=Admin&background=random' },
];

export default function Overview({ auth }) {
    const user = auth.user;

    return (
        <UserLayout user={user}>
            <Head title="Dashboard Overview" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
                        Good Morning, {user.name.split(' ')[0]}! <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-[13px] text-slate-500 mt-1">Here's what's happening at School SMS today.</p>
                </div>

                {/* Top Stat Cards (Row 1) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-500 mb-0.5 truncate">{stat.title}</p>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">{stat.value}</h3>
                                <p className={`text-[9px] font-bold mt-1 truncate ${
                                    stat.trendUp === true ? 'text-emerald-500' : 
                                    stat.trendUp === false ? 'text-red-500' : 'text-slate-400'
                                }`}>
                                    {stat.trend}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Middle Grid (Row 2) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Attendance Overview (Col span 6) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-6 p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[14px] font-bold text-slate-800">Attendance Overview</h2>
                            <button className="text-[11px] font-semibold text-slate-600 border border-slate-200 rounded px-2 py-1 flex items-center gap-1 hover:bg-slate-50">
                                This Week <ChevronDown size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Line Chart */}
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 mb-1">Average Attendance</p>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-2xl font-bold text-slate-800">94%</h3>
                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">▲ 2.6%</span>
                                </div>
                                <div className="h-[140px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={attendanceTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={5} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} ticks={[0, 25, 50, 75, 100]} />
                                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}/>
                                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            {/* Pie Chart */}
                            <div className="flex flex-col items-center">
                                <p className="text-[11px] font-bold text-slate-500 self-start mb-2">Class-wise Attendance</p>
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-[120px] h-[120px] shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={classAttendance} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                                                    {classAttendance.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col gap-1.5 w-full">
                                        {classAttendance.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-[10px]">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                                    <span className="text-slate-600 font-medium">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-800">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule (Col span 3) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-3 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h2 className="text-[14px] font-bold text-slate-800">Today's Schedule</h2>
                            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View Full</button>
                        </div>
                        <div className="flex-1 relative ml-1">
                            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-slate-200"></div>
                            <div className="space-y-5">
                                {schedule.map((item, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                                            item.status === 'COMPLETED' ? 'bg-slate-300' : 
                                            item.status === 'ONGOING' ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-200'
                                        }`}></div>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 mb-0.5">{item.time}</p>
                                                <p className="text-[12px] font-bold text-slate-800">{item.subject} <span className="font-medium text-slate-500 text-[10px]">({item.class})</span></p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{item.room}</p>
                                            </div>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tasks & Reminders (Col span 3) */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm lg:col-span-3 p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h2 className="text-[14px] font-bold text-slate-800">Tasks & Reminders</h2>
                            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                        </div>
                        <div className="flex-1 space-y-4">
                            {tasks.map((task, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${task.iconColor}`}>
                                        <task.icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-slate-800 truncate leading-tight">{task.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{task.time}</p>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase ${task.priorityColor}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Grid (Row 3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Fee Collection Overview */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <h2 className="text-[14px] font-bold text-slate-800 mb-6">Fee Collection Overview</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-[110px] h-[110px] relative shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={feeCollection} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                                            {feeCollection.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[14px] font-bold text-slate-800">৳ 8.5M</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Total Fees</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-1">
                                {feeCollection.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: item.color}}></div>
                                            <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 ml-3 leading-tight">{item.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Exam Results */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Recent Exam Results</h2>
                            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-2 text-[10px] font-bold text-slate-800 uppercase">Class</th>
                                        <th className="pb-2 text-[10px] font-bold text-slate-800 uppercase">Exam</th>
                                        <th className="pb-2 text-[10px] font-bold text-slate-800 uppercase text-center">Avg Score</th>
                                        <th className="pb-2 text-[10px] font-bold text-slate-800 uppercase text-right">Topper</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px]">
                                    {examResults.map((res, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0">
                                            <td className="py-2.5 font-semibold text-slate-600">{res.class}</td>
                                            <td className="py-2.5 text-slate-500">{res.exam}</td>
                                            <td className="py-2.5 font-bold text-emerald-500 text-center">{res.score}</td>
                                            <td className="py-2.5 text-slate-700 text-right">{res.topper}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Notices */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Recent Notices</h2>
                            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                        </div>
                        <div className="space-y-4">
                            {notices.map((notice, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <Bell size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[12px] font-semibold text-slate-700 leading-tight mb-0.5">{notice.title}</p>
                                        <p className="text-[10px] text-slate-400">{notice.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-bold text-slate-800">Upcoming Events</h2>
                            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View Calendar</button>
                        </div>
                        <div className="space-y-3.5">
                            {events.map((event, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-[9px] font-bold text-red-500 uppercase leading-none">{event.month}</span>
                                        <span className="text-[14px] font-bold text-slate-800 leading-none mt-0.5">{event.date}</span>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight mb-0.5">{event.title}</p>
                                        <p className="text-[10px] text-slate-400">{event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Recent Activities (Bottom Row) */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-[14px] font-bold text-slate-800 mb-4">Recent Activities</h2>
                    <div className="flex flex-wrap gap-6 items-center">
                        {activities.map((act, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                {act.avatar ? (
                                    <img src={act.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                                ) : (
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${act.color}`}>
                                        <act.icon size={14} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[11px] font-bold text-slate-800 leading-tight">
                                        {act.user} <span className="font-normal text-slate-500 ml-0.5">{act.action}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </UserLayout>
    );
}
