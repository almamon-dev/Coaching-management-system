import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, Edit, Wallet, User, Calendar, Clock, Phone, Mail, MapPin,
    GraduationCap, BookMarked, ClipboardCheck, Award, FileQuestion, CheckCircle2,
    BookOpen, UserCheck, Receipt, Layers, AlertCircle, FileText
} from 'lucide-react';
import SummaryCard from '@/Components/Common/SummaryCard';

export default function StudentShow({ student }) {
    const [activeTab, setActiveTab] = useState('overview');

    const enrolledBatches = useMemo(() => {
        if (student?.batches && student.batches.length > 0) {
            return student.batches;
        }
        return student?.batch ? [student.batch] : [];
    }, [student]);

    const totalMonthlyFee = useMemo(() => {
        if (student?.batches && student.batches.length > 0) {
            return student.batches.reduce(
                (sum, b) => sum + Number(b.pivot?.monthly_fee || b.course?.fee || 0),
                0
            );
        }
        return Number(student?.course?.fee || 0);
    }, [student]);

    const invoices = student?.fee_invoices || student?.feeInvoices || [];
    const payments = student?.fee_payments || student?.feePayments || [];
    const attendances = student?.attendances || [];
    const results = student?.results || [];
    const assignments = student?.assignment_submissions || student?.assignmentSubmissions || [];

    const totalPaid = useMemo(() => {
        if (payments.length > 0) {
            return payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
        }
        return invoices.reduce((sum, i) => sum + Number(i.paid_amount || 0), 0);
    }, [payments, invoices]);

    const totalDue = useMemo(() => {
        return invoices.reduce((sum, i) => sum + Number(i.due_amount || 0), 0);
    }, [invoices]);

    const attendanceRate = useMemo(() => {
        if (attendances.length === 0) return 100;
        const presentCount = attendances.filter(a => a.status === 'present' || a.status === 'late').length;
        return Math.round((presentCount / attendances.length) * 100);
    }, [attendances]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User, count: null },
        { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, count: attendances.length },
        { id: 'fees', label: 'Fees & Invoices', icon: Wallet, count: invoices.length },
        { id: 'results', label: 'Exams & Results', icon: Award, count: results.length },
        { id: 'assignments', label: 'Assignments', icon: BookMarked, count: assignments.length },
    ];

    return (
        <AdminLayout>
            <Head title={`Student Profile - ${student.name} (${student.student_id})`} />

            {/* TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                            {student.name}
                        </h1>
                        <span className="font-mono text-xs font-bold text-[#16a34a] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[4px]">
                            {student.student_id}
                        </span>
                        <span className={`px-2 py-0.5 text-[10.5px] font-bold rounded-[4px] uppercase tracking-wider ${
                            student.status === 'active'
                                ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                            {student.status}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Guardian: <b className="text-slate-700">{student.guardian_name || 'N/A'}</b> ({student.guardian_phone || 'N/A'}) • Enrolled: <b className="text-slate-700">{enrolledBatches.length} {enrolledBatches.length === 1 ? 'Subject' : 'Subjects'}</b>
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href={route('admin.students.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[4px] transition-colors"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to Students</span>
                    </Link>
                    <Link
                        href={route('admin.students.edit', student.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-[4px] shadow-2xs transition-colors"
                    >
                        <Edit size={13} />
                        <span>Edit Profile</span>
                    </Link>
                    <Link
                        href={route('admin.fees.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[4px] shadow-2xs transition-all"
                    >
                        <Wallet size={13} />
                        <span>Fee Collection</span>
                    </Link>
                </div>
            </div>

            {/* COMPACT KPI METRIC CARDS (4-COLUMNS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        <Layers size={13} className="text-[#16a34a]" />
                        <span>Enrolled Subjects</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                        {enrolledBatches.length}
                        <span className="text-xs font-medium text-slate-400"> {enrolledBatches.length === 1 ? 'Batch' : 'Batches'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {enrolledBatches.map(b => b.name).join(', ') || 'No batch'}
                    </div>
                </div>

                <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        <Wallet size={13} className="text-[#16a34a]" />
                        <span>Monthly Tuition</span>
                    </div>
                    <div className="text-lg font-black text-[#16a34a] mt-0.5">
                        ৳ {totalMonthlyFee.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400"> /mo</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        Combined subjects fee
                    </div>
                </div>

                <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        <Receipt size={13} className="text-emerald-600" />
                        <span>Total Paid</span>
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                        ৳ {totalPaid.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                        {invoices.length} {invoices.length === 1 ? 'Invoice' : 'Invoices'} generated
                    </div>
                </div>

                <div className="bg-white p-3 rounded-[4px] border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        <AlertCircle size={13} className={totalDue > 0 ? "text-rose-600" : "text-slate-400"} />
                        <span>Due Balance</span>
                    </div>
                    <div className={`text-lg font-black mt-0.5 ${totalDue > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                        ৳ {totalDue.toLocaleString()}
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {totalDue > 0 ? 'Payment pending' : 'All cleared'}
                    </div>
                </div>
            </div>

            {/* COMPACT TAB NAVIGATION */}
            <div className="flex overflow-x-auto gap-1 border-b border-slate-200/90 mb-4 pb-1.5">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-2xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                            }`}
                        >
                            <Icon size={13} />
                            <span>{tab.label}</span>
                            {tab.count !== null && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT PANELS */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* LEFT (7 COLS): ENROLLED SUBJECTS & BATCHES */}
                    <div className="lg:col-span-7 space-y-4">
                        <SummaryCard
                            title="Enrolled Subjects & Batches"
                            icon={BookMarked}
                            badge={
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                                    {enrolledBatches.length} {enrolledBatches.length === 1 ? 'Subject' : 'Subjects'}
                                </span>
                            }
                            bodyClassName="p-0"
                            footer={
                                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                    <span>Total Monthly Tuition Fee:</span>
                                    <span className="text-[#16a34a] font-black text-sm">৳ {totalMonthlyFee.toLocaleString()} / mo</span>
                                </div>
                            }
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                        <tr>
                                            <th className="py-2.5 px-3.5">Subject & Code</th>
                                            <th className="py-2.5 px-3.5">Batch Name</th>
                                            <th className="py-2.5 px-3.5">Schedule / Days</th>
                                            <th className="py-2.5 px-3.5">Instructor</th>
                                            <th className="py-2.5 px-3.5 text-right">Monthly Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {enrolledBatches.length > 0 ? (
                                            enrolledBatches.map((b) => (
                                                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="py-2.5 px-3.5 font-bold text-slate-900">
                                                        <div>{b.course?.title || b.name}</div>
                                                        <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                                            {b.course?.code || 'ACADEMIC'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3.5">
                                                        <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[3px] text-[11px] inline-block">
                                                            {b.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                                                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                                                            <Calendar size={11} className="text-[#16a34a]" />
                                                            <span>{b.class_days || 'Regular'}</span>
                                                        </div>
                                                        {b.class_time && (
                                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                                {b.class_time}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-[11px] text-slate-600 font-medium">
                                                        {b.teacher?.name || 'Assigned Instructor'}
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700 tabular-nums">
                                                        ৳ {Number(b.pivot?.monthly_fee || b.course?.fee || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-6 text-center text-xs text-slate-400">
                                                    No subjects or batches currently enrolled.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </SummaryCard>
                    </div>

                    {/* RIGHT (5 COLS): STUDENT & GUARDIAN DETAILS */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Student Personal Info */}
                        <SummaryCard
                            title="Student Information"
                            icon={User}
                            bodyClassName="p-3.5 space-y-1"
                        >
                            <SummaryCard.Row label="Full Name" value={student.name} />
                            <SummaryCard.Row label="Student ID" value={student.student_id} />
                            <SummaryCard.Row label="Gender" value={<span className="capitalize">{student.gender || 'N/A'}</span>} />
                            <SummaryCard.Row label="Date of Birth" value={student.dob || '—'} />
                            <SummaryCard.Row label="Contact Phone" value={student.phone || '—'} />
                            <SummaryCard.Row label="Email Address" value={student.email || '—'} />
                            <SummaryCard.Row label="School / College" value={student.school_college || '—'} />
                            <SummaryCard.Row label="Admission Date" value={student.admission_date || '—'} />
                            <SummaryCard.Row label="Present Address" value={student.address || '—'} />
                        </SummaryCard>

                        {/* Guardian Profile */}
                        <SummaryCard
                            title="Guardian & Emergency Contact"
                            icon={UserCheck}
                            bodyClassName="p-3.5 space-y-1"
                        >
                            <SummaryCard.Row label="Guardian Name" value={student.guardian_name || 'N/A'} />
                            <SummaryCard.Row label="Guardian Phone" value={student.guardian_phone || 'N/A'} />
                            {student.guardian?.email && (
                                <SummaryCard.Row label="Guardian Email" value={student.guardian.email} />
                            )}
                            <SummaryCard.Row label="Relationship" value={student.guardian_relation || 'Parent / Guardian'} />
                            {student.notes && (
                                <div className="pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
                                    <span className="font-bold text-slate-700 block mb-0.5">Remarks / Notes:</span>
                                    {student.notes}
                                </div>
                            )}
                        </SummaryCard>
                    </div>
                </div>
            )}

            {/* TAB: ATTENDANCE */}
            {activeTab === 'attendance' && (
                <SummaryCard
                    title="Attendance History"
                    icon={ClipboardCheck}
                    badge={
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                            {attendanceRate}% Overall Attendance
                        </span>
                    }
                    bodyClassName="p-0"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                <tr>
                                    <th className="py-2.5 px-3.5">Date</th>
                                    <th className="py-2.5 px-3.5">Subject / Course</th>
                                    <th className="py-2.5 px-3.5">Batch</th>
                                    <th className="py-2.5 px-3.5">Time / Session</th>
                                    <th className="py-2.5 px-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {attendances.length > 0 ? (
                                    attendances.map((a) => (
                                        <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-2.5 px-3.5 font-bold text-slate-800">{a.date}</td>
                                            <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                                                {a.class_routine?.subject?.name || a.batch?.course?.title || 'Academic Class'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-[11px] text-slate-600">
                                                {a.batch?.name || 'Class Batch'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                                                {a.class_routine ? `${a.class_routine.start_time} - ${a.class_routine.end_time}` : 'Regular'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-[4px] font-bold uppercase text-[10px] ${
                                                    a.status === 'present'
                                                        ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                                        : a.status === 'late'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                                                }`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                                            No attendance records found for this student.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </SummaryCard>
            )}

            {/* TAB: FEES & INVOICES */}
            {activeTab === 'fees' && (
                <SummaryCard
                    title="Fee Invoices & Payment History"
                    icon={Wallet}
                    badge={
                        <Link
                            href={route('admin.fees.index')}
                            className="text-[10.5px] font-bold text-[#16a34a] hover:underline"
                        >
                            + Collect Payment
                        </Link>
                    }
                    bodyClassName="p-0"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                <tr>
                                    <th className="py-2.5 px-3.5">Invoice No</th>
                                    <th className="py-2.5 px-3.5">Fee Title</th>
                                    <th className="py-2.5 px-3.5">Due Date</th>
                                    <th className="py-2.5 px-3.5 text-right">Amount</th>
                                    <th className="py-2.5 px-3.5 text-right">Paid</th>
                                    <th className="py-2.5 px-3.5 text-right">Due</th>
                                    <th className="py-2.5 px-3.5 text-center">Status</th>
                                    <th className="py-2.5 px-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {invoices.length > 0 ? (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-2.5 px-3.5 font-bold font-mono text-[#16a34a]">
                                                {inv.invoice_no}
                                            </td>
                                            <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                                                {inv.title}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                                                {inv.due_date || '—'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 tabular-nums">
                                                ৳ {Number(inv.net_amount || inv.amount).toLocaleString()}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700 tabular-nums">
                                                ৳ {Number(inv.paid_amount || 0).toLocaleString()}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-right font-bold text-rose-600 tabular-nums">
                                                ৳ {Number(inv.due_amount || 0).toLocaleString()}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-[4px] font-bold uppercase text-[10px] ${
                                                    inv.status === 'paid'
                                                        ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                                        : inv.status === 'partial'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                                                }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3.5 text-right">
                                                <Link
                                                    href={route('admin.fees.receipt', inv.id)}
                                                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                                                >
                                                    Receipt
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-xs text-slate-400">
                                            No fee invoices generated yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </SummaryCard>
            )}

            {/* TAB: EXAMS & RESULTS */}
            {activeTab === 'results' && (
                <SummaryCard
                    title="Academic Evaluations & Exam Results"
                    icon={Award}
                    badge={
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                            {results.length} Published Results
                        </span>
                    }
                    bodyClassName="p-0"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                <tr>
                                    <th className="py-2.5 px-3.5">Exam Title</th>
                                    <th className="py-2.5 px-3.5">Batch / Course</th>
                                    <th className="py-2.5 px-3.5">Exam Date</th>
                                    <th className="py-2.5 px-3.5 text-center">Marks</th>
                                    <th className="py-2.5 px-3.5 text-center">Percentage</th>
                                    <th className="py-2.5 px-3.5 text-center">Grade</th>
                                    <th className="py-2.5 px-3.5 text-center">GPA</th>
                                    <th className="py-2.5 px-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {results.length > 0 ? (
                                    results.map((res) => (
                                        <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-2.5 px-3.5 font-bold text-slate-900">
                                                {res.exam?.title || 'Academic Exam'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-slate-600 font-medium">
                                                {res.exam?.batch?.name || student.course?.title || 'Course'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                                                {res.exam?.exam_date || '—'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center font-bold tabular-nums">
                                                {res.obtained_marks} <span className="text-slate-400 font-normal">/ {res.total_marks}</span>
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center font-semibold tabular-nums">
                                                {res.percentage}%
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center font-bold text-emerald-700">
                                                {res.grade}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center font-bold tabular-nums">
                                                {Number(res.gpa || 0).toFixed(2)}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-[4px] font-bold uppercase text-[10px] ${
                                                    res.pass_status === 'pass'
                                                        ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                                                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                                                }`}>
                                                    {res.pass_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-xs text-slate-400">
                                            No published examination results available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </SummaryCard>
            )}

            {/* TAB: ASSIGNMENTS */}
            {activeTab === 'assignments' && (
                <SummaryCard
                    title="Assignments & Submissions"
                    icon={BookMarked}
                    badge={
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                            {assignments.length} Submissions
                        </span>
                    }
                    bodyClassName="p-0"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                <tr>
                                    <th className="py-2.5 px-3.5">Assignment</th>
                                    <th className="py-2.5 px-3.5">Course / Batch</th>
                                    <th className="py-2.5 px-3.5">Submitted At</th>
                                    <th className="py-2.5 px-3.5 text-center">Score / Marks</th>
                                    <th className="py-2.5 px-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {assignments.length > 0 ? (
                                    assignments.map((asg) => (
                                        <tr key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-2.5 px-3.5 font-bold text-slate-900">
                                                {asg.assignment?.title || 'Assignment Task'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-slate-600">
                                                {asg.assignment?.batch?.name || 'Academic Batch'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                                                {asg.submitted_at || asg.created_at || '—'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center font-bold">
                                                {asg.marks ? `${asg.marks} / ${asg.assignment?.total_marks || 100}` : 'Pending'}
                                            </td>
                                            <td className="py-2.5 px-3.5 text-center">
                                                <span className="px-2 py-0.5 rounded-[4px] font-bold uppercase text-[10px] bg-emerald-50 text-[#16a34a] border border-emerald-200">
                                                    {asg.status || 'submitted'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                                            No assignment submissions recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </SummaryCard>
            )}
        </AdminLayout>
    );
}
