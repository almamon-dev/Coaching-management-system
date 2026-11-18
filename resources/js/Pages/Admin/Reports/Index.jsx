import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Printer } from 'lucide-react';

export default function ReportIndex({ type, batches, data, filters }) {
    const [reportType, setReportType] = useState(type || 'students');

    const handleTypeChange = (newType) => {
        setReportType(newType);
        router.get(route('admin.reports.index'), { type: newType }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title="Reports & Analytics" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-sm text-slate-500">Generate printable and exportable reports for students, attendance, fees & finances.</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-sm cursor-pointer transition-all"
                >
                    <Printer size={16} /> Print Report
                </button>
            </div>

            {/* REPORT TYPE TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 mb-6 print:hidden">
                {[
                    { id: 'students', label: 'Student Reports' },
                    { id: 'attendance', label: 'Attendance Reports' },
                    { id: 'fees', label: 'Fee Collection Reports' },
                    { id: 'financial', label: 'Financial Summary' },
                    { id: 'academic', label: 'Academic Performance' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleTypeChange(t.id)}
                        className={`px-4 py-2 text-xs font-bold rounded-[3px] transition-all cursor-pointer ${reportType === t.id ? 'bg-[#16a34a] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* REPORT CONTAINER */}
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-sm print:border-none print:shadow-none print:p-0">
                <div className="text-center border-b border-slate-100 pb-4 mb-6 hidden print:block">
                    <h2 className="text-xl font-bold text-slate-900">Apex Coaching & Learning Center</h2>
                    <h3 className="text-sm font-bold text-[#16a34a] uppercase tracking-widest mt-0.5">Official {reportType} Report</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Generated on {new Date().toLocaleDateString()}</p>
                </div>

                {reportType === 'students' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Course</th>
                                    <th className="p-3">Batch</th>
                                    <th className="p-3">Guardian Phone</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {Array.isArray(data) && data.map(st => (
                                    <tr key={st.id} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-bold text-[#16a34a]">{st.student_id}</td>
                                        <td className="p-3 font-bold text-slate-900">{st.name}</td>
                                        <td className="p-3 text-slate-700">{st.course?.title || 'N/A'}</td>
                                        <td className="p-3 text-slate-700">{st.batch?.name || 'N/A'}</td>
                                        <td className="p-3 text-slate-600">{st.guardian_phone || 'N/A'}</td>
                                        <td className="p-3 font-bold text-[#16a34a] uppercase">{st.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {reportType === 'financial' && data.total_income !== undefined && (
                    <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4 p-5 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                            <div>
                                <span className="text-slate-500 font-semibold block uppercase text-[11px]">Total Operational Income</span>
                                <span className="text-xl font-black text-[#16a34a]">৳ {data.total_income.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-semibold block uppercase text-[11px]">Total Operational Expense</span>
                                <span className="text-xl font-black text-rose-600">৳ {data.total_expense.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
