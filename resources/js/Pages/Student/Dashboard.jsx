import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap, Calendar, ClipboardCheck, Wallet, FileQuestion, Award,
    BookMarked, FileCode, Bell, LogOut, CheckCircle2, User
} from 'lucide-react';

export default function StudentDashboard({ student, routines, attendances, attendancePercentage, invoices, payments, totalPaid, totalDue, results, assignments, studyMaterials, notices }) {
    const [activeTab, setActiveTab] = useState('routine');

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Head title={`Student Portal - ${student?.name || 'Dashboard'}`} />

            {/* TOP BAR */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
                            S
                        </div>
                        <div>
                            <h1 className="font-bold text-sm leading-none">{student?.name}</h1>
                            <span className="text-[10px] text-emerald-400 font-semibold">{student?.student_id} • {student?.course?.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/logout" method="post" as="button" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                            <LogOut size={14} /> Logout
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* QUICK STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-500 font-medium block">Attendance %</span>
                        <div className="text-2xl font-black text-emerald-600 mt-1">{attendancePercentage}%</div>
                        <span className="text-[11px] text-slate-400">Class Attendance</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-500 font-medium block">Enrolled Batch</span>
                        <div className="text-base font-bold text-slate-900 mt-1">{student?.batch?.name || 'N/A'}</div>
                        <span className="text-[11px] text-slate-400">{student?.batch?.class_days}</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-500 font-medium block">Total Fees Paid</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">৳ {totalPaid.toLocaleString()}</div>
                        <span className="text-[11px] text-emerald-600 font-semibold">Verified Receipts</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-500 font-medium block">Remaining Due</span>
                        <div className="text-2xl font-black text-rose-600 mt-1">৳ {totalDue.toLocaleString()}</div>
                        <span className="text-[11px] text-rose-500 font-medium">Pending Payments</span>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
                    {[
                        { id: 'routine', label: 'Class Routine', icon: Calendar },
                        { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
                        { id: 'fees', label: 'Fees & Dues', icon: Wallet },
                        { id: 'results', label: 'Exams & Results', icon: Award },
                        { id: 'assignments', label: 'Assignments', icon: BookMarked },
                        { id: 'materials', label: 'Study Materials', icon: FileCode },
                        { id: 'notices', label: 'Notice Board', icon: Bell },
                    ].map(t => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                                    activeTab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                                }`}
                            >
                                <Icon size={14} /> {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT */}
                {activeTab === 'routine' && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Class Schedule</h3>
                        <div className="space-y-3 text-xs">
                            {routines.length > 0 ? (
                                routines.map(r => (
                                    <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-slate-900">{r.subject?.name}</div>
                                            <div className="text-slate-500">Teacher: {r.teacher?.name} • Room: {r.room}</div>
                                        </div>
                                        <div className="text-right font-semibold text-emerald-700">
                                            {r.class_date}
                                            <div className="text-[10px] text-slate-400 font-normal">{r.start_time} - {r.end_time}</div>
                                        </div>
                                    </div>
                                ))
                            ) : <div className="text-center text-slate-400 py-6">No routines scheduled.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Fee Invoices</h3>
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                                <tr>
                                    <th className="p-3">Invoice No</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Net Amount</th>
                                    <th className="p-3">Paid</th>
                                    <th className="p-3">Due</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="p-3 font-bold text-slate-900">{inv.invoice_no}</td>
                                        <td className="p-3">{inv.title}</td>
                                        <td className="p-3 font-bold">৳ {inv.net_amount}</td>
                                        <td className="p-3 font-bold text-emerald-600">৳ {inv.paid_amount}</td>
                                        <td className="p-3 font-bold text-rose-600">৳ {inv.due_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Exam Performance</h3>
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                                <tr>
                                    <th className="p-3">Exam</th>
                                    <th className="p-3">Obtained Marks</th>
                                    <th className="p-3">Percentage</th>
                                    <th className="p-3">Grade</th>
                                    <th className="p-3">GPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {results.map(res => (
                                    <tr key={res.id}>
                                        <td className="p-3 font-bold text-slate-900">{res.exam?.title}</td>
                                        <td className="p-3 font-bold">{res.obtained_marks} / {res.total_marks}</td>
                                        <td className="p-3">{res.percentage}%</td>
                                        <td className="p-3 font-bold text-emerald-600">{res.grade}</td>
                                        <td className="p-3 font-bold">{res.gpa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'materials' && (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Downloadable Study Materials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {studyMaterials.map(m => (
                                <div key={m.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>{m.title}</span>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{m.file_type}</span>
                                    </div>
                                    <p className="text-slate-500">{m.description}</p>
                                    {m.link_url && (
                                        <a href={m.link_url} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold block pt-1 hover:underline">
                                            Open Material &rarr;
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
