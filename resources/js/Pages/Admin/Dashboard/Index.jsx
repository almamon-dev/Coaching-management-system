import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users, UserCheck, BookOpen, FolderKanban, Calendar, ClipboardCheck,
    Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, Plus, Receipt
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function Dashboard({ stats, todaysClasses, batchDistribution, financialTrend }) {
    return (
        <AdminLayout>
            <Head title="Operational Dashboard" />

            {/* HEADER ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operational Dashboard</h1>
                    <p className="text-sm text-slate-500">Live monitoring of daily coaching center activity and financial health.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.admissions.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all"
                    >
                        <Plus size={16} /> New Admission
                    </Link>
                    <Link
                        href={route('admin.fees.index')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all"
                    >
                        <Receipt size={16} /> Collect Fee
                    </Link>
                </div>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{stats.total_students}</div>
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                            <UserCheck size={12} /> {stats.active_students} Active Students
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses & Batches</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{stats.courses_count} Courses</div>
                        <span className="text-xs text-slate-500 font-medium mt-1 block">
                            {stats.batches_count} Active Batches
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FolderKanban size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Collection</span>
                        <div className="text-2xl font-black text-emerald-600 mt-1">৳ {stats.todays_collection.toLocaleString()}</div>
                        <span className="text-xs text-slate-500 font-medium mt-1 block">
                            Fee Collection Today
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Wallet size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outstanding Due</span>
                        <div className="text-2xl font-black text-rose-600 mt-1">৳ {stats.total_due.toLocaleString()}</div>
                        <span className="text-xs text-rose-500 font-medium mt-1 block">
                            Student Dues
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* FINANCIAL OVERVIEW STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white p-5 rounded-xl shadow-md">
                    <div className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Monthly Income</div>
                    <div className="text-3xl font-black mt-2">৳ {stats.monthly_income.toLocaleString()}</div>
                    <p className="text-xs text-emerald-200 mt-2">Admission fees, tuition & other operational income</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-md">
                    <div className="text-xs font-medium text-slate-300 uppercase tracking-wider">Monthly Expense</div>
                    <div className="text-3xl font-black mt-2">৳ {stats.monthly_expense.toLocaleString()}</div>
                    <p className="text-xs text-slate-400 mt-2">Rent, utilities, maintenance & operational costs</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white p-5 rounded-xl shadow-md">
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">Net Cash Balance</div>
                    <div className="text-3xl font-black mt-2">৳ {stats.current_balance.toLocaleString()}</div>
                    <p className="text-xs text-blue-200 mt-2">Current net operational balance</p>
                </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Financial Trend Chart */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Financial Trend (Income vs Expense)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#059669" fill="#d1fae5" />
                                <Area type="monotone" dataKey="expense" name="Expense" stroke="#e11d48" fill="#ffe4e6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Batch Distribution */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Batch Enrolled Students</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={batchDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="students" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TODAY'S CLASSES TABLE */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Today's Class Schedule</h3>
                        <p className="text-xs text-slate-500">Live routine for {new Date().toLocaleDateString()}</p>
                    </div>
                    <Link href={route('admin.batches.index')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View All Batches <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">Time</th>
                                <th className="p-4">Batch</th>
                                <th className="p-4">Subject</th>
                                <th className="p-4">Teacher</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {todaysClasses.length > 0 ? (
                                todaysClasses.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-semibold text-slate-900">{cls.start_time} - {cls.end_time}</td>
                                        <td className="p-4 font-medium text-slate-800">{cls.batch ? cls.batch.name : 'N/A'}</td>
                                        <td className="p-4 text-slate-600">{cls.subject ? cls.subject.name : 'N/A'}</td>
                                        <td className="p-4 text-slate-600">{cls.teacher ? cls.teacher.name : 'N/A'}</td>
                                        <td className="p-4 text-slate-600">{cls.room || 'Room 1'}</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                {cls.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
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
