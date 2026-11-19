import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Users, UserCheck, BookOpen, FolderKanban, Calendar, ClipboardCheck,
    Wallet, TrendingDown, TrendingUp, ArrowUpRight, Plus, Receipt, Layers,
    Clock, CheckCircle, AlertCircle, MessageSquare
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';

export default function Dashboard({ stats, todaysClasses = [], subjectSummary = [], batchDistribution = [], financialTrend = [], recentInquiries = [] }) {
    const { settings } = usePage().props;
    const coachingMode = settings?.coaching_mode || 'single';
    const isMultiTeacher = coachingMode === 'multi';
    const [switching, setSwitching] = useState(false);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            let h = parseInt(parts[0], 10);
            const m = parts[1];
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
        }
        return timeStr;
    };

    const toggleMode = () => {
        if (switching) return;
        setSwitching(true);
        router.post(route('admin.settings.toggle-mode'), {
            mode: isMultiTeacher ? 'single' : 'multi'
        }, {
            preserveScroll: true,
            onFinish: () => setSwitching(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Operational Dashboard" />

            {/* HEADER ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Operational Dashboard</h1>

                        {/* Interactive Mode Switch */}
                        <div
                            onClick={toggleMode}
                            className="flex items-center gap-2 bg-white hover:bg-slate-50 px-3 py-1 rounded-full border border-slate-200/90 cursor-pointer select-none transition-all shadow-2xs group"
                            title="Click to toggle Single / Multi Teacher Mode"
                        >
                            <span className="text-[11px] font-bold flex items-center gap-1.5">
                                {isMultiTeacher ? (
                                    <>
                                        <Users size={13} className="text-indigo-600" />
                                        <span className="text-indigo-700">Multi-Teacher Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <UserCheck size={13} className="text-emerald-600" />
                                        <span className="text-emerald-700">Single Teacher Mode</span>
                                    </>
                                )}
                            </span>

                            {/* Green Switch */}
                            <div
                                role="switch"
                                aria-checked={isMultiTeacher}
                                className={`relative inline-flex h-4.5 w-8 shrink-0 rounded-full border border-transparent transition-colors duration-200 bg-emerald-600 ${switching ? 'opacity-50' : ''
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 mt-0.5 ml-0.5 ${isMultiTeacher ? 'translate-x-3.5' : 'translate-x-0'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {isMultiTeacher
                            ? 'Live monitoring of multi-teacher coaching classes, batches, and operational health.'
                            : 'Manage all coaching subjects, student batches, attendance, exams & fee collections.'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={route('admin.admissions.create')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-xs rounded-[4px] shadow-xs transition-all cursor-pointer"
                    >
                        <Plus size={14} /> New Admission
                    </Link>
                    <Link
                        href={route('admin.attendance.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-[4px] shadow-2xs transition-all cursor-pointer"
                    >
                        <ClipboardCheck size={14} className="text-[#16a34a]" /> Attendance
                    </Link>
                    <Link
                        href={route('admin.fees.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-[4px] shadow-2xs transition-all cursor-pointer"
                    >
                        <Receipt size={14} /> Collect Fee
                    </Link>
                </div>
            </div>

            {/* TOP METRIC CARDS (Clean modern frontend style) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMultiTeacher ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3.5 mb-6`}>
                {/* Total Students */}
                <div className="bg-white p-4 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Total Students</span>
                        <div className="w-8 h-8 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                        {stats.total_students.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1.5">
                        <UserCheck size={12} />
                        <span>{stats.active_students} Active Students</span>
                    </div>
                </div>

                {/* Teachers (if multi-teacher) */}
                {isMultiTeacher && (
                    <Link
                        href={route('admin.teachers.index')}
                        className="bg-white p-4 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-all block"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">Instructors</span>
                            <div className="w-8 h-8 rounded-[4px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <UserCheck size={16} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-700 tabular-nums tracking-tight">
                            {stats.teachers_count}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1.5">
                            Active Faculty Members
                        </div>
                    </Link>
                )}

                {/* Subjects & Batches */}
                <div className="bg-white p-4 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Subjects & Batches</span>
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                            <BookOpen size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                        <span>{stats.batches_count}</span>
                        <span className="text-xs font-semibold text-slate-400">Subjects</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1.5">
                        {stats.batches_count} Active Batches Running
                    </div>
                </div>

                {/* Today's Fee Collection */}
                <div className="bg-white p-4 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Today's Collection</span>
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-700 tabular-nums tracking-tight">
                        ৳ {stats.todays_collection.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1.5">
                        Cash & Gateway Inflow Today
                    </div>
                </div>

                {/* Outstanding Due */}
                <div className="bg-white p-4 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Total Due</span>
                        <div className="w-8 h-8 rounded-[4px] bg-rose-50 text-rose-600 flex items-center justify-center">
                            <TrendingDown size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-rose-600 tabular-nums tracking-tight">
                        ৳ {stats.total_due.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-rose-600/80 font-medium mt-1.5">
                        Unpaid Student Dues
                    </div>
                </div>
            </div>

            {/* FINANCIAL OVERVIEW (Clean modern cards instead of dark heavy gradients) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
                {/* Monthly Income */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Monthly Income</span>
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                        ৳ {stats.monthly_income.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Tuition fees, admissions & extra income
                    </p>
                </div>

                {/* Monthly Expense */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-rose-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Monthly Expense</span>
                        <div className="w-8 h-8 rounded-[4px] bg-rose-50 text-rose-600 flex items-center justify-center">
                            <TrendingDown size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                        ৳ {stats.monthly_expense.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Rent, electricity, sheet print & overheads
                    </p>
                </div>

                {/* Net Cash Balance */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Net Cash Balance</span>
                        <div className="w-8 h-8 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[#16a34a] tabular-nums tracking-tight">
                        ৳ {stats.current_balance.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Current net operational reserve
                    </p>
                </div>
            </div>

            {/* SUBJECT-WISE OVERVIEW (Organized by Subject -> Batches -> Students with Images) */}
            {subjectSummary && subjectSummary.length > 0 && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Subjects & Batch Breakdown</h3>
                            <p className="text-xs text-slate-500">Summary of latest active subjects and batch breakdown.</p>
                        </div>
                        <Link
                            href={route('admin.batches.index')}
                            className="text-xs font-semibold text-[#16a34a] hover:underline flex items-center gap-1"
                        >
                            Manage Subjects <ArrowUpRight size={13} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {subjectSummary.slice(0, 2).map((sub) => (
                            <div
                                key={sub.id}
                                className="rounded-[4px] border border-slate-200/90 bg-white hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col group"
                            >
                                {/* Full-width Image Banner */}
                                <div className="w-full h-48 sm:h-56 relative bg-slate-100 overflow-hidden shrink-0">
                                    <img
                                        src={sub.image || '/images/batches/batch_revision.jpg'}
                                        alt={sub.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.currentTarget.src = '/images/batches/batch_revision.jpg'; }}
                                    />
                                    {/* Category Overlay Pill */}
                                    {sub.category && (
                                        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-[3px] px-2 py-0.5 shadow-xs border border-slate-200/80">
                                            <span className="block text-[10px] font-bold text-[#047857] uppercase tracking-wider leading-none">
                                                {sub.category}
                                            </span>
                                        </div>
                                    )}
                                    {/* Subject Code Overlay Pill */}
                                    {sub.code && (
                                        <div className="absolute bottom-2.5 left-2.5 bg-[#047857]/95 backdrop-blur-xs rounded-[3px] px-2 py-0.5 text-center shadow-xs">
                                            <span className="block font-mono text-[10px] text-white tracking-wider font-bold">
                                                {sub.code}
                                            </span>
                                        </div>
                                    )}
                                    {/* Tuition Fee Badge */}
                                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs rounded-[3px] px-2.5 py-1 text-center shadow-xs">
                                        <span className="block text-[11px] text-emerald-400 font-bold">
                                            ৳ {Number(sub.fee).toLocaleString()} / mo
                                        </span>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                                                {sub.title}
                                            </h4>
                                            <span className="shrink-0 text-[10.5px] font-bold px-2 py-0.5 rounded-[3px] bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                {sub.batches_count} Active {sub.batches_count === 1 ? 'Batch' : 'Batches'}
                                            </span>
                                        </div>

                                        {/* Active Batches List */}
                                        {sub.batches && sub.batches.length > 0 ? (
                                            <div className="mt-3 space-y-1.5">
                                                {sub.batches.map((b) => (
                                                    <div
                                                        key={b.id}
                                                        className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-[3px] bg-slate-50 border border-slate-200/80 text-xs"
                                                    >
                                                        <span className="font-semibold text-slate-800">
                                                            {b.name}
                                                        </span>
                                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                                            <span className="flex items-center gap-1 text-slate-600">
                                                                <Calendar size={12} className="text-[#16a34a]" />
                                                                {b.class_days || 'Regular'}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-slate-600">
                                                                <Clock size={12} className="text-[#16a34a]" />
                                                                {b.class_time || 'Schedule'}
                                                            </span>
                                                            <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-[2px] border border-slate-200">
                                                                {b.students_count} Students
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic mt-1.5">No active batches created yet</p>
                                        )}
                                    </div>

                                    {/* Stats Footer */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <span className="font-medium flex items-center gap-1.5">
                                                <Users size={14} className="text-blue-600" />
                                                <span>Total Enrolled: <b className="text-slate-900">{sub.students_count}</b> Students</span>
                                            </span>
                                        </div>
                                        <Link
                                            href={route('admin.batches.index')}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-2xs transition-colors"
                                        >
                                            <span>Manage Batches</span>
                                            <ArrowUpRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Financial Trend Chart */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Financial Trend (Income vs Expense)</h3>
                            <p className="text-[11px] text-slate-500">6-Month operational cash flow overview</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialTrend} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                                    </linearGradient>
                                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickFormatter={(v) => `৳${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                                />
                                <Tooltip
                                    formatter={(value) => [`৳ ${Number(value).toLocaleString()}`, '']}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', borderColor: '#e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    name="Income"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    fill="url(#incomeGrad)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    name="Expense"
                                    stroke="#e11d48"
                                    strokeWidth={2}
                                    fill="url(#expenseGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Batch Distribution */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Batch Enrolled Students</h3>
                            <p className="text-[11px] text-slate-500">Student enrollment distribution across active batches</p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[3px]">
                            {batchDistribution.length} Batches
                        </span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={batchDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const item = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 rounded-[4px] border border-slate-200 shadow-lg text-xs space-y-1">
                                                    <p className="font-bold text-slate-900 leading-snug">{item.fullName || item.name}</p>
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold pt-1 border-t border-slate-100">
                                                        <Users size={13} />
                                                        <span>{item.students} Enrolled Students</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="students"
                                    name="Students"
                                    fill="#16a34a"
                                    barSize={28}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* RECENT ACADEMIC INQUIRIES & ADMISSION LEADS */}
            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden mb-6">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1 bg-emerald-50 text-[#16a34a] rounded border border-emerald-200">
                                <MessageSquare size={15} />
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Academic Inquiries</h3>
                            {stats?.pending_inquiries > 0 && (
                                <span className="px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                    {stats.pending_inquiries} Pending Follow-up
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Prospective student inquiries and batch questions submitted from the website landing page.
                        </p>
                    </div>
                    <Link
                        href={route('admin.inquiries.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#16a34a] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-[3px] transition-all"
                    >
                        <span>View All Inquiries</span>
                        <ArrowUpRight size={13} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <tr>
                                <th className="p-3.5 whitespace-nowrap">Student / Guardian</th>
                                <th className="p-3.5 whitespace-nowrap">Contact Phone</th>
                                <th className="p-3.5 whitespace-nowrap">Target Batch</th>
                                <th className="p-3.5 min-w-[240px]">Inquiry Note</th>
                                <th className="p-3.5 text-center whitespace-nowrap">Status</th>
                                <th className="p-3.5 text-right whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentInquiries && recentInquiries.length > 0 ? (
                                recentInquiries.map((inq) => (
                                    <tr key={inq.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">{inq.name}</td>
                                        <td className="p-3.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                                            <a href={`tel:${inq.phone}`} className="hover:text-emerald-700 hover:underline">{inq.phone}</a>
                                        </td>
                                        <td className="p-3.5 whitespace-nowrap">
                                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-[#047857] border border-emerald-200/80 rounded-[3px]">
                                                {inq.batch_or_course || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-600 text-xs line-clamp-1">{inq.message}</td>
                                        <td className="p-3.5 text-center whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold capitalize border ${
                                                inq.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                inq.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                inq.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right whitespace-nowrap">
                                            <Link
                                                href={route('admin.inquiries.index')}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-[3px] transition-colors"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        No recent academic inquiries received yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TODAY'S CLASSES TABLE */}
            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Today's Class Schedule</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Live routine for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.class-routines.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-[3px] shadow-2xs transition-all"
                        >
                            <span>Manage Routine</span>
                            <ArrowUpRight size={13} />
                        </Link>
                        <Link
                            href={route('admin.batches.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#16a34a] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-[3px] transition-all"
                        >
                            <span>View All Batches</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <tr>
                                <th className="p-3.5 whitespace-nowrap">Time</th>
                                <th className="p-3.5 whitespace-nowrap">Subject</th>
                                <th className="p-3.5 min-w-[200px]">Batch</th>
                                {isMultiTeacher && <th className="p-3.5 whitespace-nowrap">Instructor</th>}
                                <th className="p-3.5 whitespace-nowrap">Room</th>
                                <th className="p-3.5 whitespace-nowrap">Status</th>
                                <th className="p-3.5 text-right whitespace-nowrap">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {todaysClasses.length > 0 ? (
                                todaysClasses.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-slate-50/60 transition-colors">
                                        {/* Clean formatted 12-hour AM/PM Time */}
                                        <td className="p-3.5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs font-mono">
                                                <Clock size={13} className="text-emerald-600 shrink-0" />
                                                <span>{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</span>
                                            </div>
                                        </td>

                                        {/* Subject with neat icon box */}
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-[4px] bg-emerald-50 border border-emerald-200 text-[#16a34a] flex items-center justify-center shrink-0">
                                                    <BookOpen size={13} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 truncate">
                                                        {cls.subject?.name || cls.batch?.course?.title || 'General Subject'}
                                                    </div>
                                                    {cls.subject?.code && (
                                                        <span className="text-[10px] font-mono font-semibold text-emerald-700 block">
                                                            {cls.subject.code}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Batch */}
                                        <td className="p-3.5">
                                            <div className="font-semibold text-xs text-slate-800 leading-snug">
                                                {cls.batch ? cls.batch.name : 'N/A'}
                                            </div>
                                            {cls.notes && (
                                                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                                    {cls.notes}
                                                </div>
                                            )}
                                        </td>

                                        {/* Multi-Teacher Instructor */}
                                        {isMultiTeacher && (
                                            <td className="p-3.5 text-slate-600 font-medium text-xs whitespace-nowrap">
                                                {cls.teacher?.name || cls.batch?.teacher?.name || 'Unassigned'}
                                            </td>
                                        )}

                                        {/* Room */}
                                        <td className="p-3.5 whitespace-nowrap">
                                            <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 bg-slate-100 rounded-[3px] border border-slate-200">
                                                {cls.room || 'Room 101'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="p-3.5 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span>{cls.status || 'Scheduled'}</span>
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="p-3.5 text-right whitespace-nowrap">
                                            <Link
                                                href={route('admin.attendance.index', { batch_id: cls.batch_id })}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-[3px] border border-emerald-200/90 transition-colors shadow-2xs"
                                            >
                                                <ClipboardCheck size={13} />
                                                <span>Attendance</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isMultiTeacher ? 7 : 6} className="p-8 text-center text-slate-400">
                                        No classes scheduled for today.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
