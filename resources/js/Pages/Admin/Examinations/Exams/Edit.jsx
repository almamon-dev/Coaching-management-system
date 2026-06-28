import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Notify from '@/Utils/Notify';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';
import RichTextEditor from '@/Components/Form/RichTextEditor';
import { Save, BookOpen, Calendar, CheckCircle2, AlignLeft } from 'lucide-react';

export default function Edit({ auth, exam, sessions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: exam.name || '',
        academic_session_id: exam.academic_session_id || '',
        start_date: exam.start_date ? exam.start_date.split('T')[0] : '',
        end_date: exam.end_date ? exam.end_date.split('T')[0] : '',
        status: exam.status || 'upcoming',
        description: exam.description || ''
    });

    const [activeTab, setActiveTab] = useState('general');

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.exams.update', exam.id), {
            onSuccess: () => Notify.success('Success', 'Exam updated successfully.'),
            onError: () => Notify.error('Validation Error', 'Please check the form for errors.'),
        });
    };

    const tabs = [
        { id: 'general', label: 'General Details', icon: BookOpen },
        { id: 'schedule', label: 'Schedule & Status', icon: Calendar },
        { id: 'notes', label: 'Description', icon: AlignLeft },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Edit Exam" />
            
            <form onSubmit={submit}>
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Edit Exam</h1>
                        <p className="text-[#008060] text-[13px] mt-0.5 font-bold">Update details for the selected examination.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.exams.index')}
                            className="px-4 py-2 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                        >
                            <CheckCircle2 size={16} />
                            Update Exam
                        </button>
                    </div>
                </div>

                {/* Main Layout Area */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Left Sidebar Menu */}
                    <div className="w-full md:w-[240px] shrink-0 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden sticky top-[90px]">
                        <div className="flex flex-col py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-5 py-3 text-[13px] font-bold transition-all relative
                                            ${isActive ? 'text-[#008060] bg-[#f9fbfb]' : 'text-[#6d7175] hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#008060]" />
                                        )}
                                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                        {tab.label}
                                        {isActive && <span className="ml-auto text-[#008060]">›</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6">
                        
                        {/* Tab 1: General Details */}
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">General Information</h2>
                                    <p className="text-[#6d7175] text-[12px]">Configure the essential details of the exam.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Exam Name <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. First Term Examination"
                                        />
                                        {errors.name && <div className="text-red-500 text-[11px] mt-1">{errors.name}</div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Academic Session <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.academic_session_id}
                                            onChange={e => setData('academic_session_id', e.target.value)}
                                            options={[
                                                { id: '', name: 'Select Session' },
                                                ...sessions.map(s => ({ id: s.id.toString(), name: s.name }))
                                            ]}
                                            className="w-full"
                                            showSearch={false}
                                        />
                                        {errors.academic_session_id && <div className="text-red-500 text-[11px] mt-1">{errors.academic_session_id}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Schedule & Status */}
                        {activeTab === 'schedule' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Schedule & Status</h2>
                                    <p className="text-[#6d7175] text-[12px]">Set the timeframe and current status of the exam.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full"
                                        />
                                        {errors.start_date && <div className="text-red-500 text-[11px] mt-1">{errors.start_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
                                        <TextInput
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            min={data.start_date}
                                            className="w-full"
                                        />
                                        {errors.end_date && <div className="text-red-500 text-[11px] mt-1">{errors.end_date}</div>}
                                    </div>

                                    <div className="md:col-span-2 mt-2 border-t border-[#ebebeb] pt-5">
                                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Exam Status <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            {[
                                                { id: 'upcoming', label: 'Upcoming', color: 'amber' },
                                                { id: 'ongoing', label: 'Ongoing', color: 'blue' },
                                                { id: 'completed', label: 'Completed', color: 'emerald' },
                                                { id: 'published', label: 'Published', color: 'purple' },
                                            ].map(opt => (
                                                <label key={opt.id} className={`flex items-center gap-2 p-3 border rounded-[4px] cursor-pointer transition-all flex-1 text-center justify-center ${data.status === opt.id ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700 font-bold` : 'border-[#d1d1d1] text-slate-600 hover:bg-slate-50'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="status" 
                                                        value={opt.id}
                                                        checked={data.status === opt.id}
                                                        onChange={(e) => setData('status', e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-[13px]">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.status && <div className="text-red-500 text-[11px] mt-1">{errors.status}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Notes */}
                        {activeTab === 'notes' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-6">
                                    <h2 className="text-[14px] font-bold text-slate-800 mb-1">Exam Description</h2>
                                    <p className="text-[#6d7175] text-[12px]">Add any extra instructions or notes for this exam.</p>
                                </div>

                                <div>
                                    <RichTextEditor
                                        value={data.description}
                                        onChange={val => setData('description', val)}
                                        placeholder="Enter instructions, guidelines, or any specific notes for teachers and students..."
                                    />
                                    {errors.description && <div className="text-red-500 text-[11px] mt-1">{errors.description}</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
