import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap, Calendar, ClipboardCheck, Wallet, Award,
    BookMarked, FileCode, Bell, LogOut, CheckCircle2, XCircle,
    User, Layers, Clock, MapPin, Printer, Eye, X, FileText, Check
} from 'lucide-react';
import { createPortal } from 'react-dom';

export default function StudentDashboard({ 
    student, 
    enrolledBatches = [],
    routines = [], 
    attendances = [], 
    attendancePercentage = 100, 
    invoices = [], 
    payments = [], 
    totalPaid = 0, 
    totalDue = 0, 
    results = [], 
    assignments = [], 
    studyMaterials = [], 
    notices = [] 
}) {
    const [activeTab, setActiveTab] = useState('batches');
    const [selectedMarksheet, setSelectedMarksheet] = useState(null);

    // Fallback batch list if enrolledBatches is empty
    const batchesList = enrolledBatches && enrolledBatches.length > 0
        ? enrolledBatches
        : (student?.batch ? [student.batch] : []);

    const getGradeBadge = (grade) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'bg-emerald-50 text-[#16a34a] border-emerald-200';
            case 'A-':
            case 'B':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'C':
            case 'D':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-rose-50 text-rose-600 border-rose-200';
        }
    };

    const handlePrintMarksheet = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Head title={`Student Portal - ${student?.name || 'Dashboard'}`} />

            {/* TOP BAR */}
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 print:hidden">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-[#16a34a] text-white font-black text-base flex items-center justify-center shadow-xs">
                            {student?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h1 className="font-bold text-sm leading-none text-white">{student?.name}</h1>
                            <span className="text-[11px] text-emerald-400 font-semibold">{student?.student_id} • {student?.course?.title || 'Student Portal'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <LogOut size={13} /> Logout
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-5 space-y-5 print:p-0 print:m-0">
                {/* QUICK STATS CARDS (rounded-4px, no uppercase, compact) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 print:hidden">
                    <div className="bg-white p-3.5 rounded-[4px] border border-slate-200 shadow-2xs">
                        <span className="text-[11px] text-slate-400 font-medium block">Attendance rate</span>
                        <div className="text-xl font-black text-[#16a34a] mt-0.5">{attendancePercentage}%</div>
                        <span className="text-[10.5px] text-slate-400">Verified class records</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-[4px] border border-slate-200 shadow-2xs">
                        <span className="text-[11px] text-slate-400 font-medium block">My enrolled batches</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                            {batchesList.length} {batchesList.length === 1 ? 'batch' : 'batches'}
                        </div>
                        <span className="text-[10.5px] text-[#16a34a] font-medium">
                            {batchesList[0]?.name ? `${batchesList[0].name.slice(0, 22)}...` : 'Active'}
                        </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-[4px] border border-slate-200 shadow-2xs">
                        <span className="text-[11px] text-slate-400 font-medium block">Total fees paid</span>
                        <div className="text-xl font-black text-slate-900 mt-0.5">৳ {Number(totalPaid || 0).toLocaleString()}</div>
                        <span className="text-[10.5px] text-[#16a34a] font-semibold">Verified receipts</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-[4px] border border-slate-200 shadow-2xs">
                        <span className="text-[11px] text-slate-400 font-medium block">Pending due</span>
                        <div className={`text-xl font-black mt-0.5 ${Number(totalDue) > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                            ৳ {Number(totalDue || 0).toLocaleString()}
                        </div>
                        <span className="text-[10.5px] text-slate-400">
                            {Number(totalDue) > 0 ? 'Payment required' : 'All clear'}
                        </span>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex gap-1.5 border-b border-slate-200 overflow-x-auto pb-1.5 print:hidden">
                    {[
                        { id: 'batches', label: 'My batches', icon: Layers },
                        { id: 'results', label: 'Exams & results', icon: Award },
                        { id: 'routine', label: 'Class routine', icon: Calendar },
                        { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
                        { id: 'fees', label: 'Fees & dues', icon: Wallet },
                        { id: 'assignments', label: 'Assignments', icon: BookMarked },
                        { id: 'materials', label: 'Study materials', icon: FileCode },
                        { id: 'notices', label: 'Notice board', icon: Bell },
                    ].map(t => {
                        const Icon = t.icon;
                        const isCurrent = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-[3px] whitespace-nowrap transition-all cursor-pointer ${
                                    isCurrent 
                                        ? 'bg-slate-900 text-white shadow-2xs' 
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:text-slate-900'
                                }`}
                            >
                                <Icon size={13} className={isCurrent ? 'text-emerald-400' : 'text-slate-400'} /> 
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: MY BATCHES */}
                {activeTab === 'batches' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Enrolled batches</h3>
                                <p className="text-xs text-slate-500">All coaching batches you are currently assigned to.</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                {batchesList.length} Active {batchesList.length === 1 ? 'batch' : 'batches'}
                            </span>
                        </div>

                        {batchesList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {batchesList.map(batch => (
                                    <div key={batch.id} className="bg-white rounded-[4px] border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-[2px] block w-fit mb-1">
                                                        {batch.course?.title || student?.course?.title || 'Academic Course'}
                                                    </span>
                                                    <h4 className="text-sm font-bold text-slate-900">{batch.name}</h4>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16a34a] border border-emerald-200 capitalize shrink-0">
                                                    {batch.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <User size={12} className="text-slate-400" /> Instructor
                                                </span>
                                                <span className="font-semibold text-slate-800">{batch.teacher?.name || 'Assigned Instructor'}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <Clock size={12} className="text-slate-400" /> Schedule
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    {batch.class_days || 'Regular'} {batch.class_time ? `• ${batch.class_time}` : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-slate-400" /> Classroom
                                                </span>
                                                <span className="font-semibold text-slate-800">{batch.room || 'Room 101'}</span>
                                            </div>
                                            {batch.pivot?.monthly_fee && (
                                                <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200">
                                                    <span className="text-slate-400">Monthly fee</span>
                                                    <span className="font-bold text-[#16a34a]">৳ {batch.pivot.monthly_fee} / month</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-[4px] border border-slate-200 text-center text-xs text-slate-400">
                                No active batch enrollments found.
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: EXAMS & RESULTS */}
                {activeTab === 'results' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Exam performance & results</h3>
                                <p className="text-xs text-slate-500">Official published test scores, GPAs, and marksheets.</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                {results.length} Published {results.length === 1 ? 'result' : 'results'}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                    <tr>
                                        <th className="px-3.5 py-2.5">Exam title</th>
                                        <th className="px-3.5 py-2.5">Batch / Course</th>
                                        <th className="px-3.5 py-2.5 text-center">Exam date</th>
                                        <th className="px-3.5 py-2.5 text-center">Obtained marks</th>
                                        <th className="px-3.5 py-2.5 text-center">Percentage</th>
                                        <th className="px-3.5 py-2.5 text-center">Grade</th>
                                        <th className="px-3.5 py-2.5 text-center">GPA</th>
                                        <th className="px-3.5 py-2.5 text-center">Status</th>
                                        <th className="px-3.5 py-2.5 text-right">Marksheet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/80 bg-white">
                                    {results.length > 0 ? (
                                        results.map(res => {
                                            const isPassed = res.pass_status === 'pass';
                                            return (
                                                <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                        <span className="font-bold text-slate-900 block">{res.exam?.title}</span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-500 text-[11px]">
                                                        {res.exam?.batch?.name || res.exam?.course?.title || 'Coaching Batch'}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap text-slate-600 text-[11px]">
                                                        {res.exam?.exam_date || '—'}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className="font-bold text-slate-900 tabular-nums">{res.obtained_marks}</span>
                                                        <span className="text-[11px] text-slate-400"> / {res.total_marks}</span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap font-medium text-slate-700 tabular-nums">
                                                        {res.percentage}%
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className={`inline-block px-2 py-0.5 rounded-[3px] font-bold text-[11px] border ${getGradeBadge(res.grade)}`}>
                                                            {res.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap font-bold text-slate-800 tabular-nums">
                                                        {Number(res.gpa).toFixed(2)}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                            isPassed
                                                                ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                                : 'bg-rose-50 text-rose-600 border-rose-200'
                                                        }`}>
                                                            {isPassed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                            {isPassed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedMarksheet(res)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer shadow-xs"
                                                        >
                                                            <FileText size={12} />
                                                            <span>View marksheet</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                                                No published exam results found yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: CLASS ROUTINE */}
                {activeTab === 'routine' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Upcoming class schedule</h3>
                                <p className="text-xs text-slate-500">Live routine for all your enrolled coaching batches.</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            {routines.length > 0 ? (
                                routines.map(r => (
                                    <div key={r.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-[3px] border border-slate-200 flex justify-between items-center transition-colors">
                                        <div>
                                            <div className="font-bold text-slate-900">{r.subject?.name || 'Class Lecture'}</div>
                                            <div className="text-[11px] text-slate-500">Teacher: {r.teacher?.name || 'Instructor'} • Classroom: {r.room || 'Room 101'}</div>
                                        </div>
                                        <div className="text-right font-semibold text-[#16a34a]">
                                            {r.class_date}
                                            <div className="text-[10.5px] text-slate-400 font-normal">{r.start_time} - {r.end_time}</div>
                                        </div>
                                    </div>
                                ))
                            ) : <div className="text-center text-slate-400 py-6">No routines scheduled at this time.</div>}
                        </div>
                    </div>
                )}

                {/* TAB 4: ATTENDANCE */}
                {activeTab === 'attendance' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Attendance history</h3>
                                <p className="text-xs text-slate-500">Record of present, late, and absent days.</p>
                            </div>
                            <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                {attendancePercentage}% Overall
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                    <tr>
                                        <th className="px-3.5 py-2.5">Date</th>
                                        <th className="px-3.5 py-2.5">Batch</th>
                                        <th className="px-3.5 py-2.5">Status</th>
                                        <th className="px-3.5 py-2.5">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/80 bg-white">
                                    {attendances.length > 0 ? (
                                        attendances.map(att => (
                                            <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-3.5 py-2 font-medium text-slate-800">{att.date}</td>
                                                <td className="px-3.5 py-2 text-slate-600">{att.batch?.name || student?.batch?.name || '—'}</td>
                                                <td className="px-3.5 py-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                        att.status === 'present'
                                                            ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                            : att.status === 'late'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                            : 'bg-rose-50 text-rose-600 border-rose-200'
                                                    }`}>
                                                        {att.status}
                                                    </span>
                                                </td>
                                                <td className="px-3.5 py-2 text-slate-400 text-[11px]">{att.remarks || '—'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">
                                                No attendance logs recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 5: FEES & INVOICES */}
                {activeTab === 'fees' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Fee invoices & payments</h3>
                                <p className="text-xs text-slate-500">Payment receipts and upcoming monthly tuition dues.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                                    <tr>
                                        <th className="px-3.5 py-2.5">Invoice no</th>
                                        <th className="px-3.5 py-2.5">Fee title</th>
                                        <th className="px-3.5 py-2.5 text-right">Net amount</th>
                                        <th className="px-3.5 py-2.5 text-right">Paid</th>
                                        <th className="px-3.5 py-2.5 text-right">Due</th>
                                        <th className="px-3.5 py-2.5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/80 bg-white">
                                    {invoices.length > 0 ? (
                                        invoices.map(inv => (
                                            <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-3.5 py-2 font-mono font-bold text-[#16a34a]">{inv.invoice_no}</td>
                                                <td className="px-3.5 py-2 font-medium text-slate-800">{inv.title}</td>
                                                <td className="px-3.5 py-2 text-right font-bold text-slate-900 tabular-nums">৳ {inv.net_amount}</td>
                                                <td className="px-3.5 py-2 text-right font-bold text-[#16a34a] tabular-nums">৳ {inv.paid_amount}</td>
                                                <td className="px-3.5 py-2 text-right font-bold text-rose-600 tabular-nums">৳ {inv.due_amount}</td>
                                                <td className="px-3.5 py-2 text-center">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                        Number(inv.due_amount) === 0
                                                            ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                            : 'bg-rose-50 text-rose-600 border-rose-200'
                                                    }`}>
                                                        {Number(inv.due_amount) === 0 ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                                                No fee invoices found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 6: ASSIGNMENTS */}
                {activeTab === 'assignments' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Course assignments</h3>
                                <p className="text-xs text-slate-500">Homework and problem sets given by your teachers.</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            {assignments.length > 0 ? (
                                assignments.map(a => {
                                    const submission = a.submissions && a.submissions[0];
                                    return (
                                        <div key={a.id} className="p-3.5 bg-slate-50/70 rounded-[4px] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                                            <div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-slate-200/80 text-slate-700 inline-block mb-1">
                                                    {a.subject?.name || 'General Subject'}
                                                </span>
                                                <h4 className="font-bold text-slate-900">{a.title}</h4>
                                                <p className="text-slate-500 text-[11px] mt-0.5">{a.description}</p>
                                                <div className="text-slate-400 text-[10.5px] mt-1">Due date: {a.due_date} • Full marks: {a.total_marks}</div>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-2">
                                                {submission ? (
                                                    <span className="px-2.5 py-1 rounded-[3px] text-[11px] font-bold bg-emerald-50 text-[#16a34a] border border-emerald-200 flex items-center gap-1">
                                                        <Check size={12} /> Submitted ({submission.status})
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-[3px] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        Pending submission
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-slate-400 py-6">No assignments currently assigned.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 7: STUDY MATERIALS */}
                {activeTab === 'materials' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Study materials & lecture notes</h3>
                                <p className="text-xs text-slate-500">Download lecture sheets, question banks, and slides.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {studyMaterials.length > 0 ? (
                                studyMaterials.map(m => (
                                    <div key={m.id} className="p-3.5 bg-slate-50/70 rounded-[4px] border border-slate-200 space-y-2">
                                        <div className="flex justify-between font-bold text-slate-900">
                                            <span>{m.title}</span>
                                            <span className="text-[10px] bg-emerald-100 text-[#16a34a] px-2 py-0.5 rounded-[2px]">{m.file_type || 'PDF'}</span>
                                        </div>
                                        <p className="text-slate-500 text-[11px]">{m.description || 'Downloadable study resource.'}</p>
                                        {m.link_url && (
                                            <a href={m.link_url} target="_blank" rel="noreferrer" className="text-[#16a34a] font-bold block pt-1 hover:underline">
                                                Open material &rarr;
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-slate-400 py-6">No study materials published yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 8: NOTICE BOARD */}
                {activeTab === 'notices' && (
                    <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Notice board</h3>
                                <p className="text-xs text-slate-500">Important notices and announcements from administration.</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            {notices.length > 0 ? (
                                notices.map(n => (
                                    <div key={n.id} className="p-3.5 bg-slate-50/70 rounded-[4px] border border-slate-200 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900">{n.title}</h4>
                                            <span className="text-[10.5px] text-slate-400">{n.published_at || n.created_at?.slice(0, 10)}</span>
                                        </div>
                                        <p className="text-slate-600 text-[11px] whitespace-pre-line">{n.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-6">No notices published.</div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL: OFFICIAL STUDENT MARKSHEET SLIP VIEW (PRINTABLE) */}
            {selectedMarksheet && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="bg-white max-w-lg w-full rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col print:shadow-none print:border-none">
                        {/* Action Header */}
                        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold">Official student marksheet</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrintMarksheet}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer shadow-sm"
                                >
                                    <Printer size={13} /> Print marksheet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMarksheet(null)}
                                    className="p-1 text-slate-400 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Slip Printable Card */}
                        <div className="p-6 space-y-5 print:p-6">
                            <div className="text-center border-b border-slate-200 pb-3">
                                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-600 text-white font-black text-lg mb-1 shadow-sm">
                                    A
                                </div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Apex Coaching Center</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Academic Evaluation Marksheet Slip</p>
                            </div>

                            {/* Student Metadata Card */}
                            <div className="bg-slate-50 p-3.5 rounded-[4px] border border-slate-200 text-xs space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student name:</span>
                                    <b className="text-slate-900">{student?.name}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student ID:</span>
                                    <b className="text-[#16a34a] font-mono">{student?.student_id || 'N/A'}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Batch:</span>
                                    <b className="text-slate-800">{selectedMarksheet.exam?.batch?.name || student?.batch?.name || 'All Batches'}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Examination:</span>
                                    <b className="text-slate-800">{selectedMarksheet.exam?.title}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Exam date:</span>
                                    <span className="text-slate-700">{selectedMarksheet.exam?.exam_date || '—'}</span>
                                </div>
                            </div>

                            {/* Marks & Performance Grid */}
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-[3px]">
                                    <span className="text-[10.5px] text-emerald-800 font-semibold block">Obtained marks</span>
                                    <div className="text-xl font-black text-[#16a34a] mt-0.5">
                                        {selectedMarksheet.obtained_marks}
                                        <span className="text-xs font-normal text-slate-400"> / {selectedMarksheet.total_marks}</span>
                                    </div>
                                    <span className="text-[10.5px] text-slate-500">{selectedMarksheet.percentage}%</span>
                                </div>

                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[3px]">
                                    <span className="text-[10.5px] text-slate-600 font-semibold block">Grade & GPA</span>
                                    <div className="text-xl font-black text-slate-900 mt-0.5">
                                        {selectedMarksheet.grade}
                                        <span className="text-xs font-normal text-slate-500"> ({Number(selectedMarksheet.gpa).toFixed(2)})</span>
                                    </div>
                                    <span className={`text-[10.5px] font-bold ${selectedMarksheet.pass_status === 'pass' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                        {selectedMarksheet.pass_status === 'pass' ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                            </div>

                            {/* Academic Note */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-[3px] text-[11px] text-slate-600">
                                <b>Instructor remark: </b>
                                {selectedMarksheet.grade === 'A+' ? 'Outstanding academic performance! Keep maintaining this high standard.' :
                                 selectedMarksheet.grade === 'A' ? 'Very good mastery of concepts. Continue practice.' :
                                 selectedMarksheet.grade === 'B' ? 'Good effort. Additional revision recommended.' :
                                 'Needs dedicated attention and practice on core problem sets.'}
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between pt-8 text-center text-xs text-slate-600">
                                <div className="border-t border-slate-400 pt-1 w-32">
                                    <p className="text-[10.5px] font-bold">Evaluator Signature</p>
                                </div>
                                <div className="border-t border-slate-400 pt-1 w-32">
                                    <p className="text-[10.5px] font-bold">Controller / Seal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
