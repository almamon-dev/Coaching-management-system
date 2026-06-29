import React, { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Users, Clock3, CalendarDays, Activity, UserCheck, ChevronDown, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Analytics({ auth, stats, type = 'student', period = '30_days' }) {
    const handleFilterChange = (key, value) => {
        router.get(route('admin.attendance.analytics'), { type, period, [key]: value }, { preserveState: true });
    };

    // Process data for charts
    const chartData = useMemo(() => {
        return stats.map(stat => {
            const dateObj = new Date(stat.date);
            const present = parseInt(stat.present);
            const absent = parseInt(stat.absent);
            const late = parseInt(stat.late);
            const onLeave = parseInt(stat.on_leave);
            const total = present + absent + late + onLeave;
            
            return {
                name: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Present: present,
                Absent: absent,
                Late: late,
                'On Leave': onLeave,
                value: total > 0 ? Math.round((present / total) * 100) : 0, // value for line chart
                day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }) // day for x axis
            };
        });
    }, [stats]);

    // Calculate overall summaries
    const totalPresent = stats.reduce((acc, curr) => acc + parseInt(curr.present), 0);
    const totalAbsent = stats.reduce((acc, curr) => acc + parseInt(curr.absent), 0);
    const totalLate = stats.reduce((acc, curr) => acc + parseInt(curr.late), 0);
    const totalOnLeave = stats.reduce((acc, curr) => acc + parseInt(curr.on_leave), 0);
    const grandTotal = totalPresent + totalAbsent + totalLate + totalOnLeave;
    
    const presentPct = grandTotal > 0 ? Math.round((totalPresent / grandTotal) * 100) : 0;
    const absentPct = grandTotal > 0 ? Math.round((totalAbsent / grandTotal) * 100) : 0;
    const latePct = grandTotal > 0 ? Math.round((totalLate / grandTotal) * 100) : 0;
    const leavePct = grandTotal > 0 ? Math.round((totalOnLeave / grandTotal) * 100) : 0;

    // Data for Pie Chart
    let pieData = [
        { name: 'Present', value: presentPct, color: '#10b981' },
        { name: 'Absent', value: absentPct, color: '#ef4444' },
        { name: 'Late', value: latePct, color: '#f59e0b' },
        { name: 'On Leave', value: leavePct, color: '#8b5cf6' }
    ].filter(item => item.value > 0); 

    if (pieData.length === 0) {
        pieData = [{ name: 'No Data', value: 100, color: '#e2e8f0' }];
    }

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Attendance Analytics" />

            <div className="min-h-screen bg-[#f8fafc] pb-10">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[22px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Attendance Analytics
                        </h1>
                        <p className="text-slate-500 text-[13px] mt-1 font-medium">Analyze attendance trends and overall health metrics.</p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Period Filter (The one that wasn't working before!) */}
                        <div className="relative">
                            <select 
                                value={period} 
                                onChange={(e) => handleFilterChange('period', e.target.value)}
                                className="appearance-none flex items-center gap-1 text-[13px] font-bold text-slate-700 bg-white pl-3 pr-8 py-1.5 rounded-md cursor-pointer border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors focus:ring-0 focus:outline-none"
                            >
                                <option value="7_days">Last 7 Days</option>
                                <option value="30_days">Last 30 Days</option>
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                            </select>
                        </div>
                        
                        {/* Role Filter */}
                        <div className="flex items-center rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm p-1">
                            <button 
                                onClick={() => handleFilterChange('type', 'student')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 text-[12.5px] font-bold rounded transition-colors ${type === 'student' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Users size={14} /> Students
                            </button>
                            <button 
                                onClick={() => handleFilterChange('type', 'teacher')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 text-[12.5px] font-bold rounded transition-colors ${type === 'teacher' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <UserCheck size={14} /> Teachers
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- STATS ROW (4 CARDS) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard 
                        title="Overall Rate" value={`${presentPct}%`} 
                        icon={Clock3} iconBg="bg-blue-50" iconColor="text-blue-600"
                        trend={presentPct >= 80 ? "up" : "down"} trendValue="Avg." trendText="for period"
                    />
                    <StatCard 
                        title="Total Present" value={totalPresent.toString()} 
                        icon={UserCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600"
                        trend="up" trendValue={`${presentPct}%`} trendText="of total days"
                    />
                    <StatCard 
                        title="Total Absent" value={totalAbsent.toString()} 
                        icon={Users} iconBg="bg-red-50" iconColor="text-red-600"
                        trend="down" trendValue={`${absentPct}%`} trendText="of total days"
                    />
                    <StatCard 
                        title="Late / Leave" value={(totalLate + totalOnLeave).toString()} 
                        icon={CalendarDays} iconBg="bg-orange-50" iconColor="text-orange-600"
                        trend="down" trendValue={`${latePct + leavePct}%`} trendText="of total days"
                    />
                </div>

                {/* --- CHARTS ROW 1: Trend & Distribution --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                    
                    {/* Attendance Trend (Line Chart) - Takes 2 Columns */}
                    <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[15px] font-bold text-slate-800">Attendance Trend</h2>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="mb-2">
                                <p className="text-[13px] text-slate-500 font-medium">Average Attendance</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[32px] font-black text-slate-900 leading-none tracking-tight">{presentPct}%</span>
                                    {presentPct >= 80 ? (
                                        <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                            <ArrowUpRight size={12} className="mr-0.5" /> Healthy
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-[11px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                            <ArrowDownRight size={12} className="mr-0.5" /> Needs Attention
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-[220px] w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} minTickGap={20} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="value" name="Attendance Rate" stroke="#3b82f6" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                    {/* Overall Distribution (Donut Chart) - Takes 1 Column */}
                    <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[15px] font-bold text-slate-800">Status Distribution</h2>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                            <div className="h-[180px] w-[180px] relative mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            cx="50%" cy="50%" 
                                            innerRadius={60} 
                                            outerRadius={85} 
                                            paddingAngle={2} 
                                            dataKey="value" 
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', padding: '6px 10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[22px] font-black text-slate-800 tracking-tight">{presentPct}%</span>
                                    <span className="text-[11px] text-slate-500 font-medium mt-0.5">Present</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full px-2 mt-2">
                                {pieData.map((item, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[12px] text-slate-500 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-[14px] text-slate-800 font-bold pl-5">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CHARTS ROW 2: Breakdown --- */}
                {/* Daily Breakdown (Stacked Bar) - Takes Full Width so it is readable */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[15px] font-bold text-slate-800">Daily Attendance Breakdown (Counts)</h2>
                    </div>
                    
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} minTickGap={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} iconType="circle" />
                                <Bar dataKey="Present" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={20} />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="On Leave" stackId="a" fill="#8b5cf6" />
                                <Bar dataKey="Absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend, trendValue, trendText }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">{title}</p>
                    <h3 className="text-[22px] font-black text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
                {trend === 'up' ? (
                    <span className="flex items-center text-[10px] font-bold text-emerald-600">
                        <ArrowUpRight size={12} className="mr-0.5" /> {trendValue}
                    </span>
                ) : (
                    <span className="flex items-center text-[10px] font-bold text-red-600">
                        <ArrowDownRight size={12} className="mr-0.5" /> {trendValue}
                    </span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">{trendText}</span>
            </div>
        </div>
    );
}
