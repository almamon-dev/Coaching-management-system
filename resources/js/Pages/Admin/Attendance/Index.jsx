import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Calendar, ChevronDown, Users, CheckCircle2, UserX, Clock, 
    CalendarCheck, Download, Save, ChevronRight, PieChart as PieChartIcon,
    BookOpen
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const initialStudents = [
    { id: 1, roll: '1', name: 'Ahmed Rahman', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Ahmed+Rahman&background=0D8ABC&color=fff' },
    { id: 2, roll: '2', name: 'Sakib Hossain', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Sakib+Hossain&background=0D8ABC&color=fff' },
    { id: 3, roll: '3', name: 'Mehedi Hasan', status: 'Absent', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Mehedi+Hasan&background=0D8ABC&color=fff' },
    { id: 4, roll: '4', name: 'Nusrat Jahan', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Nusrat+Jahan&background=0D8ABC&color=fff' },
    { id: 5, roll: '5', name: 'Tanha Islam', status: 'Late', time: '09:55 AM', remark: 'Reached at 09:55 AM', avatar: 'https://ui-avatars.com/api/?name=Tanha+Islam&background=0D8ABC&color=fff' },
    { id: 6, roll: '6', name: 'Raihan Kabir', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Raihan+Kabir&background=0D8ABC&color=fff' },
    { id: 7, roll: '7', name: 'Fahim Ahmed', status: 'Absent', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Fahim+Ahmed&background=0D8ABC&color=fff' },
    { id: 8, roll: '8', name: 'Asif Mahmud', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Asif+Mahmud&background=0D8ABC&color=fff' },
];

export default function Index({ auth }) {
    const [attendanceList, setAttendanceList] = useState(initialStudents);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
    
    const Layout = auth?.user?.user_type === 'admin' ? AdminLayout : UserLayout;

    // Computed Stats
    const stats = useMemo(() => {
        const total = attendanceList.length;
        const present = attendanceList.filter(s => s.status === 'Present').length;
        const absent = attendanceList.filter(s => s.status === 'Absent').length;
        const late = attendanceList.filter(s => s.status === 'Late').length;

        return {
            total,
            present,
            absent,
            late,
            presentPct: total ? ((present / total) * 100).toFixed(2) : '0.00',
            absentPct: total ? ((absent / total) * 100).toFixed(2) : '0.00',
            latePct: total ? ((late / total) * 100).toFixed(2) : '0.00'
        };
    }, [attendanceList]);

    const chartData = [
        { name: 'Present', value: stats.present, color: '#10b981' },
        { name: 'Absent', value: stats.absent, color: '#ef4444' },
        { name: 'Late', value: stats.late, color: '#f59e0b' }
    ];

    // Handlers
    const handleStatusChange = (id, newStatus) => {
        setAttendanceList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleRemarkChange = (id, val) => {
        setAttendanceList(prev => prev.map(s => s.id === id ? { ...s, remark: val } : s));
    };

    const handleQuickAction = (action) => {
        if (action === 'Clear') {
            setAttendanceList(prev => prev.map(s => ({ ...s, status: '' })));
        } else {
            setAttendanceList(prev => prev.map(s => ({ ...s, status: action })));
        }
    };

    const handleSelectedBulkAction = (action) => {
        if (selectedIds.length === 0) return alert('Please select at least one student.');
        setAttendanceList(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, status: action } : s));
        setSelectedIds([]);
        setBulkDropdownOpen(false);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === attendanceList.length) setSelectedIds([]);
        else setSelectedIds(attendanceList.map(s => s.id));
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <Layout user={auth?.user}>
            <Head title="Mark Attendance" />

            <div className="min-h-screen bg-[#f8fafc] pb-10 font-sans">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">Mark Attendance</h1>
                        <p className="text-slate-500 text-[12px] font-medium">Select class, date and mark attendance</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' })}
                            <ChevronDown size={14} className="text-slate-400 ml-1" />
                        </div>
                    </div>
                </div>

                {/* --- TOP FILTERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <FilterCard 
                        icon={Users} iconColor="text-purple-600" iconBg="bg-purple-50"
                        label="Select Class" value="Class 10-B"
                    />
                    <FilterCard 
                        icon={BookOpen} iconColor="text-emerald-600" iconBg="bg-emerald-50"
                        label="Select Subject" value="Mathematics"
                    />
                    <FilterCard 
                        icon={Clock} iconColor="text-orange-500" iconBg="bg-orange-50"
                        label="Select Period" value="2nd Period (09:45 AM)"
                    />
                </div>

                {/* --- SUMMARY CARDS --- */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                    <SummaryCard 
                        icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50"
                        title="Total Students" value={stats.total} subtitle=""
                    />
                    <SummaryCard 
                        icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50"
                        title="Present" value={stats.present} subtitle={`${stats.presentPct}%`}
                    />
                    <SummaryCard 
                        icon={UserX} iconColor="text-red-500" iconBg="bg-red-50"
                        title="Absent" value={stats.absent} subtitle={`${stats.absentPct}%`}
                    />
                    <SummaryCard 
                        icon={Calendar} iconColor="text-amber-500" iconBg="bg-amber-50"
                        title="Late" value={stats.late} subtitle={`${stats.latePct}%`}
                    />
                    <SummaryCard 
                        icon={CalendarCheck} iconColor="text-purple-600" iconBg="bg-purple-50"
                        title="Marked By" value={auth?.user?.name || 'Admin'} subtitle="Today" isText
                    />
                </div>

                {/* --- MAIN TABLE SECTION --- */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-5 flex flex-col">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Student Attendance
                            {selectedIds.length > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]">{selectedIds.length} selected</span>}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button 
                                    onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-blue-600 text-[11.5px] font-bold rounded hover:bg-slate-100 transition-colors"
                                >
                                    Bulk Actions <ChevronDown size={13} />
                                </button>
                                {bulkDropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-10">
                                        <button onClick={() => handleSelectedBulkAction('Present')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-emerald-600 hover:bg-slate-50">Mark Present</button>
                                        <button onClick={() => handleSelectedBulkAction('Absent')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-slate-50">Mark Absent</button>
                                        <button onClick={() => handleSelectedBulkAction('Late')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-amber-600 hover:bg-slate-50">Mark Late</button>
                                    </div>
                                )}
                            </div>
                            <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 text-blue-600 text-[11.5px] font-bold rounded hover:bg-slate-50 transition-colors">
                                <Download size={13} className="rotate-180" /> Import
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11.5px] font-bold rounded hover:bg-blue-700 shadow-sm transition-colors">
                                <Save size={13} /> Save
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white">
                                    <th className="py-2 pl-4 pr-3 w-[40px]">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.length === attendanceList.length && attendanceList.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                        />
                                    </th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[80px]">Roll No.</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[220px]">Student Name</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[140px]">Status</th>
                                    <th className="py-2 pr-4 pl-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remarks (Optional)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceList.map((student) => (
                                    <tr key={student.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(student.id) ? 'bg-blue-50/30' : ''}`}>
                                        <td className="py-2.5 pl-4 pr-3">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(student.id)}
                                                onChange={() => toggleSelect(student.id)}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-[12px] font-bold text-slate-700">{student.roll}</td>
                                        <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <img src={student.avatar} alt={student.name} className="w-6 h-6 rounded-full shadow-sm" />
                                                <span className="text-[12px] font-bold text-slate-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <StatusDropdown status={student.status} onChange={(val) => handleStatusChange(student.id, val)} />
                                        </td>
                                        <td className="py-2.5 pr-4 pl-3">
                                            <input 
                                                type="text" 
                                                value={student.remark}
                                                onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                placeholder="Add remark" 
                                                className={`w-full border border-slate-200 rounded px-2.5 py-1 text-[11.5px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${student.remark ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- BOTTOM ROW --- */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
                    {/* Attendance Summary */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h2 className="text-[13px] font-bold text-slate-800 mb-4">Attendance Summary</h2>
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-[110px] h-[110px] shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={42} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[16px] font-black text-slate-900 leading-none">{stats.presentPct}%</span>
                                    <span className="text-[9px] text-slate-500 font-bold mt-1 tracking-tight leading-none text-center">Overall<br/>Attendance</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[11.5px] font-semibold text-slate-700">Present</span>
                                    </div>
                                    <span className="text-[11.5px] text-slate-500 font-medium">{stats.present} ({stats.presentPct}%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-[11.5px] font-semibold text-slate-700">Absent</span>
                                    </div>
                                    <span className="text-[11.5px] text-slate-500 font-medium">{stats.absent} ({stats.absentPct}%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-[11.5px] font-semibold text-slate-700">Late</span>
                                    </div>
                                    <span className="text-[11.5px] text-slate-500 font-medium">{stats.late} ({stats.latePct}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h2 className="text-[13px] font-bold text-slate-800 mb-3">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                            <QuickActionCard 
                                icon={CheckCircle2} iconColor="text-emerald-600" bg="bg-emerald-50" hoverBg="hover:bg-emerald-100" border="border-emerald-100"
                                label="Mark All Present" onClick={() => handleQuickAction('Present')}
                            />
                            <QuickActionCard 
                                icon={UserX} iconColor="text-red-500" bg="bg-red-50" hoverBg="hover:bg-red-100" border="border-red-100"
                                label="Mark All Absent" onClick={() => handleQuickAction('Absent')}
                            />
                            <QuickActionCard 
                                icon={Clock} iconColor="text-amber-500" bg="bg-amber-50" hoverBg="hover:bg-amber-100" border="border-amber-100"
                                label="Mark All Late" onClick={() => handleQuickAction('Late')}
                            />
                            <QuickActionCard 
                                icon={Calendar} iconColor="text-purple-600" bg="bg-purple-50" hoverBg="hover:bg-purple-100" border="border-purple-100"
                                label="Clear All" onClick={() => handleQuickAction('Clear')}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}

// --- SUB-COMPONENTS ---

function FilterCard({ icon: Icon, iconColor, iconBg, label, value }) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor} group-hover:scale-105 transition-transform`}>
                    <Icon size={16} />
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-[12.5px] font-bold text-slate-800">{value}</p>
                </div>
            </div>
            <ChevronDown size={15} className="text-blue-500 group-hover:-translate-y-0.5 transition-transform" />
        </div>
    );
}

function SummaryCard({ icon: Icon, iconColor, iconBg, title, value, subtitle, isText }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-[100px]">
            <div className="flex items-start justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
                    <Icon size={16} strokeWidth={2.5} />
                </div>
                {subtitle && !isText && (
                    <span className="text-[11px] font-bold text-slate-600">{subtitle}</span>
                )}
            </div>
            <div className="mt-2">
                <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{title}</p>
                <div className="flex items-end justify-between">
                    <p className={`font-black text-slate-800 ${isText ? 'text-[14px]' : 'text-[22px] leading-none'}`}>{value}</p>
                    {isText && <span className="text-[10px] font-semibold text-slate-400">{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}

function StatusDropdown({ status, onChange }) {
    let bg, text, border;
    if (status === 'Present') { bg = 'bg-emerald-50'; text = 'text-emerald-600'; border = 'border-emerald-100'; }
    else if (status === 'Absent') { bg = 'bg-red-50'; text = 'text-red-500'; border = 'border-red-100'; }
    else if (status === 'Late') { bg = 'bg-amber-50'; text = 'text-amber-600'; border = 'border-amber-100'; }
    else { bg = 'bg-slate-50'; text = 'text-slate-500'; border = 'border-slate-200'; }

    return (
        <div className={`relative flex items-center justify-between w-[110px] px-2.5 py-1.5 rounded border ${bg} ${border} cursor-pointer hover:brightness-95 transition-all`}>
            <span className={`text-[11px] font-bold ${text}`}>{status || 'Select'}</span>
            <ChevronDown size={12} className={text} />
            <select 
                value={status} 
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
                <option value="">Select</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
            </select>
        </div>
    );
}

function QuickActionCard({ icon: Icon, iconColor, bg, hoverBg, border, label, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border ${border} ${bg} ${hoverBg} transition-colors group h-[95px]`}
        >
            <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${iconColor} mb-2.5 group-hover:scale-110 transition-transform`}>
                <Icon size={18} strokeWidth={2.5} />
            </div>
            <p className={`text-[11.5px] font-bold ${iconColor} text-center leading-snug px-1`}>{label}</p>
        </button>
    );
}
