import React, { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart3, TrendingUp, Users, CalendarDays, Activity, UserCheck } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function Analytics({ auth, stats, type = 'student' }) {
    const handleFilterChange = (newType) => {
        router.get(route('admin.attendance.analytics'), { type: newType }, { preserveState: true });
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
                Rate: total > 0 ? Math.round((present / total) * 100) : 0
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

    // Data for Pie Chart
    let pieData = [
        { name: 'Present', value: totalPresent, color: '#10b981' },
        { name: 'Absent', value: totalAbsent, color: '#f43f5e' },
        { name: 'Late', value: totalLate, color: '#f59e0b' },
        { name: 'On Leave', value: totalOnLeave, color: '#a855f7' }
    ].filter(item => item.value > 0); // Only show statuses that have data

    if (pieData.length === 0) {
        pieData = [{ name: 'No Data', value: 1, color: '#e2e8f0' }];
    }

    // Custom Tooltip for Area Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
                    <p className="font-semibold text-slate-800 mb-1">{label}</p>
                    <p className="text-sm font-medium text-emerald-600">
                        Attendance Rate: {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Attendance Analytics" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#008060]" />
                        Attendance Analytics (Last 30 Days)
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Analyze attendance trends and overall health metrics</p>
                </div>
                
                {/* Filter */}
                <div className="flex items-center rounded-[3px] border border-[#d1d1d1] bg-white overflow-hidden shadow-sm p-0.5">
                    <button 
                        onClick={() => handleFilterChange('student')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[2px] transition-colors ${type === 'student' ? 'bg-[#e6f2ef] text-[#008060]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Users size={14} /> Students
                    </button>
                    <button 
                        onClick={() => handleFilterChange('teacher')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[2px] transition-colors ${type === 'teacher' ? 'bg-[#e6f2ef] text-[#008060]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <UserCheck size={14} /> Teachers
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {/* Overall Attendance Card */}
                <div className="bg-white rounded-[6px] border border-[#ebebeb] border-l-[4px] border-l-emerald-500 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Overall Rate</span>
                            <div className="text-[28px] font-extrabold text-[#202223] mt-1 leading-none">{presentPct}%</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <TrendingUp size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="text-[12.5px] font-medium text-slate-500 flex items-center gap-1.5 mt-auto">
                        <Activity size={14} className="text-emerald-500" /> Average across 30 days
                    </div>
                </div>

                {/* Total Present Card */}
                <div className="bg-white rounded-[6px] border border-[#ebebeb] border-l-[4px] border-l-blue-500 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Present</span>
                            <div className="text-[28px] font-extrabold text-[#202223] mt-1 leading-none">{totalPresent}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <UserCheck size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="text-[12.5px] font-medium text-slate-500 flex items-center gap-1.5 mt-auto">
                        <Users size={14} className="text-blue-500" /> Total presences recorded
                    </div>
                </div>

                {/* Total Absent Card */}
                <div className="bg-white rounded-[6px] border border-[#ebebeb] border-l-[4px] border-l-rose-500 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Absent</span>
                            <div className="text-[28px] font-extrabold text-[#202223] mt-1 leading-none">{totalAbsent}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="text-[12.5px] font-medium text-slate-500 flex items-center gap-1.5 mt-auto">
                        <CalendarDays size={14} className="text-rose-500" /> Total absences recorded
                    </div>
                </div>

                {/* Late / On Leave Card */}
                <div className="bg-white rounded-[6px] border border-[#ebebeb] border-l-[4px] border-l-amber-500 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Late / Leave</span>
                            <div className="text-[28px] font-extrabold text-[#202223] mt-1 leading-none">{totalLate + totalOnLeave}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <CalendarDays size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="text-[12.5px] font-medium text-slate-500 flex items-center gap-1.5 mt-auto">
                        <Activity size={14} className="text-amber-500" /> Late or leave recorded
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Attendance Rate Trend (Area Chart) */}
                <div className="lg:col-span-2 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div className="px-5 py-4 border-b border-[#ebebeb]">
                        <h2 className="text-[15px] font-bold text-[#202223]">Overall Attendance Rate Trend</h2>
                    </div>
                    <div className="p-5 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 12, fill: '#64748b' }} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#64748b' }} 
                                        tickLine={false} 
                                        axisLine={false}
                                        domain={[0, 100]}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Rate" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRate)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                    </div>
                </div>

                {/* Overall Distribution (Pie Chart) */}
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div className="px-5 py-4 border-b border-[#ebebeb]">
                        <h2 className="text-[15px] font-bold text-[#202223]">Overall Distribution</h2>
                    </div>
                    <div className="p-5 h-[300px] w-full flex flex-col justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Breakdown Stacked Bar Chart */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <div className="px-5 py-4 border-b border-[#ebebeb]">
                    <h2 className="text-[15px] font-bold text-[#202223]">Daily Attendance Breakdown</h2>
                </div>
                
                <div className="p-5 h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 12, fill: '#64748b' }} 
                                    tickLine={false} 
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#64748b' }} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                                    labelStyle={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}
                                />
                                <Legend 
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: '500' }}
                                    iconType="circle"
                                />
                                <Bar dataKey="Present" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="On Leave" stackId="a" fill="#a855f7" />
                                <Bar dataKey="Absent" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    );
}
