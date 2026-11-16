import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, Calendar, ExternalLink, 
    CheckCircle2, Clock, FileText, Edit3, X 
} from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import DataTable from '@/Components/Table/DataTable';

export default function AssignmentSubmissions({ assignment, submissions = [] }) {
    const [gradingSubmission, setGradingSubmission] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        marks_obtained: '',
        feedback: '',
    });

    const openGradeModal = (sub) => {
        setGradingSubmission(sub);
        setData({
            marks_obtained: sub.marks_obtained ?? '',
            feedback: sub.feedback ?? '',
        });
    };

    const handleGradeSubmit = (e) => {
        e.preventDefault();
        post(route('admin.assignments.submissions.grade', gradingSubmission.id), {
            onSuccess: () => {
                setGradingSubmission(null);
                reset();
            }
        });
    };

    const submissionColumns = [
        {
            header: 'Student',
            accessor: 'student.name',
            cell: (row) => (
                <div>
                    <span className="font-bold text-slate-800 text-xs block">
                        {row.student?.name || 'Student'}
                    </span>
                    <span className="text-[10.5px] font-mono text-slate-400 block">
                        {row.student?.student_id || 'ID Pending'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Submitted At',
            accessor: 'created_at',
            cell: (row) => (
                <span className="text-[11.5px] text-slate-600 whitespace-nowrap">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : '—'}
                </span>
            ),
        },
        {
            header: 'Attachment',
            accessor: 'file_url',
            cell: (row) => {
                const url = row.file_url || row.submission_url;
                if (!url) return <span className="text-slate-400 text-xs">None</span>;
                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#16a34a] hover:underline whitespace-nowrap"
                    >
                        <FileText size={12} />
                        <span>View</span>
                        <ExternalLink size={10} />
                    </a>
                );
            },
        },
        {
            header: 'Score',
            accessor: 'marks_obtained',
            cell: (row) => (
                <div className="text-xs whitespace-nowrap">
                    {row.marks_obtained !== null && row.marks_obtained !== undefined ? (
                        <span className="font-bold text-slate-900">
                            {row.marks_obtained} <span className="text-slate-400 font-normal">/ {assignment.max_marks}</span>
                        </span>
                    ) : (
                        <span className="text-amber-600 font-medium text-[11px]">Ungraded</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Feedback',
            accessor: 'feedback',
            cell: (row) => (
                <span className="text-xs text-slate-500 block max-w-[200px] truncate" title={row.feedback}>
                    {row.feedback || '—'}
                </span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize whitespace-nowrap ${
                    row.status === 'reviewed'
                        ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                    {row.status === 'reviewed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {row.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'id',
            className: 'text-right',
            cell: (row) => (
                <button
                    type="button"
                    onClick={() => openGradeModal(row)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-[10.5px] font-bold rounded-[3px] transition-all shadow-2xs cursor-pointer"
                >
                    <Edit3 size={11} />
                    <span>{row.marks_obtained !== null ? 'Edit Grade' : 'Grade'}</span>
                </button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Submissions - ${assignment.title}`} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                    <Link
                        href={route('admin.assignments.index')}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-0.5"
                    >
                        <ArrowLeft size={13} /> Back to Assignments
                    </Link>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">Assignment Submissions</h1>
                    <p className="text-[11px] text-[#6d7175]">Review student submissions and assign grades.</p>
                </div>
            </div>

            {/* Compact Info Banner */}
            <div className="bg-white px-3.5 py-2.5 rounded-[3px] border border-slate-200/80 shadow-2xs mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <span className="text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        {assignment.batch?.name || 'Batch'}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 mt-1">{assignment.title}</h2>
                    <p className="text-[11px] text-slate-500">{assignment.description || 'No description.'}</p>
                </div>

                <div className="flex items-center gap-5 text-xs text-slate-600 shrink-0">
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Due Date</span>
                        <b className="text-slate-800 font-bold">{assignment.due_date}</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Max Marks</span>
                        <b className="text-slate-800 font-bold">{assignment.max_marks}</b>
                    </div>
                    <div>
                        <span className="text-slate-400 block text-[10.5px]">Submissions</span>
                        <b className="text-[#16a34a] font-bold">{submissions.length}</b>
                    </div>
                </div>
            </div>

            {/* Submissions DataTable */}
            <div className="rounded-[3px] overflow-hidden border border-slate-200/80 shadow-2xs bg-white">
                <DataTable
                    columns={submissionColumns}
                    data={submissions}
                    compact={true}
                    emptyTitle="No submissions yet"
                    emptySubtitle="Students enrolled in this batch will appear here once they upload homework."
                    itemNoun="submissions"
                />
            </div>

            {/* Compact Grade Modal */}
            {gradingSubmission && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-md w-full p-5 rounded-[4px] shadow-xl space-y-3.5 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Grade Submission</h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Student: <b>{gradingSubmission.student?.name}</b>
                                </p>
                            </div>
                            <button
                                onClick={() => setGradingSubmission(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-[3px] cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleGradeSubmit} className="space-y-3">
                            <div>
                                <InputLabel htmlFor="marks_obtained" value={`Score (Max: ${assignment.max_marks}) *`} className="text-xs" />
                                <TextInput
                                    id="marks_obtained"
                                    type="number"
                                    max={assignment.max_marks}
                                    min="0"
                                    step="0.5"
                                    value={data.marks_obtained}
                                    onChange={(e) => setData('marks_obtained', e.target.value)}
                                    placeholder="e.g. 45"
                                    required
                                    className="mt-1 h-8 text-xs"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="feedback" value="Teacher Feedback / Remarks" className="text-xs" />
                                <TextArea
                                    id="feedback"
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                    placeholder="Well done, keep up the good work..."
                                    rows={2}
                                    className="mt-1 text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setGradingSubmission(null)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-2xs"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
