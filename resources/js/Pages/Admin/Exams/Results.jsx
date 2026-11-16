import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Award, Printer, ArrowLeft, CheckCircle2, XCircle, 
    Edit, Search, Trophy, Medal, FileText, Percent, 
    Eye, X, Globe, Lock, Share2, Download, Check
} from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Results({ exam, results = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pass, fail
    const [showInstitutionalMarksheet, setShowInstitutionalMarksheet] = useState(false);
    const [selectedStudentSlip, setSelectedStudentSlip] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    // Calculate Summary Stats
    const totalStudents = results.length;
    const passedCount = results.filter(r => r.pass_status === 'pass').length;
    const failedCount = results.filter(r => r.pass_status !== 'pass').length;
    const passPercentage = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;
    const highestMarks = results.length > 0 ? Math.max(...results.map(r => Number(r.obtained_marks) || 0)) : 0;
    const averageMarks = totalStudents > 0 
        ? (results.reduce((acc, r) => acc + (Number(r.obtained_marks) || 0), 0) / totalStudents).toFixed(1)
        : 0;
    const averageGpa = totalStudents > 0
        ? (results.reduce((acc, r) => acc + (Number(r.gpa) || 0), 0) / totalStudents).toFixed(2)
        : '0.00';

    // Client-side filtering
    const filteredResults = useMemo(() => {
        return results.filter((res) => {
            const matchesSearch = !search ||
                res.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
                res.student?.student_id?.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;

            if (statusFilter === 'pass') return res.pass_status === 'pass';
            if (statusFilter === 'fail') return res.pass_status !== 'pass';
            return true;
        });
    }, [results, search, statusFilter]);

    const handleTogglePublish = () => {
        setIsPublishing(true);
        router.post(route('admin.exams.publish', exam.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsPublishing(false)
        });
    };

    const handlePrintDocument = () => {
        window.print();
    };

    // Rank badge helper
    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                    <Trophy size={11} className="text-amber-500" />
                    <span>#1</span>
                </span>
            );
        }
        if (rank === 2) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px]">
                    <Medal size={11} className="text-slate-500" />
                    <span>#2</span>
                </span>
            );
        }
        if (rank === 3) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-orange-50 text-orange-700 border border-orange-200 font-bold text-[11px]">
                    <Medal size={11} className="text-orange-500" />
                    <span>#3</span>
                </span>
            );
        }
        return <span className="font-bold text-slate-400 tabular-nums text-xs">#{rank}</span>;
    };

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

    const isPublished = exam.status === 'published';

    return (
        <AdminLayout>
            <Head title={`Results - ${exam.title}`} />

            {/* Header (Hidden on print) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 print:hidden">
                <div>
                    <Link
                        href={route('admin.exams.index')}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
                    >
                        <ArrowLeft size={13} /> Back to exams
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Exam marksheet & results</h1>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            isPublished 
                                ? 'bg-emerald-50 text-[#16a34a] border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            {isPublished ? <Globe size={11} /> : <Lock size={11} />}
                            {isPublished ? 'Published to student portal' : 'Unpublished (Draft)'}
                        </span>
                    </div>
                    <p className="text-xs text-[#6d7175]">Auto-computed GPAs, grades & rankings for coaching evaluations.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleTogglePublish}
                        disabled={isPublishing}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-[3px] transition-all cursor-pointer shadow-2xs border ${
                            isPublished
                                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                        }`}
                        title={isPublished ? "Unpublish results to hide from students" : "Publish results so students can view them"}
                    >
                        {isPublished ? <Lock size={13} /> : <Globe size={13} />}
                        <span>{isPublished ? 'Unpublish' : 'Publish result'}</span>
                    </button>

                    <Link
                        href={route('admin.exams.marks', exam.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-[3px] transition-all shadow-2xs"
                    >
                        <Edit size={13} /> Edit marks
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowInstitutionalMarksheet(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Printer size={13} /> Print marksheet
                    </button>
                </div>
            </div>

            {/* Official Header for Direct Browser Print Only */}
            <div className="hidden print:block text-center border-b border-slate-300 pb-4 mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apex Coaching Center</h2>
                <h3 className="text-sm font-bold text-emerald-800 mt-1">Official Exam Marksheet & Rank List</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                    <b>Exam:</b> {exam.title} &nbsp;|&nbsp; <b>Batch:</b> {exam.batch?.name} &nbsp;|&nbsp; <b>Date:</b> {exam.exam_date} &nbsp;|&nbsp; <b>Full Marks:</b> {exam.total_marks} &nbsp;|&nbsp; <b>Pass Marks:</b> {exam.pass_marks}
                </p>
            </div>

            {/* Exam Meta Info Card (Hidden on print) */}
            <div className="bg-white px-4 py-3 rounded-[4px] border border-slate-200/80 shadow-2xs mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[3px] bg-emerald-50 border border-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                        <Award size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-slate-900">{exam.title}</h2>
                            <span className="text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                {exam.batch?.name || 'Batch'}
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                            {exam.course?.title || 'Coaching exam'} • Date: {exam.exam_date} • Full marks: {exam.total_marks} (Pass: {exam.pass_marks})
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-5 text-xs text-slate-600 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Total students</span>
                        <b className="text-slate-800 font-bold tabular-nums">{totalStudents}</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Pass rate</span>
                        <b className="text-[#16a34a] font-bold tabular-nums">{passPercentage}%</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Highest score</span>
                        <b className="text-slate-800 font-bold tabular-nums">{highestMarks} / {exam.total_marks}</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Avg. GPA</span>
                        <b className="text-[#16a34a] font-bold tabular-nums">{averageGpa}</b>
                    </div>
                </div>
            </div>

            {/* Marksheet Table Container */}
            <div className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden print:border-none print:shadow-none">
                {/* Interactive Toolbar (Hidden on print) */}
                <div className="px-3.5 py-2.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 print:hidden">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by student name or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-8 pl-8 pr-2.5 text-xs rounded-[3px] border border-slate-200 bg-white placeholder:text-slate-400 focus:border-[#16a34a] focus:ring-0 outline-none"
                            />
                        </div>

                        {/* Filter Status Pills */}
                        <div className="inline-flex rounded-[3px] border border-slate-200 bg-white p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    statusFilter === 'all' ? 'bg-[#16a34a] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                All ({totalStudents})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('pass')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    statusFilter === 'pass' ? 'bg-[#16a34a] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Passed ({passedCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('fail')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    statusFilter === 'fail' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Failed ({failedCount})
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold whitespace-nowrap">
                        <span>Average score: <b className="text-slate-800">{averageMarks}</b> / {exam.total_marks}</span>
                    </div>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 print:bg-slate-100 print:text-black">
                            <tr>
                                <th className="px-3.5 py-2.5 w-14 text-center">Rank</th>
                                <th className="px-3.5 py-2.5">Student ID</th>
                                <th className="px-3.5 py-2.5">Student name</th>
                                <th className="px-3.5 py-2.5 text-center">Marks obtained</th>
                                <th className="px-3.5 py-2.5 text-center">Percentage</th>
                                <th className="px-3.5 py-2.5 text-center">Grade</th>
                                <th className="px-3.5 py-2.5 text-center">GPA</th>
                                <th className="px-3.5 py-2.5 text-center">Status</th>
                                <th className="px-3.5 py-2.5 text-right print:hidden">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80 bg-white">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((res, index) => {
                                    const rank = index + 1;
                                    const isPassed = res.pass_status === 'pass';

                                    return (
                                        <tr 
                                            key={res.id} 
                                            className="hover:bg-slate-50/70 transition-colors"
                                        >
                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                {getRankBadge(rank)}
                                            </td>

                                            <td className="px-3.5 py-2 whitespace-nowrap font-bold text-[#16a34a] font-mono text-[11px]">
                                                {res.student?.student_id || '—'}
                                            </td>

                                            <td className="px-3.5 py-2 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-[3px] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 print:hidden">
                                                        {res.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-xs">
                                                        {res.student?.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <span className="font-bold text-slate-900 tabular-nums">
                                                    {res.obtained_marks}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-normal"> / {res.total_marks}</span>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap font-medium text-slate-700 tabular-nums">
                                                {res.percentage}%
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <span className={`inline-block px-2 py-0.5 rounded-[3px] font-bold text-[11px] border ${getGradeBadge(res.grade)}`}>
                                                    {res.grade}
                                                </span>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap font-bold text-slate-800 tabular-nums">
                                                {Number(res.gpa).toFixed(2)}
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold capitalize border ${
                                                    isPassed
                                                        ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                                                        : 'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}>
                                                    {isPassed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                    {isPassed ? 'Passed' : 'Failed'}
                                                </span>
                                            </td>

                                            <td className="px-3.5 py-2 text-right whitespace-nowrap print:hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedStudentSlip({ ...res, rank })}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-[3px] text-[11px] font-semibold transition-colors cursor-pointer"
                                                >
                                                    <FileText size={12} className="text-[#16a34a]" />
                                                    <span>View slip</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                                        No results found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Summary (Print-hidden) */}
                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>Total evaluated: <b className="text-slate-800">{totalStudents}</b></span>
                        <span className="text-emerald-700">Passed: <b>{passedCount}</b></span>
                        <span className="text-rose-600">Failed: <b>{failedCount}</b></span>
                        <span className="text-slate-400">|</span>
                        <span>Average GPA: <b className="text-[#16a34a]">{averageGpa}</b></span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.exams.index')}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-[3px] transition-colors"
                        >
                            Back to exams
                        </Link>
                        <button
                            type="button"
                            onClick={() => setShowInstitutionalMarksheet(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                        >
                            <Printer size={13} />
                            <span>Print marksheet</span>
                        </button>
                    </div>
                </div>

                {/* Signature Block for Direct Print */}
                <div className="hidden print:grid grid-cols-3 gap-8 pt-16 px-6 text-center text-xs text-slate-700">
                    <div className="border-t border-slate-400 pt-2">
                        <p className="font-bold">Subject teacher</p>
                        <p className="text-[10px] text-slate-500">Evaluated & verified</p>
                    </div>
                    <div className="border-t border-slate-400 pt-2">
                        <p className="font-bold">Head of academics</p>
                        <p className="text-[10px] text-slate-500">Reviewed</p>
                    </div>
                    <div className="border-t border-slate-400 pt-2">
                        <p className="font-bold">Principal / Director</p>
                        <p className="text-[10px] text-slate-500">Approved official seal</p>
                    </div>
                </div>
            </div>

            {/* MODAL 1: DEDICATED INSTITUTIONAL MARKSHEET PREVIEW VIEW */}
            {showInstitutionalMarksheet && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="bg-white max-w-4xl w-full rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
                        {/* Modal Action Bar (Print-Hidden) */}
                        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold tracking-tight">Institutional marksheet document preview</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrintDocument}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer shadow-sm"
                                >
                                    <Printer size={13} /> Print document
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowInstitutionalMarksheet(false)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Printable Marksheet Document Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-6 print:overflow-visible">
                            {/* Academic Institution Header */}
                            <div className="text-center border-b-2 border-slate-800 pb-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-xl mb-2 shadow-sm">
                                    A
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apex Coaching Center</h2>
                                <p className="text-xs text-slate-500 font-medium">Excellence in Academic Coaching & Competitive Preparation</p>
                                <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-800 tracking-wide">
                                    Official examination marksheet & tabulations
                                </div>
                            </div>

                            {/* Examination Meta Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-[3px] text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[10.5px]">Exam title</span>
                                    <span className="font-bold text-slate-800">{exam.title}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10.5px]">Batch / Program</span>
                                    <span className="font-bold text-slate-800">{exam.batch?.name || 'All Batches'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10.5px]">Exam date</span>
                                    <span className="font-bold text-slate-800">{exam.exam_date}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10.5px]">Grading criteria</span>
                                    <span className="font-bold text-slate-800">{exam.total_marks} Marks (Pass: {exam.pass_marks})</span>
                                </div>
                            </div>

                            {/* Academic Performance Snapshot */}
                            <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 border-y border-dashed border-slate-300">
                                <div>
                                    <span className="text-slate-400 text-[10.5px] block">Total examinees</span>
                                    <b className="text-slate-900 font-bold">{totalStudents}</b>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10.5px] block">Passed students</span>
                                    <b className="text-emerald-700 font-bold">{passedCount} ({passPercentage}%)</b>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10.5px] block">Failed candidates</span>
                                    <b className="text-rose-600 font-bold">{failedCount}</b>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10.5px] block">Average score</span>
                                    <b className="text-[#16a34a] font-bold">{averageMarks} / {exam.total_marks}</b>
                                </div>
                            </div>

                            {/* Marksheet Ranked Table */}
                            <div className="border border-slate-300 rounded-[3px] overflow-hidden">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                                        <tr>
                                            <th className="p-2 text-center border-r border-slate-300 w-12">Rank</th>
                                            <th className="p-2 border-r border-slate-300">Student ID</th>
                                            <th className="p-2 border-r border-slate-300">Student name</th>
                                            <th className="p-2 text-center border-r border-slate-300">Marks</th>
                                            <th className="p-2 text-center border-r border-slate-300">%</th>
                                            <th className="p-2 text-center border-r border-slate-300">Grade</th>
                                            <th className="p-2 text-center border-r border-slate-300">GPA</th>
                                            <th className="p-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {results.map((res, i) => (
                                            <tr key={res.id} className={i % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                                                <td className="p-2 text-center font-bold border-r border-slate-200 text-slate-700">
                                                    #{i + 1}
                                                </td>
                                                <td className="p-2 font-mono font-bold text-slate-800 border-r border-slate-200">
                                                    {res.student?.student_id || '—'}
                                                </td>
                                                <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                                                    {res.student?.name}
                                                </td>
                                                <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">
                                                    {res.obtained_marks} / {res.total_marks}
                                                </td>
                                                <td className="p-2 text-center border-r border-slate-200 font-medium">
                                                    {res.percentage}%
                                                </td>
                                                <td className="p-2 text-center border-r border-slate-200 font-bold text-slate-800">
                                                    {res.grade}
                                                </td>
                                                <td className="p-2 text-center border-r border-slate-200 font-bold text-slate-800">
                                                    {Number(res.gpa).toFixed(2)}
                                                </td>
                                                <td className="p-2 text-center font-bold">
                                                    <span className={res.pass_status === 'pass' ? 'text-emerald-700' : 'text-rose-600'}>
                                                        {res.pass_status === 'pass' ? 'PASS' : 'FAIL'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Signatures & Seal */}
                            <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs text-slate-700">
                                <div className="border-t border-slate-400 pt-2">
                                    <p className="font-bold text-slate-900">Subject Instructor</p>
                                    <p className="text-[10.5px] text-slate-500">Evaluated & Verified</p>
                                </div>
                                <div className="border-t border-slate-400 pt-2">
                                    <p className="font-bold text-slate-900">Academic Coordinator</p>
                                    <p className="text-[10.5px] text-slate-500">Cross-Checked</p>
                                </div>
                                <div className="border-t border-slate-400 pt-2">
                                    <p className="font-bold text-slate-900">Principal / Exam Controller</p>
                                    <p className="text-[10.5px] text-slate-500">Official Institutional Seal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL 2: INDIVIDUAL STUDENT MARKSHEET SLIP MODAL */}
            {selectedStudentSlip && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="bg-white max-w-lg w-full rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col print:shadow-none print:border-none">
                        {/* Slip Header Actions */}
                        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold">Student marksheet slip</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrintDocument}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-colors cursor-pointer shadow-sm"
                                >
                                    <Printer size={13} /> Print slip
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudentSlip(null)}
                                    className="p-1 text-slate-400 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Slip Printable Card */}
                        <div className="p-6 space-y-5 print:p-6">
                            <div className="text-center border-b border-slate-200 pb-3">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-lg mb-1 shadow-sm">
                                    A
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Apex Coaching Center</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Individual Academic Marksheet Slip</p>
                            </div>

                            {/* Student Metadata Card */}
                            <div className="bg-slate-50 p-3.5 rounded-[4px] border border-slate-200 text-xs space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student name:</span>
                                    <b className="text-slate-900">{selectedStudentSlip.student?.name}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student ID:</span>
                                    <b className="text-[#16a34a] font-mono">{selectedStudentSlip.student?.student_id || 'N/A'}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Batch:</span>
                                    <b className="text-slate-800">{exam.batch?.name || 'N/A'}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Examination:</span>
                                    <b className="text-slate-800">{exam.title}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date:</span>
                                    <span className="text-slate-700">{exam.exam_date}</span>
                                </div>
                            </div>

                            {/* Marks & Performance Grid */}
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-[3px]">
                                    <span className="text-[10.5px] text-emerald-800 font-semibold block">Obtained marks</span>
                                    <div className="text-xl font-black text-[#16a34a] mt-0.5">
                                        {selectedStudentSlip.obtained_marks}
                                        <span className="text-xs font-normal text-slate-400"> / {selectedStudentSlip.total_marks}</span>
                                    </div>
                                    <span className="text-[10.5px] text-slate-500">{selectedStudentSlip.percentage}%</span>
                                </div>

                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[3px]">
                                    <span className="text-[10.5px] text-slate-600 font-semibold block">Grade & GPA</span>
                                    <div className="text-xl font-black text-slate-900 mt-0.5">
                                        {selectedStudentSlip.grade}
                                        <span className="text-xs font-normal text-slate-500"> ({Number(selectedStudentSlip.gpa).toFixed(2)})</span>
                                    </div>
                                    <span className={`text-[10.5px] font-bold ${selectedStudentSlip.pass_status === 'pass' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                        {selectedStudentSlip.pass_status === 'pass' ? 'PASSED' : 'FAILED'} (Rank #{selectedStudentSlip.rank})
                                    </span>
                                </div>
                            </div>

                            {/* Evaluation Note */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-[3px] text-[11px] text-slate-600">
                                <b>Academic remark: </b>
                                {selectedStudentSlip.grade === 'A+' ? 'Exceptional academic performance! Keep up the brilliant standard.' :
                                 selectedStudentSlip.grade === 'A' ? 'Very good performance. Consistent study will yield top results.' :
                                 selectedStudentSlip.grade === 'B' ? 'Satisfactory. Needs additional practice in complex problem-solving.' :
                                 'Needs active academic guidance and extra tutorial assistance.'}
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between pt-8 text-center text-xs text-slate-600">
                                <div className="border-t border-slate-400 pt-1 w-32">
                                    <p className="text-[10.5px] font-bold">Evaluator Signature</p>
                                </div>
                                <div className="border-t border-slate-400 pt-1 w-32">
                                    <p className="text-[10.5px] font-bold">Director / Controller</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
