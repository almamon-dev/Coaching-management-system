import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, X, ArrowRight, Calendar } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function AssignmentIndex({ assignments, batches, subjects }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        batch_id: batches[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        description: '',
        attachment_url: '',
        due_date: new Date().toISOString().split('T')[0],
        max_marks: 50,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.assignments.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const batchOptions = batches.map(b => ({ id: b.id, name: b.name }));

    return (
        <AdminLayout>
            <Head title="Assignments & Homework" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignments & Homework</h1>
                    <p className="text-sm text-slate-500">Create batch assignments, collect student homework & provide feedback.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Create Assignment
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {assignments.map((a) => (
                    <div key={a.id} className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{a.batch?.name || 'Batch'}</span>
                                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                    <Calendar size={12} className="text-[#16a34a]" /> Due: {a.due_date}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{a.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.description || 'No description provided.'}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                            <span className="text-slate-500 font-semibold">{a.submissions?.length || 0} Submissions</span>
                            <Link
                                href={route('admin.assignments.submissions', a.id)}
                                className="font-bold text-[#16a34a] hover:underline inline-flex items-center gap-1"
                            >
                                Review Submissions <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE ASSIGNMENT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Create New Assignment</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Assignment Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Vector Physics Problem Set 01"
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
                                    <InputLabel htmlFor="due_date" value="Due Date *" />
                                    <TextInput
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Instructions / Description" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Assignment instructions..."
                                />
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
                                    Save Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
