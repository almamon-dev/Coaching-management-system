import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, X, Calendar, Award } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function ExamIndex({ exams, courses, batches }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        course_id: courses[0]?.id || '',
        batch_id: batches[0]?.id || '',
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: 100,
        pass_marks: 40,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.exams.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const batchOptions = batches.map(b => ({ id: b.id, name: b.name }));

    return (
        <AdminLayout>
            <Head title="Exam & Result Management" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exam & Result Management</h1>
                    <p className="text-sm text-slate-500">Create coaching evaluations, enter marks & publish auto-calculated GPAs.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Create Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {exams.map((ex) => (
                    <div key={ex.id} className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{ex.batch?.name || 'Batch'}</span>
                                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${ex.status === 'published' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                    {ex.status}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{ex.title}</h3>

                            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                <div>
                                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Exam Date</span>
                                    <b className="text-slate-800 flex items-center gap-1 font-semibold mt-0.5">
                                        <Calendar size={13} className="text-[#16a34a]" /> {ex.exam_date}
                                    </b>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Marks Limit</span>
                                    <b className="text-slate-800 font-semibold mt-0.5 block">{ex.total_marks} Total (Pass: {ex.pass_marks})</b>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                            <Link
                                href={route('admin.exams.marks', ex.id)}
                                className="flex-1 text-center py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] transition-all shadow-xs"
                            >
                                Enter Marks
                            </Link>
                            <Link
                                href={route('admin.exams.results', ex.id)}
                                className="flex-1 text-center py-1.5 bg-emerald-50 text-[#16a34a] hover:bg-emerald-100 text-xs font-bold rounded-[3px] border border-emerald-200 transition-all"
                            >
                                View Results
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE EXAM MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Create Coaching Exam</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Exam Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Monthly Physics Model Test 01"
                                    required
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="batch_id" value="Batch *" />
                                    <SelectInput
                                        value={data.batch_id}
                                        onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                        options={batchOptions}
                                    />
                                    <InputError message={errors.batch_id} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="exam_date" value="Exam Date *" />
                                    <TextInput
                                        id="exam_date"
                                        type="date"
                                        value={data.exam_date}
                                        onChange={(e) => setData('exam_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="total_marks" value="Total Marks *" />
                                    <TextInput
                                        id="total_marks"
                                        type="number"
                                        value={data.total_marks}
                                        onChange={(e) => setData('total_marks', e.target.value)}
                                        placeholder="100"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="pass_marks" value="Pass Marks *" />
                                    <TextInput
                                        id="pass_marks"
                                        type="number"
                                        value={data.pass_marks}
                                        onChange={(e) => setData('pass_marks', e.target.value)}
                                        placeholder="40"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm"
                                >
                                    Create Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
