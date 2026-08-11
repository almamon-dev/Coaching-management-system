import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    User, Calendar, Phone, Mail, MapPin, GraduationCap, FolderKanban, Shield,
    ClipboardCheck, Wallet, FileQuestion, Award, BookMarked, FileCode, CheckCircle
} from 'lucide-react';

export default function StudentShow({ student }) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
        { id: 'fees', label: 'Fees & Invoices', icon: Wallet },
        { id: 'exams', label: 'Exams & Marks', icon: FileQuestion },
        { id: 'results', label: 'Results & GPA', icon: Award },
        { id: 'assignments', label: 'Assignments', icon: BookMarked },
    ];

    return (
        <AdminLayout>
            <Head title={`Student Profile - ${student.name}`} />

            {/* STUDENT HEADER CARD */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                {student.status}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-emerald-700 mt-0.5">Student ID: {student.student_id}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{student.course?.title} • {student.batch?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.fees.index')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-sm"
                    >
                        Collect Payment
                    </Link>
                    <Link
                        href={route('admin.students.index')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg"
                    >
                        Back to List
                    </Link>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 mb-6 pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                        >
                            <Icon size={14} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div><span className="text-slate-500 block">Gender:</span><span className="font-semibold text-slate-800 capitalize">{student.gender}</span></div>
                            <div><span className="text-slate-500 block">Date of Birth:</span><span className="font-semibold text-slate-800">{student.dob || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block">Phone:</span><span className="font-semibold text-slate-800">{student.phone || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block">Email:</span><span className="font-semibold text-slate-800">{student.email || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block">School/College:</span><span className="font-semibold text-slate-800">{student.school_college || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block">Admission Date:</span><span className="font-semibold text-slate-800">{student.admission_date || 'N/A'}</span></div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Guardian Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div><span className="text-slate-500 block">Guardian Name:</span><span className="font-semibold text-slate-800">{student.guardian_name || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block">Guardian Phone:</span><span className="font-semibold text-slate-800">{student.guardian_phone || 'N/A'}</span></div>
                            <div className="col-span-2"><span className="text-slate-500 block">Address:</span><span className="font-semibold text-slate-800">{student.address || 'N/A'}</span></div>
                            <div className="col-span-2"><span className="text-slate-500 block">Notes:</span><span className="font-semibold text-slate-800">{student.notes || 'No extra remarks'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Attendance History</h3>
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b text-slate-500">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Subject</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {student.attendances?.length > 0 ? (
                                student.attendances.map(a => (
                                    <tr key={a.id}>
                                        <td className="p-3 font-semibold text-slate-800">{a.date}</td>
                                        <td className="p-3 text-slate-600">{a.class_routine?.subject?.name || 'N/A'}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan="3" className="p-4 text-center text-slate-400">No attendance history available.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'fees' && (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Fee Invoices & Payments</h3>
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b text-slate-500">
                            <tr>
                                <th className="p-3">Invoice No</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Paid</th>
                                <th className="p-3">Due</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {student.fee_invoices?.length > 0 ? (
                                student.fee_invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="p-3 font-bold text-slate-900">{inv.invoice_no}</td>
                                        <td className="p-3 text-slate-700">{inv.title}</td>
                                        <td className="p-3 font-semibold">৳ {inv.net_amount}</td>
                                        <td className="p-3 text-emerald-600 font-semibold">৳ {inv.paid_amount}</td>
                                        <td className="p-3 text-rose-600 font-semibold">৳ {inv.due_amount}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan="6" className="p-4 text-center text-slate-400">No invoices recorded.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'results' && (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Academic Exam Results</h3>
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b text-slate-500">
                            <tr>
                                <th className="p-3">Exam</th>
                                <th className="p-3">Marks</th>
                                <th className="p-3">Percentage</th>
                                <th className="p-3">Grade</th>
                                <th className="p-3">GPA</th>
                                <th className="p-3">Pass/Fail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {student.results?.length > 0 ? (
                                student.results.map(res => (
                                    <tr key={res.id}>
                                        <td className="p-3 font-bold text-slate-900">{res.exam?.title}</td>
                                        <td className="p-3">{res.obtained_marks} / {res.total_marks}</td>
                                        <td className="p-3">{res.percentage}%</td>
                                        <td className="p-3 font-bold text-emerald-700">{res.grade}</td>
                                        <td className="p-3 font-bold">{res.gpa}</td>
                                        <td className="p-3 font-semibold uppercase">{res.pass_status}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan="6" className="p-4 text-center text-slate-400">No result published yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
