import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Users, UserCheck, BookOpen, FolderKanban, Calendar, ClipboardCheck,
    Wallet, TrendingDown, TrendingUp, ArrowUpRight, Plus, Receipt, Layers,
    Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function Dashboard({ stats, todaysClasses = [], subjectSummary = [], batchDistribution = [], financialTrend = [] }) {
    const { settings } = usePage().props;
    const coachingMode = settings?.coaching_mode || 'single';
    const isMultiTeacher = coachingMode === 'multi';
    const [switching, setSwitching] = useState(false);

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
                                className={`relative inline-flex h-4.5 w-8 shrink-0 rounded-full border border-transparent transition-colors duration-200 bg-emerald-600 ${
                                    switching ? 'opacity-50' : ''
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 mt-0.5 ml-0.5 ${
                                        isMultiTeacher ? 'translate-x-3.5' : 'translate-x-0'
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
                        <span className="text-xs font-semibold text-slate-500">Courses & Batches</span>
                        <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                            <BookOpen size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                        <span>{stats.courses_count}</span>
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

            {/* SUBJECT-WISE OVERVIEW (Organized by Subject -> Batches -> Students) */}
            {subjectSummary.length > 0 && (
                <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Subjects & Batch Breakdown</h3>
                            <p className="text-xs text-slate-500">Summary of all subjects taught, active batches, and enrolled students.</p>
                        </div>
                        <Link
                            href={route('admin.courses.index')}
                            className="text-xs font-semibold text-[#16a34a] hover:underline flex items-center gap-1"
                        >
                            Manage Subjects <ArrowUpRight size={13} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {subjectSummary.map((sub) => (
                            <div
                                key={sub.id}
                                className="p-3.5 rounded-[4px] border border-slate-200/70 bg-slate-50/40 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                                            {sub.code}
                                        </span>
                                        {sub.category && (
                                            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-[3px]">
                                                {sub.category}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sub.title}</h4>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-600 font-medium flex items-center gap-1">
                                        <Layers size={12} className="text-[#16a34a]" />
                                        <b>{sub.batches_count}</b> Batches
                                    </span>
                                    <span className="text-slate-600 font-medium flex items-center gap-1">
                                        <Users size={12} className="text-blue-600" />
                                        <b>{sub.students_count}</b> Students
                                    </span>
                                    <span className="font-bold text-emerald-700">৳{sub.fee.toLocaleString()}</span>
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
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Financial Trend (Income vs Expense)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#16a34a" fill="#dcfce7" />
                                <Area type="monotone" dataKey="expense" name="Expense" stroke="#e11d48" fill="#ffe4e6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Batch Distribution */}
                <div className="bg-white p-5 rounded-[4px] border border-slate-200/80 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Batch Enrolled Students</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={batchDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip />
                                <Bar dataKey="students" name="Students" fill="#16a34a" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TODAY'S CLASSES TABLE */}
            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">Today's Class Schedule</h3>
                        <p className="text-xs text-slate-500">Live routine for {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.class-routines.index')} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                            Manage Routine <ArrowUpRight size={13} />
                        </Link>
                        <Link href={route('admin.batches.index')} className="text-xs font-semibold text-[#16a34a] hover:underline flex items-center gap-1">
                            View All Batches <ArrowUpRight size={13} />
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <tr>
                                <th className="p-3.5">Time</th>
                                <th className="p-3.5">Subject</th>
                                <th className="p-3.5">Batch</th>
                                {isMultiTeacher && <th className="p-3.5">Teacher</th>}
                                <th className="p-3.5">Room</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {todaysClasses.length > 0 ? (
                                todaysClasses.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3.5 font-semibold text-slate-900">{cls.start_time} - {cls.end_time}</td>
                                        <td className="p-3.5">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                                <BookOpen size={11} />
                                                {cls.batch?.course?.title || cls.subject?.name || 'Subject'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-medium text-slate-800">{cls.batch ? cls.batch.name : 'N/A'}</td>
                                        {isMultiTeacher && (
                                             <td className="p-3.5 text-slate-600 font-medium">
                                                {cls.teacher?.name || cls.batch?.teacher?.name || 'Unassigned'}
                                            </td>
                                        )}
                                        <td className="p-3.5 text-slate-600">{cls.room || 'Room 101'}</td>
                                        <td className="p-3.5">
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <Link
                                                href={route('admin.attendance.index', { batch_id: cls.batch_id })}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                                            >
                                                <ClipboardCheck size={12} /> Attendance
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
