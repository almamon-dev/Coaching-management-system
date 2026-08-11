import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Award, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Results({ exam, results }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title={`Results - ${exam.title}`} />

            <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exam Marksheet & Results</h1>
                    <p className="text-sm text-slate-500">Auto-computed GPA, Grades and Rankings for <b>{exam.title}</b> ({exam.batch?.name}).</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={route('admin.exams.index')} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg flex items-center gap-1">
                        <ArrowLeft size={16} /> Back to Exams
                    </Link>
                    <button onClick={handlePrint} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5">
                        <Printer size={16} /> Print Marksheet
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm print:shadow-none print:border-none print:p-0">
                <div className="text-center border-b pb-4 mb-6 hidden print:block">
                    <h2 className="text-xl font-bold text-slate-900">Apex Coaching Center</h2>
                    <h3 className="text-sm font-semibold text-emerald-700">Official Marksheet: {exam.title}</h3>
                    <p className="text-xs text-slate-500">Batch: {exam.batch?.name} • Date: {exam.exam_date}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b font-bold text-slate-700 uppercase">
                            <tr>
                                <th className="p-3">Rank</th>
                                <th className="p-3">Student ID</th>
                                <th className="p-3">Student Name</th>
                                <th className="p-3 text-right">Marks Obtained</th>
                                <th className="p-3 text-center">Percentage</th>
                                <th className="p-3 text-center">Grade</th>
                                <th className="p-3 text-center">GPA</th>
                                <th className="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {results.length > 0 ? (
                                results.map((res, index) => (
                                    <tr key={res.id} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-bold text-slate-400">#{index + 1}</td>
                                        <td className="p-3 font-bold text-emerald-700">{res.student?.student_id}</td>
                                        <td className="p-3 font-semibold text-slate-900">{res.student?.name}</td>
                                        <td className="p-3 text-right font-bold text-slate-900">{res.obtained_marks} / {res.total_marks}</td>
                                        <td className="p-3 text-center font-medium">{res.percentage}%</td>
                                        <td className="p-3 text-center font-bold text-emerald-700 text-sm">{res.grade}</td>
                                        <td className="p-3 text-center font-bold">{res.gpa}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                res.pass_status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {res.pass_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="p-8 text-center text-slate-500">No results recorded yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
