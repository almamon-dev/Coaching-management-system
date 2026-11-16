import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function NoticeIndex({ notices, courses, batches }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        content: '',
        target_role: 'all',
        category: 'Announcement',
        priority: 'normal',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.notices.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const targetRoleOptions = [
        { id: 'all', name: 'Everyone' },
        { id: 'students', name: 'Students Only' },
        { id: 'guardians', name: 'Guardians Only' },
    ];

    const categoryOptions = [
        { id: 'Announcement', name: 'Announcement' },
        { id: 'Exam', name: 'Exam Notice' },
        { id: 'Holiday', name: 'Holiday Alert' },
        { id: 'Cancellation', name: 'Class Cancellation' },
        { id: 'Fee Reminder', name: 'Fee Reminder' },
    ];

    return (
        <AdminLayout>
            <Head title="Notice Management" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notice Management</h1>
                    <p className="text-sm text-slate-500">Publish announcements, exam notices, holiday alerts to students & guardians.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Publish Notice
                </button>
            </div>

            <div className="space-y-4">
                {notices.map((n) => (
                    <div key={n.id} className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{n.category}</span>
                                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full capitalize ${n.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                    {n.priority} Priority
                                </span>
                                <span className="text-xs text-slate-400 font-medium">Target: {n.target_role}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{n.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold shrink-0">{n.published_at}</span>
                    </div>
                ))}
            </div>

            {/* PUBLISH NOTICE MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Publish Notice</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Notice Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Physics Class Rescheduled for Friday"
                                    required
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="target_role" value="Target Audience *" />
                                    <SelectInput
                                        value={data.target_role}
                                        onChange={(e) => setData('target_role', e.target ? e.target.value : e)}
                                        options={targetRoleOptions}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="category" value="Category *" />
                                    <SelectInput
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target ? e.target.value : e)}
                                        options={categoryOptions}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Notice Content *" />
                                <TextArea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={4}
                                    placeholder="Notice details..."
                                    required
                                />
                                <InputError message={errors.content} className="mt-1" />
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
                                    Publish Now
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
