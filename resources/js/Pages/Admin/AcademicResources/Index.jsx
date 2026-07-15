import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Table/DataTable';
import { Trash2, Download, Plus, FileText, Calendar, BookOpen, FileCode, Edit2 } from 'lucide-react';
import Modal from '@/Components/Modal/Modal';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import InputError from '@/Components/Form/InputError';
import SelectInput from '@/Components/Form/SelectInput';
import Notify from '@/Utils/Notify';

export default function Index({ resources, classes, filters }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        type: 'routine',
        academic_class_id: '',
        year: new Date().getFullYear().toString(),
        file: null,
        is_active: true,
    });

    const types = [
        { id: 'routine', name: 'Class Routine' },
        { id: 'calendar', name: 'Academic Calendar' },
        { id: 'syllabus', name: 'Syllabus & Curriculum' },
        { id: 'other', name: 'Other Resources' },
    ];

    const typeIcons = {
        routine: <Calendar size={16} className="text-blue-500" />,
        calendar: <Calendar size={16} className="text-amber-500" />,
        syllabus: <BookOpen size={16} className="text-emerald-500" />,
        other: <FileText size={16} className="text-slate-500" />,
    };

    const handleUpload = (e) => {
        e.preventDefault();
        post(route('admin.academic-resources.store'), {
            onSuccess: () => {
                Notify.success('Resource uploaded successfully');
                setIsUploadModalOpen(false);
                reset();
                clearErrors();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            router.delete(route('admin.academic-resources.destroy', id), {
                onSuccess: () => Notify.success('Resource deleted successfully')
            });
        }
    };

    const columns = [
        {
            key: 'type',
            label: 'Type',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100">
                        {typeIcons[item.type] || typeIcons['other']}
                    </div>
                    <span className="capitalize font-medium text-slate-700">
                        {item.type}
                    </span>
                </div>
            )
        },
        {
            key: 'title',
            label: 'Title',
            render: (item) => <span className="font-semibold text-slate-900">{item.title}</span>
        },
        {
            key: 'academic_class',
            label: 'Class/Year',
            render: (item) => (
                <div className="flex flex-col">
                    {item.academic_class ? (
                        <span className="text-[13px] font-medium text-slate-700">Class {item.academic_class.name}</span>
                    ) : (
                        <span className="text-[13px] text-slate-400">All Classes</span>
                    )}
                    {item.year && <span className="text-[12px] text-slate-500">Year: {item.year}</span>}
                </div>
            )
        },
        {
            key: 'file',
            label: 'File',
            render: (item) => item.file_path ? (
                <a 
                    href={`/storage/${item.file_path}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f9f7] text-[#008060] hover:bg-[#e2f5f0] rounded-md text-[13px] font-bold transition-colors"
                >
                    <Download size={14} /> View File
                </a>
            ) : (
                <span className="text-slate-400 italic text-[13px]">No File</span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const handleFilterChange = (key, value) => {
        router.get(route('admin.academic-resources.index'), {
            ...filters,
            [key]: value
        }, { preserveState: true, preserveScroll: true });
    };

    const advancedFiltersNode = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Resource Type</label>
                <SelectInput
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    options={[
                        { id: '', name: 'All Types' },
                        ...types
                    ]}
                    placeholder="Filter by Type..."
                />
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Academic Resources" />

            <div className="p-4 md:p-6  mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Academic Resources</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage Class Routines, Academic Calendars, and Syllabus files for the website.</p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={14} strokeWidth={3} /> Upload Resource
                    </button>
                </div>

                <div className="mb-6">
                    <DataTable
                        columns={columns}
                        data={resources?.data || []}
                        pagination={resources}
                        selectable={false}
                        itemNoun="resources"
                        searchQuery={filters.search || ''}
                        onSearchChange={(val) => handleFilterChange('search', val)}
                        searchPlaceholder="Search by title..."
                        advancedFilters={advancedFiltersNode}
                    />
                </div>
            </div>

            {/* Upload Modal */}
            <Modal show={isUploadModalOpen} onClose={() => { setIsUploadModalOpen(false); reset(); clearErrors(); }} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Academic Resource</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        
                        <div>
                            <InputLabel htmlFor="type" value="Resource Type" required />
                            <SelectInput
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                options={types}
                                className="w-full mt-1"
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="title" value="Document Title" required />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full mt-1"
                                placeholder="e.g. Class 6 Half-Yearly Routine"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="academic_class_id" value="Class (Optional)" />
                                <SelectInput
                                    id="academic_class_id"
                                    value={data.academic_class_id}
                                    onChange={(e) => setData('academic_class_id', e.target.value)}
                                    options={[
                                        { id: '', name: 'All Classes' },
                                        ...classes
                                    ]}
                                    className="w-full mt-1"
                                />
                                <InputError message={errors.academic_class_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="year" value="Year" />
                                <TextInput
                                    id="year"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="2026"
                                />
                                <InputError message={errors.year} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="file" value="Upload PDF/Document" required />
                            <div className="mt-1">
                                <input
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="block w-full text-[13px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[13px] file:font-semibold file:bg-[#f0f9f7] file:text-[#008060] hover:file:bg-[#e2f5f0] border border-slate-200 rounded-[3px] bg-white"
                                />
                            </div>
                            <InputError message={errors.file} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => setIsUploadModalOpen(false)}
                                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-[3px] font-bold text-[12px] hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Uploading...' : 'Upload Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
