import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Link as LinkIcon, X, FileText } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function StudyMaterialIndex({ materials, courses, batches, subjects }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        course_id: courses[0]?.id || '',
        batch_id: batches[0]?.id || '',
        file_type: 'PDF',
        link_url: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.study-materials.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const typeOptions = [
        { id: 'PDF', name: 'PDF File' },
        { id: 'Note', name: 'Lecture Note' },
        { id: 'Document', name: 'Document' },
        { id: 'Video', name: 'Video Link' },
        { id: 'Link', name: 'External Link' },
    ];

    const batchOptions = batches.map(b => ({ id: b.id, name: b.name }));

    return (
        <AdminLayout>
            <Head title="Study Materials" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Materials</h1>
                    <p className="text-sm text-slate-500">Upload lecture notes, PDFs, documents, video links & course resources.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Upload Material
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {materials.map((m) => (
                    <div key={m.id} className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{m.file_type}</span>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">{m.batch?.name || 'All Batches'}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{m.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{m.description || 'No description provided.'}</p>
                        </div>

                        {m.link_url && (
                            <a
                                href={m.link_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline border-t border-slate-100 pt-3"
                            >
                                <LinkIcon size={14} /> Open Material Resource Link
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* UPLOAD STUDY MATERIAL MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Upload Study Material</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Material Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Physics Vector Lecture Hand Notes"
                                    required
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="file_type" value="Material Type *" />
                                    <SelectInput
                                        value={data.file_type}
                                        onChange={(e) => setData('file_type', e.target ? e.target.value : e)}
                                        options={typeOptions}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="batch_id" value="Batch" />
                                    <SelectInput
                                        value={data.batch_id}
                                        onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                        options={batchOptions}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="link_url" value="Resource Link URL" />
                                <TextInput
                                    id="link_url"
                                    type="url"
                                    value={data.link_url}
                                    onChange={(e) => setData('link_url', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    placeholder="Short description of this material..."
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
                                    Save Material
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
