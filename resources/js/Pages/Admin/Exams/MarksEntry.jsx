import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    ArrowLeft, CheckCircle2, UserX, Award, Calendar, 
    FileText, Search, UserCheck, AlertCircle 
} from 'lucide-react';

export default function MarksEntry({ exam, students = [], existingMarks = {} }) {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, present, absent

    const initialMarks = {};
    students.forEach(st => {
        const key = `${st.id}_0`;
        initialMarks[st.id] = {
            obtained_marks: existingMarks[key] ? existingMarks[key].obtained_marks : '',
            is_absent: existingMarks[key] ? Boolean(existingMarks[key].is_absent) : false,
        };
    });

    const { data, setData, post, processing } = useForm({
        marks: initialMarks,
    });

    const handleMarksChange = (studentId, field, val) => {
        setData('marks', {
            ...data.marks,
            [studentId]: {
                ...data.marks[studentId],
                [field]: val,
            }
        });
    };

    const toggleAbsent = (studentId) => {
        const current = data.marks[studentId];
        const newAbsent = !current?.is_absent;
        setData('marks', {
            ...data.marks,
            [studentId]: {
                ...current,
                is_absent: newAbsent,
                obtained_marks: newAbsent ? 0 : (current.obtained_marks || ''),
            }
        });
    };

    const handleMarkAllFull = () => {
        const updated = { ...data.marks };
        students.forEach(st => {
            if (!updated[st.id]?.is_absent) {
                updated[st.id] = {
                    ...updated[st.id],
                    obtained_marks: exam.total_marks,
                };
            }
        });
        setData('marks', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.exams.marks.store', exam.id));
    };

    // Filter students
    const filteredStudents = useMemo(() => {
        return students.filter((st) => {
            const stMarks = data.marks[st.id] || { obtained_marks: '', is_absent: false };
            const matchesSearch = !search || 
                st.name?.toLowerCase().includes(search.toLowerCase()) ||
                st.student_id?.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;

            if (filterStatus === 'absent') return stMarks.is_absent;
            if (filterStatus === 'present') return !stMarks.is_absent;
            return true;
        });
    }, [students, data.marks, search, filterStatus]);

    // Summary calculation
    const totalCount = students.length;
    const absentCount = students.filter(st => data.marks[st.id]?.is_absent).length;
    const presentCount = totalCount - absentCount;
    const filledCount = students.filter(st => {
        const m = data.marks[st.id];
        return m?.is_absent || (m?.obtained_marks !== '' && m?.obtained_marks !== undefined);
    }).length;

    // Helper to compute grade preview
    const getGradePreview = (obtained, isAbsent) => {
        if (isAbsent) return { grade: 'F', status: 'absent', label: 'Absent', color: 'text-rose-600 bg-rose-50 border-rose-200' };
        if (obtained === '' || obtained === undefined || isNaN(obtained)) {
            return { grade: '—', status: 'pending', label: 'Pending', color: 'text-slate-400 bg-slate-50 border-slate-200' };
        }
        const num = parseFloat(obtained);
        const total = parseFloat(exam.total_marks);
        const pass = parseFloat(exam.pass_marks);

        if (num < pass) {
            return { grade: 'F', status: 'fail', label: 'Fail', color: 'text-rose-600 bg-rose-50 border-rose-200' };
        }

        const pct = total > 0 ? (num / total) * 100 : 0;
        let grade = 'D';
        if (pct >= 80) grade = 'A+';
        else if (pct >= 70) grade = 'A';
        else if (pct >= 60) grade = 'A-';
        else if (pct >= 50) grade = 'B';
        else if (pct >= 40) grade = 'C';

        return { grade, status: 'pass', label: 'Pass', color: 'text-[#16a34a] bg-emerald-50 border-emerald-200' };
    };

    return (
        <AdminLayout>
            <Head title={`Marks Entry - ${exam.title}`} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <Link
                        href={route('admin.exams.index')}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
                    >
                        <ArrowLeft size={13} /> Back to Exams
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Exam Marks Entry</h1>
                    <p className="text-xs text-[#6d7175]">Record student marks, track absentees and generate automated marksheets.</p>
                </div>
            </div>

            {/* Exam Meta Info Card */}
            <div className="bg-white px-4 py-3 rounded-[4px] border border-slate-200/80 shadow-2xs mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                            {exam.course?.title || 'General Evaluation'} • Created by Academic Admin
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-5 text-xs text-slate-600 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Exam Date</span>
                        <b className="text-slate-800 font-bold">{exam.exam_date}</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Total Marks</span>
                        <b className="text-slate-800 font-bold">{exam.total_marks} Marks</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Pass Marks</span>
                        <b className="text-rose-600 font-bold">{exam.pass_marks} Marks</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Total Students</span>
                        <b className="text-[#16a34a] font-bold">{totalCount}</b>
                    </div>
                </div>
            </div>

            {/* Marks Entry Sheet */}
            <form onSubmit={handleSubmit} className="bg-white rounded-[4px] border border-slate-200/80 shadow-2xs overflow-hidden">
                {/* Toolbar */}
                <div className="px-3.5 py-2.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or student ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-8 pl-8 pr-2.5 text-xs rounded-[3px] border border-slate-200 bg-white placeholder:text-slate-400 focus:border-[#16a34a] focus:ring-0 outline-none"
                            />
                        </div>

                        {/* Filter Status Pills */}
                        <div className="inline-flex rounded-[3px] border border-slate-200 bg-white p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setFilterStatus('all')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    filterStatus === 'all' ? 'bg-[#16a34a] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                All ({totalCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterStatus('present')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    filterStatus === 'present' ? 'bg-[#16a34a] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Present ({presentCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterStatus('absent')}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] transition-colors ${
                                    filterStatus === 'absent' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Absent ({absentCount})
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            Progress: <b className="text-slate-800">{filledCount}</b> / {totalCount}
                        </span>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                        >
                            <CheckCircle2 size={14} />
                            <span>Save & Publish Results</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600">
                            <tr>
                                <th className="px-3.5 py-2.5 w-12 text-center">#</th>
                                <th className="px-3.5 py-2.5">Student ID</th>
                                <th className="px-3.5 py-2.5">Student Name</th>
                                <th className="px-3.5 py-2.5 text-center">Obtained Marks (Max: {exam.total_marks})</th>
                                <th className="px-3.5 py-2.5 text-center">Result Preview</th>
                                <th className="px-3.5 py-2.5 text-center">Absent Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80 bg-white">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((st, idx) => {
                                    const stMarks = data.marks[st.id] || { obtained_marks: '', is_absent: false };
                                    const preview = getGradePreview(stMarks.obtained_marks, stMarks.is_absent);
                                    const isRowAbsent = stMarks.is_absent;

                                    return (
                                        <tr 
                                            key={st.id} 
                                            className={`transition-colors ${
                                                isRowAbsent 
                                                    ? 'bg-rose-50/30 hover:bg-rose-50/50' 
                                                    : 'hover:bg-slate-50/70'
                                            }`}
                                        >
                                            <td className="px-3.5 py-2 text-center font-bold text-slate-400 tabular-nums">
                                                {idx + 1}
                                            </td>

                                            <td className="px-3.5 py-2 whitespace-nowrap font-bold text-[#16a34a] font-mono text-[11px]">
                                                {st.student_id || '—'}
                                            </td>

                                            <td className="px-3.5 py-2 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-[3px] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                        {st.name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-xs">
                                                        {st.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <div className="inline-flex items-center justify-center gap-1.5">
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        min="0"
                                                        max={exam.total_marks}
                                                        disabled={isRowAbsent}
                                                        value={stMarks.obtained_marks}
                                                        onChange={(e) => handleMarksChange(st.id, 'obtained_marks', e.target.value)}
                                                        placeholder="0"
                                                        className={`w-24 h-7.5 px-2 text-xs font-bold rounded-[3px] border text-center outline-none transition-colors tabular-nums ${
                                                            isRowAbsent
                                                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                                                : 'bg-white text-slate-900 border-slate-200 focus:border-[#16a34a] focus:ring-0 shadow-2xs'
                                                        }`}
                                                    />
                                                    <span className="text-[11px] text-slate-400 font-medium">/ {exam.total_marks}</span>
                                                </div>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-bold rounded-full border ${preview.color}`}>
                                                    <span>{preview.label}</span>
                                                    {preview.grade !== '—' && (
                                                        <span className="font-black">({preview.grade})</span>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-3.5 py-2 text-center whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleAbsent(st.id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-[3px] border transition-all cursor-pointer ${
                                                        isRowAbsent
                                                            ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600'
                                                    }`}
                                                >
                                                    <UserX size={12} />
                                                    <span>{isRowAbsent ? 'Absent' : 'Mark Absent'}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>Total: <b className="text-slate-800">{totalCount}</b></span>
                        <span className="text-emerald-700">Present: <b>{presentCount}</b></span>
                        <span className="text-rose-600">Absent: <b>{absentCount}</b></span>
                        <span className="text-slate-400">|</span>
                        <span>Pass Mark: <b>{exam.pass_marks}</b></span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.exams.index')}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-[3px] transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                        >
                            <CheckCircle2 size={14} />
                            <span>Save & Publish Results</span>
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
