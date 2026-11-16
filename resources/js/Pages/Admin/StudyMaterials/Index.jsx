import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, X, Eye, Trash2, ExternalLink } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';
import DataTable from '@/Components/Table/DataTable';

export default function StudyMaterialIndex({ materials = [], courses = [], batches = [], subjects = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        course_id: courses[0]?.id || '',
        batch_id: batches[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        file_type: 'PDF',
        link_url: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.study-materials.store'), {
            onSuccess: () => { 
                reset(); 
                setShowModal(false); 
            }
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete material "${title}"?`)) {
            router.delete(route('admin.study-materials.destroy', id));
        }
    };

    const typeOptions = [
        { id: '', name: 'All Types' },
        { id: 'PDF', name: 'PDF File' },
        { id: 'Note', name: 'Lecture Note' },
        { id: 'Document', name: 'Document' },
        { id: 'Video', name: 'Video Link' },
        { id: 'Link', name: 'External Link' },
    ];

    const batchOptions = [
        { id: '', name: 'All Batches' },
        ...batches.map(b => ({ id: String(b.id), name: b.name }))
    ];

    const filteredMaterials = useMemo(() => {
        return materials.filter((m) => {
            const matchesSearch = !search ||
                m.title?.toLowerCase().includes(search.toLowerCase()) ||
                m.batch?.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.description?.toLowerCase().includes(search.toLowerCase()) ||
                m.subject?.name?.toLowerCase().includes(search.toLowerCase());

            const matchesBatch = !selectedBatch || String(m.batch_id) === String(selectedBatch);
            const matchesType = !selectedType || m.file_type === selectedType;

            return matchesSearch && matchesBatch && matchesType;
        });
    }, [materials, search, selectedBatch, selectedType]);

    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'PDF':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Note':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Video':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Document':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-emerald-50 text-[#16a34a] border-emerald-200';
        }
    };

    const materialColumns = [
        {
            header: 'Resource Title',
            accessor: 'title',
            cell: (row) => (
                <div>
                    <span className="font-bold text-slate-900 text-xs block max-w-[240px] truncate" title={row.title}>
                        {row.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate" title={row.description}>
                        {row.description || 'No description provided.'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Type',
            accessor: 'file_type',
            cell: (row) => (
                <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[10.5px] font-bold rounded-full border ${getTypeBadgeClass(row.file_type)}`}>
                    {row.file_type}
                </span>
            ),
        },
        {
            header: 'Target Batch',
            accessor: 'batch.name',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {row.batch?.name || 'All Batches'}
                </span>
            ),
        },
        {
            header: 'Subject',
            accessor: 'subject.name',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.subject?.name || row.course?.title || 'General'}
                </span>
            ),
        },
        {
            header: 'Resource Link',
            accessor: 'link_url',
            cell: (row) => {
                if (!row.link_url) return <span className="text-slate-400 text-xs">—</span>;
                return (
                    <a
                        href={row.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] hover:underline whitespace-nowrap"
                    >
                        <span>Open Resource</span>
                        <ExternalLink size={12} />
                    </a>
                );
            },
        },
        {
            header: 'Date',
            accessor: 'created_at',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : '—'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    {row.link_url && (
                        <a
                            href={row.link_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-[3px] text-[11px] transition-all"
                            title="Open Link"
                        >
                            <Eye size={12} /> View
                        </a>
                    )}
                    <button
                        onClick={() => handleDelete(row.id, row.title)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer transition-colors"
                        title="Delete Material"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    const materialFilters = (
        <div className="grid grid-cols-2 gap-3">
            <SelectInput
                value={selectedBatch}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedBatch(val);
                }}
                options={batchOptions}
                placeholder="Filter by Batch"
                showSearch={false}
            />
            <SelectInput
                value={selectedType}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedType(val);
                }}
                options={typeOptions}
                placeholder="Filter by Type"
                showSearch={false}
            />
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Study Materials" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Materials</h1>
                    <p className="text-sm text-slate-500">Upload lecture notes, PDFs, documents, video links & course resources.</p>
                </div>
                <div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Upload Material
                    </button>
                </div>
            </div>

            {/* STUDY MATERIALS DATATABLE */}
            <DataTable
                columns={materialColumns}
                data={filteredMaterials}
                selectable={true}
                itemNoun="materials"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search material title, batch..."
                advancedFilters={materialFilters}
            />

            {/* UPLOAD STUDY MATERIAL MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Upload Study Material</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Attach documents, notes or lecture links.</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                            >
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
                                    placeholder="e.g. Chapter 03 - Motion in a Straight Line"
                                    required
                                    className="mt-1"
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="file_type" value="Resource Type *" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.file_type}
                                            onChange={(e) => setData('file_type', e.target ? e.target.value : e)}
                                            options={[
                                                { id: 'PDF', name: 'PDF File' },
                                                { id: 'Note', name: 'Lecture Note' },
                                                { id: 'Document', name: 'Document' },
                                                { id: 'Video', name: 'Video Link' },
                                                { id: 'Link', name: 'External Link' },
                                            ]}
                                        />
                                    </div>
                                    <InputError message={errors.file_type} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="batch_id" value="Target Batch" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.batch_id}
                                            onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                            options={[
                                                { id: '', name: 'All Batches' },
                                                ...batches.map(b => ({ id: b.id, name: b.name }))
                                            ]}
                                            placeholder="Select Batch"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="course_id" value="Course / Class" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', e.target ? e.target.value : e)}
                                            options={[
                                                { id: '', name: 'General' },
                                                ...courses.map(c => ({ id: c.id, name: c.title }))
                                            ]}
                                            placeholder="Select Course"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="subject_id" value="Subject" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.subject_id}
                                            onChange={(e) => setData('subject_id', e.target ? e.target.value : e)}
                                            options={[
                                                { id: '', name: 'General' },
                                                ...subjects.map(s => ({ id: s.id, name: s.name }))
                                            ]}
                                            placeholder="Select Subject"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="link_url" value="Resource URL / Download Link" />
                                <TextInput
                                    id="link_url"
                                    type="url"
                                    value={data.link_url}
                                    onChange={(e) => setData('link_url', e.target.value)}
                                    placeholder="https://drive.google.com/... or https://youtube.com/..."
                                    className="mt-1"
                                />
                                <InputError message={errors.link_url} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description / Details" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief details..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm transition-colors"
                                >
                                    Upload Material
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
