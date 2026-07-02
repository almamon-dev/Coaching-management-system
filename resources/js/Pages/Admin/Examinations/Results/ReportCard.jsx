import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, GraduationCap, School } from 'lucide-react';

export default function ReportCard({ result, marks, grades }) {
    
    // Optional auto-print or just simple print button
    const handlePrint = () => {
        window.print();
    };

    const schoolName = "School SMS System";
    const schoolAddress = "123 Education Street, Learning City, 12345";
    const schoolPhone = "+1 234 567 890";
    const schoolEmail = "info@schoolsms.com";

    // Format Date
    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800">
            <Head title={`Report Card - ${result.student.name}`} />

            {/* Non-Printable Header/Toolbar */}
            <div className="print:hidden bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link 
                        href={route('admin.results.publish', {
                            exam_id: result.exam_id,
                            class_id: result.academic_class_id,
                            section_id: result.section_id
                        })}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-[14px] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Results
                    </Link>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2 bg-[#008060] text-white rounded-[4px] font-bold text-[13px] hover:bg-[#006e52] shadow-sm transition-all active:scale-[0.98]"
                    >
                        <Printer size={16} />
                        Print Report Card
                    </button>
                </div>
            </div>

            {/* Printable A4 Page */}
            <div className="py-8 print:py-0 w-full flex justify-center">
                <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl print:shadow-none p-[20mm] relative">
                    
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                        <GraduationCap size={400} />
                    </div>

                    <div className="relative z-10">
                        {/* School Header */}
                        <div className="flex flex-col items-center justify-center border-b-2 border-[#008060] pb-6 mb-8 text-center">
                            <div className="w-16 h-16 bg-[#e6f2ef] text-[#008060] rounded-full flex items-center justify-center mb-3">
                                <School size={32} />
                            </div>
                            <h1 className="text-[28px] font-black text-slate-900 tracking-tight uppercase">{schoolName}</h1>
                            <p className="text-[13px] text-slate-600 mt-1">{schoolAddress}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">Phone: {schoolPhone} | Email: {schoolEmail}</p>
                            <div className="mt-5 inline-block px-6 py-2 bg-[#008060] text-white rounded-full font-bold text-[14px] tracking-widest uppercase shadow-sm">
                                Academic Report Card
                            </div>
                        </div>

                        {/* Student Information */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-3">
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Student Name</span>
                                    <span className="font-bold text-[14px] text-slate-900">: {result.student.name}</span>
                                </div>
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Student ID</span>
                                    <span className="font-bold text-[14px] text-slate-900">: STU-{result.student.id.toString().padStart(5, '0')}</span>
                                </div>
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Class & Section</span>
                                    <span className="font-bold text-[14px] text-slate-900">: {result.academic_class.name} - {result.section.name}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Examination</span>
                                    <span className="font-bold text-[14px] text-slate-900">: {result.exam.name}</span>
                                </div>
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Session</span>
                                    <span className="font-bold text-[14px] text-slate-900">: {new Date(result.exam.start_date).getFullYear()}</span>
                                </div>
                                <div className="flex border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-32 text-[13px] font-bold text-slate-600">Issue Date</span>
                                    <span className="font-bold text-[14px] text-slate-900">: {today}</span>
                                </div>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <div className="mb-8 border border-slate-800 rounded-[4px] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f4f6f8]">
                                        <th className="py-3 px-4 text-[13px] font-bold uppercase tracking-wider w-16 text-center border-r border-slate-700 text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">SL</th>
                                        <th className="py-3 px-4 text-[13px] font-bold uppercase tracking-wider border-r border-slate-700 text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Subject Name</th>
                                        <th className="py-3 px-4 text-[13px] font-bold uppercase tracking-wider text-center border-r border-slate-700 text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Full Marks</th>
                                        <th className="py-3 px-4 text-[13px] font-bold uppercase tracking-wider text-center border-r border-slate-700 text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Obtained</th>
                                        <th className="py-3 px-4 text-[13px] font-bold uppercase tracking-wider text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.map((mark, idx) => {
                                        // Calculate Grade for specific mark
                                        let subjectGradeObj = grades.find(g => mark.marks >= g.min_mark);
                                        if (!subjectGradeObj) subjectGradeObj = grades[grades.length - 1]; // Fallback to last (usually F)
                                        
                                        return (
                                            <tr key={mark.id} className="border-b border-slate-200 last:border-b-0 print:border-slate-300">
                                                <td className="py-3 px-4 text-[13px] font-bold text-slate-600 text-center border-r border-slate-200 print:border-slate-300">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </td>
                                                <td className="py-3 px-4 text-[13px] font-bold text-slate-800 border-r border-slate-200 print:border-slate-300">
                                                    {mark.subject.name}
                                                </td>
                                                <td className="py-3 px-4 text-[13px] font-medium text-slate-600 text-center border-r border-slate-200 print:border-slate-300">
                                                    100
                                                </td>
                                                <td className="py-3 px-4 text-[14px] font-bold text-slate-900 text-center border-r border-slate-200 print:border-slate-300">
                                                    {mark.marks}
                                                </td>
                                                <td className="py-3 px-4 text-[14px] font-bold text-center">
                                                    <span className={`${subjectGradeObj?.name === 'F' ? 'text-red-600' : 'text-[#008060]'}`}>
                                                        {subjectGradeObj?.name || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary & Result */}
                        <div className="flex gap-8 mb-12">
                            {/* Grading Scale */}
                            <div className="w-1/3">
                                <table className="w-full text-left border border-slate-300 text-[11px]">
                                    <thead>
                                        <tr className="bg-[#f4f6f8]">
                                            <th className="py-1.5 px-2 font-bold border-r border-slate-300 text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Marks</th>
                                            <th className="py-1.5 px-2 font-bold border-r border-slate-300 text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Grade</th>
                                            <th className="py-1.5 px-2 font-bold text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Point</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {grades.map(g => (
                                            <tr key={g.id}>
                                                <td className="py-1.5 px-2 border-r border-slate-300">{g.min_mark} - {g.max_mark}</td>
                                                <td className="py-1.5 px-2 border-r border-slate-300 text-center font-bold">{g.name}</td>
                                                <td className="py-1.5 px-2 text-center">{g.grade_point}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Final Calculation */}
                            <div className="w-2/3 flex flex-col justify-end">
                                <div className="bg-[#f8fafc] border border-slate-200 rounded-[8px] p-6 print:bg-white print:border-slate-400">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Marks</p>
                                            <p className="text-[24px] font-black text-slate-800">{result.total_marks}</p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grade Point Average (GPA)</p>
                                            <p className="text-[24px] font-black text-[#008060]">{result.gpa}</p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Final Grade</p>
                                            <p className={`text-[24px] font-black ${result.grade === 'F' ? 'text-red-600' : 'text-[#008060]'}`}>{result.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Result Status</p>
                                            <div className="mt-1">
                                                <span className={`px-3 py-1 rounded-[4px] text-[13px] font-bold uppercase tracking-wider border ${result.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 print:border-none print:p-0 print:text-[#008060]' : 'bg-red-50 text-red-700 border-red-200 print:border-none print:p-0 print:text-red-600'}`}>
                                                    {result.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-200">
                                        <p className="text-[13px] font-medium text-slate-700 italic">
                                            <span className="font-bold not-italic">Remarks:</span> {result.status === 'Passed' ? 'Excellent performance. Keep it up!' : 'Needs improvement in the next examination.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-3 gap-8 mt-20 pt-8 text-center border-t border-slate-200 print:border-slate-400">
                            <div>
                                <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
                                    <p className="text-[14px] font-bold text-slate-800">Class Teacher</p>
                                </div>
                            </div>
                            <div>
                                <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
                                    <p className="text-[14px] font-bold text-slate-800">Guardian</p>
                                </div>
                            </div>
                            <div>
                                <div className="border-t border-slate-400 w-3/4 mx-auto pt-2">
                                    <p className="text-[14px] font-bold text-slate-800">Principal / Headmaster</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-8 print:mt-12 text-[10px] text-slate-400 font-medium">
                            * This is a system-generated document and does not require a physical signature for digital validation.
                        </div>

                    </div>
                </div>
            </div>
            
            {/* Global Print Styles Injection */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
                }
            `}} />
        </div>
    );
}
