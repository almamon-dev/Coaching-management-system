import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, X, Eye, Trash2, ExternalLink, UploadCloud, FileText, Download } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';
import DataTable from '@/Components/Table/DataTable';

export default function StudyMaterialIndex({ materials = [], batches = [], subjects = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [showExternalLink, setShowExternalLink] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        course_id: batches[0]?.id || '',
        batch_id: batches[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        file_type: 'PDF',
        file: null,
        link_url: '',
        description: '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFilePreview({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type,
            });

            // Auto-fill title if empty
            if (!data.title) {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                setData('title', nameWithoutExt);
            }

            // Auto-detect type
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') {
                setData('file_type', 'PDF');
            } else if (['doc', 'docx', 'txt', 'odt'].includes(ext)) {
                setData('file_type', 'Document');
            } else if (['ppt', 'pptx'].includes(ext)) {
                setData('file_type', 'Note');
            } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                setData('file_type', 'Image');
            }
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setData('file', null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.study-materials.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFilePreview(null);
                setShowExternalLink(false);
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
        { id: 'Image', name: 'Image' },
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
            case 'Image':
                return 'bg-teal-50 text-teal-700 border-teal-200';
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
            header: 'File / Resource',
            accessor: 'file_path',
            cell: (row) => {
                const targetUrl = row.file_path || row.link_url;
                if (!targetUrl) return <span className="text-slate-400 text-xs">—</span>;
                const isLocal = !!row.file_path || targetUrl.startsWith('/storage');
                return (
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline whitespace-nowrap"
                    >
                        {isLocal ? <Download size={13} /> : <FileText size={13} />}
                        <span>{isLocal ? 'Download File' : 'Open Link'}</span>
                        <ExternalLink size={11} className="text-slate-400" />
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
            cell: (row) => {
                const targetUrl = row.file_path || row.link_url;
                return (
                    <div className="flex items-center justify-end gap-1.5">
                        {targetUrl && (
                            <a
                                href={targetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-[3px] text-[11px] transition-all"
                                title="View or Download"
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
                );
            },
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
                    <p className="text-sm text-slate-500">Upload lecture notes, PDFs, documents and course resources.</p>
                </div>
                <div>
                    <button
                        onClick={() => {
                            reset();
                            setFilePreview(null);
                            setShowExternalLink(false);
                            setShowModal(true);
                        }}
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
                                <p className="text-xs text-slate-500 mt-0.5">Upload PDFs, documents or lecture notes directly from your device.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    reset();
                                    setFilePreview(null);
                                    setShowExternalLink(false);
                                }}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* File Upload Box (Replaces pure resource URL) */}
                            <div>
                                <InputLabel value="Select File to Upload (PDF or Note File) *" />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mt-1.5 border-2 border-dashed rounded-[4px] p-5 text-center cursor-pointer transition-all ${filePreview
                                            ? 'border-emerald-400 bg-emerald-50/30'
                                            : 'border-slate-300 hover:border-[#16a34a] bg-slate-50/50 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                                    />

                                    {filePreview ? (
                                        <div className="flex items-center justify-between gap-3 text-left bg-white p-3 rounded-[4px] border border-emerald-200 shadow-2xs">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-[4px] bg-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{filePreview.name}</p>
                                                    <p className="text-[11px] text-slate-500">{filePreview.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                            >
                                                Change File
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-1.5 py-3">
                                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                                                <UploadCloud size={22} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-[#16a34a] hover:underline">Click to browse file</span>
                                                <span className="text-xs text-slate-500"> or drag and drop</span>
                                            </div>
                                            <p className="text-[10.5px] text-slate-400">PDF, Word (DOC/DOCX), PowerPoint, Excel, Images (Max 50MB)</p>
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.file} className="mt-1" />
                            </div>

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
                                                { id: 'Image', name: 'Image / Diagram' },
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
                                                ...batches.map(c => ({ id: c.id, name: c.title }))
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

                            {/* Optional External Link Toggle */}
                            <div className="pt-1">
                                {!showExternalLink ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowExternalLink(true)}
                                        className="text-[11px] font-semibold text-slate-500 hover:text-[#16a34a] flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                        <span>+ Add external YouTube or Google Drive link instead (optional)</span>
                                    </button>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <InputLabel htmlFor="link_url" value="External Link (YouTube, Drive, etc.)" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowExternalLink(false);
                                                    setData('link_url', '');
                                                }}
                                                className="text-[10.5px] text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                Hide
                                            </button>
                                        </div>
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
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description / Details (Optional)" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief details about this study material..."
                                    rows={2}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                        setFilePreview(null);
                                        setShowExternalLink(false);
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <UploadCloud size={14} />
                                    <span>{processing ? 'Uploading File...' : 'Upload Material'}</span>
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
