import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Shield, 
    DollarSign, 
    Layers, 
    ChevronRight, 
    Save, 
    ArrowLeft
} from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import RichTextEditor from '@/Components/Form/RichTextEditor';
import InputError from '@/Components/Form/InputError';
import { cn } from '@/lib/utils';

export default function CreateSubject() {
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        code: '',
        category: '',
        monthly_fee: '',
        admission_fee: '',
        duration: '',
        total_lectures: '',
        total_lessons: '',
        description: '',
        syllabus_details: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'));
    };

    const categoryOptions = [
        { id: 'Class 1', name: 'Class 1' },
        { id: 'Class 2', name: 'Class 2' },
        { id: 'Class 3', name: 'Class 3' },
        { id: 'Class 4', name: 'Class 4' },
        { id: 'Class 5', name: 'Class 5' },
        { id: 'Class 6', name: 'Class 6' },
        { id: 'Class 7', name: 'Class 7' },
        { id: 'Class 8', name: 'Class 8' },
        { id: 'Class 9', name: 'Class 9' },
        { id: 'Class 10', name: 'Class 10' },
        { id: 'SSC', name: 'SSC' },
        { id: 'HSC / Intermediate', name: 'HSC / Intermediate' },
    ];

    const statusOptions = [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
    ];

    const tabs = [
        { id: 'general', label: 'General & Category', icon: Shield },
        { id: 'pricing', label: 'Tuition & Fees', icon: DollarSign },
        { id: 'syllabus', label: 'Lectures & Syllabus', icon: Layers },
    ];

    return (
        <AdminLayout>
            <Head title="Add New Subject" />

            <div className="w-full pb-10">
                <form onSubmit={handleSubmit}>
                    {/* TOP HEADER WITH ACTIONS */}
                    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.courses.index')}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-all"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Subject</h1>
                                <p className="text-xs text-slate-500 font-medium">Create a detailed subject listing for your coaching catalog.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.courses.index')}
                                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-[4px] shadow-2xs transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[4px] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Save size={16} /> Publish Subject
                            </button>
                        </div>
                    </div>

                    {/* TWO COLUMN LAYOUT: SIDEBAR TABS + FULL CONTENT PANEL */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* LEFT SIDEBAR TABS (3 CLEAN TABS) */}
                        <div className="w-full lg:w-64 shrink-0 bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                            <div className="py-1 divide-y divide-slate-100/80">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold transition-all cursor-pointer select-none",
                                                isActive
                                                    ? "border-l-4 border-[#16a34a] bg-emerald-50/40 text-[#16a34a] font-bold"
                                                    : "border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={16} className={isActive ? "text-[#16a34a]" : "text-slate-400"} />
                                                <span>{tab.label}</span>
                                            </div>
                                            {isActive && <ChevronRight size={16} className="text-[#16a34a] shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT CONTENT PANEL */}
                        <div className="flex-1 w-full bg-white rounded-lg border border-slate-200/80 p-6 md:p-7 shadow-2xs h-auto">
                            {/* TAB 1: GENERAL & CATEGORY */}
                            {activeTab === 'general' && (
                                <div className="space-y-5 animate-in fade-in-50 duration-150">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h3 className="text-sm font-bold text-slate-800">Basic Information & Category</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Configure the essential details, code, and academic class level.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="title" value="Subject Name *" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="e.g. Physics 1st Paper / Higher Math"
                                                required
                                                className="mt-1 font-medium"
                                            />
                                            <InputError message={errors.title} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="code" value="Subject Code *" />
                                            <TextInput
                                                id="code"
                                                type="text"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                placeholder="e.g. PHY-101"
                                                required
                                                className="mt-1 uppercase"
                                            />
                                            <InputError message={errors.code} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <InputLabel htmlFor="category" value="Academic Category / Class" />
                                            <SelectInput
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target ? e.target.value : e)}
                                                options={categoryOptions}
                                                placeholder="Select Category"
                                                showSearch={false}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.category} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="status" value="Subject Status" />
                                            <SelectInput
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target ? e.target.value : e)}
                                                options={statusOptions}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.status} className="mt-1" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: TUITION & FEES */}
                            {activeTab === 'pricing' && (
                                <div className="space-y-5 animate-in fade-in-50 duration-150">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h3 className="text-sm font-bold text-slate-800">Tuition Fees & Duration</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Set monthly tuition fee, admission fee, and course duration.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel htmlFor="monthly_fee" value="Monthly Fee (৳) *" />
                                            <TextInput
                                                id="monthly_fee"
                                                type="number"
                                                value={data.monthly_fee}
                                                onChange={(e) => setData('monthly_fee', e.target.value)}
                                                placeholder="1500"
                                                required
                                                className="mt-1 font-bold text-[#16a34a]"
                                            />
                                            <InputError message={errors.monthly_fee} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="admission_fee" value="Admission Fee (৳)" />
                                            <TextInput
                                                id="admission_fee"
                                                type="number"
                                                value={data.admission_fee}
                                                onChange={(e) => setData('admission_fee', e.target.value)}
                                                placeholder="500"
                                                className="mt-1"
                                            />
                                            <InputError message={errors.admission_fee} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="duration" value="Duration" />
                                            <TextInput
                                                id="duration"
                                                type="text"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', e.target.value)}
                                                placeholder="e.g. 6 Months / 1 Year"
                                                className="mt-1"
                                            />
                                            <InputError message={errors.duration} className="mt-1" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: LECTURES & SYLLABUS */}
                            {activeTab === 'syllabus' && (
                                <div className="space-y-5 animate-in fade-in-50 duration-150">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h3 className="text-sm font-bold text-slate-800">Lectures & Full Syllabus Breakdown</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Specify total lecture counts and detailed chapter breakdown.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="total_lectures" value="Total Lectures Count" />
                                            <TextInput
                                                id="total_lectures"
                                                type="number"
                                                value={data.total_lectures}
                                                onChange={(e) => setData('total_lectures', e.target.value)}
                                                placeholder="e.g. 36"
                                                className="mt-1 font-semibold"
                                            />
                                            <InputError message={errors.total_lectures} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="total_lessons" value="Total Lessons / Chapters" />
                                            <TextInput
                                                id="total_lessons"
                                                type="number"
                                                value={data.total_lessons}
                                                onChange={(e) => setData('total_lessons', e.target.value)}
                                                placeholder="e.g. 12"
                                                className="mt-1 font-semibold"
                                            />
                                            <InputError message={errors.total_lessons} className="mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="description" value="Short Overview / Description" />
                                        <TextArea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={2}
                                            placeholder="Brief introduction or subject summary..."
                                            className="mt-1 text-xs"
                                        />
                                        <InputError message={errors.description} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="syllabus_details" value="Full Lesson & Lecture Breakdown (Syllabus)" />
                                        <div className="mt-1">
                                            <RichTextEditor
                                                value={data.syllabus_details}
                                                onChange={(val) => setData('syllabus_details', val)}
                                                placeholder="Enter detailed lesson-by-lesson and lecture-by-lecture syllabus breakdown, topics, and learning objectives..."
                                            />
                                        </div>
                                        <InputError message={errors.syllabus_details} className="mt-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
