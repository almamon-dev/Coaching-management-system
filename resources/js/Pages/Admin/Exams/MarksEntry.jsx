import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FileQuestion, CheckCircle, ArrowLeft } from 'lucide-react';

export default function MarksEntry({ exam, students, existingMarks }) {
    const initialMarks = {};
    students.forEach(st => {
        const key = `${st.id}_0`;
        initialMarks[st.id] = {
            obtained_marks: existingMarks[key] ? existingMarks[key].obtained_marks : 0,
            is_absent: existingMarks[key] ? existingMarks[key].is_absent : false,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.exams.marks.store', exam.id));
    };

    return (
        <AdminLayout>
            <Head title={`Marks Entry - ${exam.title}`} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marks Entry Grid</h1>
                    <p className="text-sm text-slate-500">Entering marks for <b>{exam.title}</b> ({exam.batch?.name}). Total: {exam.total_marks}, Pass: {exam.pass_marks}</p>
                </div>
                <Link href={route('admin.exams.index')} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Exams
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Student Marks Entry Sheet ({students.length} Students)</span>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                    >
                        <CheckCircle size={16} /> Save Marks & Publish Results
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">Student ID</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Obtained Marks (out of {exam.total_marks})</th>
                                <th className="p-4 text-center">Absent Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {students.map((st) => {
                                const stMarks = data.marks[st.id] || { obtained_marks: 0, is_absent: false };
                                return (
                                    <tr key={st.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-bold text-emerald-700">{st.student_id}</td>
                                        <td className="p-4 font-semibold text-slate-900">{st.name}</td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                step="0.5"
                                                max={exam.total_marks}
                                                disabled={stMarks.is_absent}
                                                value={stMarks.obtained_marks}
                                                onChange={(e) => handleMarksChange(st.id, 'obtained_marks', e.target.value)}
                                                className="w-32 px-3 py-1.5 border rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-600">
                                                <input
                                                    type="checkbox"
                                                    checked={stMarks.is_absent}
                                                    onChange={(e) => handleMarksChange(st.id, 'is_absent', e.target.checked)}
                                                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                />
                                                Mark Absent
                                            </label>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </form>
        </AdminLayout>
    );
}
