import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Shield, Users, Calendar, ClipboardCheck, Wallet, Award, Bell, LogOut, CheckCircle2 } from 'lucide-react';

export default function GuardianDashboard({ guardian, children, selectedChild, routines, attendances, attendancePercentage, invoices, payments, results, assignments, notices }) {
    const [activeTab, setActiveTab] = useState('attendance');

    const handleChildSwitch = (childId) => {
        router.get(route('guardian.dashboard'), { child_id: childId }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Head title={`Guardian Portal - ${guardian?.name || 'Dashboard'}`} />

            {/* TOP BAR */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-black text-lg flex items-center justify-center">
                            G
                        </div>
                        <div>
                            <h1 className="font-bold text-sm leading-none">{guardian?.name || 'Guardian Portal'}</h1>
                            <span className="text-[10px] text-teal-400 font-semibold">Guardian Account</span>
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
                {/* MULTI-CHILD SELECTOR */}
                {children.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Child:</span>
                        <div className="flex gap-2">
                            {children.map(ch => (
                                <button
                                    key={ch.id}
                                    onClick={() => handleChildSwitch(ch.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        selectedChild?.id === ch.id
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {ch.name} ({ch.student_id})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedChild ? (
                    <>
                        {/* CHILD STATUS STRIP */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-xs text-slate-500 font-medium">Child Attendance %</span>
                                <div className="text-2xl font-black text-emerald-600 mt-1">{attendancePercentage}%</div>
                                <span className="text-[11px] text-slate-400">Class Attendance Rate</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-xs text-slate-500 font-medium">Subject & Batch</span>
                                <div className="text-base font-bold text-slate-900 mt-1">{selectedChild.course?.title}</div>
                                <span className="text-[11px] text-slate-400">{selectedChild.batch?.name}</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-xs text-slate-500 font-medium">Remaining Fee Due</span>
                                <div className="text-2xl font-black text-rose-600 mt-1">
                                    ৳ {invoices.reduce((acc, inv) => acc + parseFloat(inv.due_amount || 0), 0).toLocaleString()}
                                </div>
                                <span className="text-[11px] text-rose-500 font-medium">Outstanding Dues</span>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
                            {[
                                { id: 'attendance', label: 'Attendance Record', icon: ClipboardCheck },
                                { id: 'fees', label: 'Fee Payments & Dues', icon: Wallet },
                                { id: 'results', label: 'Exam Results & GPA', icon: Award },
                                { id: 'routine', label: 'Class Routine', icon: Calendar },
                                { id: 'notices', label: 'Center Notices', icon: Bell },
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
                        {activeTab === 'attendance' && (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Live Attendance History</h3>
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {attendances.map(a => (
                                            <tr key={a.id}>
                                                <td className="p-3 font-semibold text-slate-900">{a.date}</td>
                                                <td className="p-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        a.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                    }`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'fees' && (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Child Fee Account & Invoices</h3>
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3">Invoice No</th>
                                            <th className="p-3">Title</th>
                                            <th className="p-3">Net Amount</th>
                                            <th className="p-3">Paid Amount</th>
                                            <th className="p-3">Remaining Due</th>
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
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Academic Exam Results</h3>
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3">Exam Title</th>
                                            <th className="p-3">Obtained Marks</th>
                                            <th className="p-3">Grade</th>
                                            <th className="p-3">GPA</th>
                                            <th className="p-3">Pass/Fail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {results.map(res => (
                                            <tr key={res.id}>
                                                <td className="p-3 font-bold text-slate-900">{res.exam?.title}</td>
                                                <td className="p-3 font-bold">{res.obtained_marks} / {res.total_marks}</td>
                                                <td className="p-3 font-bold text-emerald-600">{res.grade}</td>
                                                <td className="p-3 font-bold">{res.gpa}</td>
                                                <td className="p-3 uppercase font-bold text-emerald-700">{res.pass_status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-xl text-center text-slate-500 border">
                        No child accounts linked to this guardian phone number.
                    </div>
                )}
            </main>
        </div>
    );
}
