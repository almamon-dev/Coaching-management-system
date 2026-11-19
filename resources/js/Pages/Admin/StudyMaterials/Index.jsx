import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, X, Eye, Trash2, ExternalLink, UploadCloud, FileText, Download,
    FileArchive, Video, Music, Image as ImageIcon, ChevronDown, ChevronUp, Link as LinkIcon
} from 'lucide-react';
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
    const [filePreview, setFilePreview] = useState(null);
    const [showExternalLink, setShowExternalLink] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        batch_id: '',
        course_id: '',
        subject_id: '',
        file_type: '',
        file: null,
        link_url: '',
        description: '',
    });

    const cleanFileNameToTitle = (filename) => {
        if (!filename) return '';
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
        return nameWithoutExt
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const detectFileType = (filename) => {
        if (!filename) return 'File';
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext)) return 'PDF';
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'ZIP';
        if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm', 'flv'].includes(ext)) return 'Video';
        if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext)) return 'Audio';
        if (['doc', 'docx', 'odt', 'txt', 'rtf', 'csv', 'xls', 'xlsx'].includes(ext)) return 'Document';
        if (['ppt', 'pptx'].includes(ext)) return 'Note';
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'Image';
        return ext ? ext.toUpperCase() : 'File';
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            const detected = detectFileType(file.name);
            setData('file_type', detected);

            setFilePreview({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: detected,
            });

            // Auto-fill title if empty or default
            if (!data.title) {
                setData('title', cleanFileNameToTitle(file.name));
            }
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setData('file', null);
        setData('file_type', '');
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
                setShowMoreOptions(false);
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
        { id: 'ZIP', name: 'ZIP Archive' },
        { id: 'Video', name: 'Video (MP4/MKV/Link)' },
        { id: 'Document', name: 'Document (Word/Excel)' },
        { id: 'Note', name: 'Lecture Note (PowerPoint)' },
        { id: 'Image', name: 'Image / Diagram' },
        { id: 'Audio', name: 'Audio File' },
        { id: 'Link', name: 'External Link' },
    ];

    const batchOptions = [
        { id: '', name: 'All Batches (Public to All)' },
        ...batches.map(b => ({ id: String(b.id), name: b.name }))
    ];

    const filteredMaterials = useMemo(() => {
        return materials.filter((m) => {
            const matchesSearch = !search ||
                m.title?.toLowerCase().includes(search.toLowerCase()) ||
                m.batch?.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.description?.toLowerCase().includes(search.toLowerCase()) ||
                m.subject?.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.file_type?.toLowerCase().includes(search.toLowerCase());

            const matchesBatch = !selectedBatch || String(m.batch_id) === String(selectedBatch);
            const matchesType = !selectedType || m.file_type?.toUpperCase() === selectedType.toUpperCase();

            return matchesSearch && matchesBatch && matchesType;
        });
    }, [materials, search, selectedBatch, selectedType]);

    const getTypeMeta = (type) => {
        const t = (type || '').toUpperCase();
        if (t === 'PDF') {
            return {
                label: 'PDF',
                color: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: FileText
            };
        }
        if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(t)) {
            return {
                label: 'ZIP Archive',
                color: 'bg-amber-50 text-amber-800 border-amber-200',
                icon: FileArchive
            };
        }
        if (t === 'VIDEO') {
            return {
                label: 'Video',
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: Video
            };
        }
        if (t === 'AUDIO') {
            return {
                label: 'Audio',
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                icon: Music
            };
        }
        if (t === 'IMAGE') {
            return {
                label: 'Image',
                color: 'bg-teal-50 text-teal-700 border-teal-200',
                icon: ImageIcon
            };
        }
        if (t === 'DOCUMENT') {
            return {
                label: 'Document',
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: FileText
            };
        }
        if (t === 'NOTE') {
            return {
                label: 'Lecture Note',
                color: 'bg-emerald-50 text-[#16a34a] border-emerald-200',
                icon: FileText
            };
        }
        return {
            label: type || 'File',
            color: 'bg-slate-100 text-slate-700 border-slate-200',
            icon: FileText
        };
    };

    const materialColumns = [
        {
            header: 'Resource Title',
            accessor: 'title',
            cell: (row) => {
                const meta = getTypeMeta(row.file_type);
                const IconComponent = meta.icon;
                return (
                    <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-[4px] border flex items-center justify-center shrink-0 mt-0.5 ${meta.color}`}>
                            <IconComponent size={15} />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 text-xs block max-w-[260px] truncate" title={row.title}>
                                {row.title}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[260px]" title={row.description}>
                                {row.description || (row.uploader?.name ? `Uploaded by ${row.uploader.name}` : 'Study resource')}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Type',
            accessor: 'file_type',
            cell: (row) => {
                const meta = getTypeMeta(row.file_type);
                return (
                    <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[10.5px] font-bold rounded-full border ${meta.color}`}>
                        {meta.label}
                    </span>
                );
            },
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
            header: 'Subject / Course',
            accessor: 'subject.name',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.subject?.name || row.course?.title || 'General'}
                </span>
            ),
        },
        {
            header: 'Resource',
            accessor: 'file_path',
            cell: (row) => {
                const targetUrl = row.file_path || row.link_url;
                if (!targetUrl) return <span className="text-slate-400 text-xs">—</span>;
                const isLocal = !!row.file_path || targetUrl.startsWith('/storage');
                const isVideo = row.file_type?.toUpperCase() === 'VIDEO';
                const isZip = ['ZIP', 'RAR', '7Z'].includes(row.file_type?.toUpperCase());

                let actionLabel = 'Download';
                if (isVideo) actionLabel = isLocal ? 'Watch / Download' : 'Watch Video';
                else if (isZip) actionLabel = 'Download ZIP';
                else if (!isLocal) actionLabel = 'Open Link';

                return (
                    <a
                        href={targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline whitespace-nowrap"
                    >
                        {isLocal ? <Download size={13} /> : <ExternalLink size={13} />}
                        <span>{actionLabel}</span>
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
                    <p className="text-sm text-slate-500">Upload and manage PDFs, ZIP archives, Videos, lecture sheets, and class resources.</p>
                </div>
                <div>
                    <button
                        onClick={() => {
                            reset();
                            setFilePreview(null);
                            setShowExternalLink(false);
                            setShowMoreOptions(false);
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
                searchPlaceholder="Search materials by title, batch, subject..."
                advancedFilters={materialFilters}
            />

            {/* UPLOAD STUDY MATERIAL MODAL - MINIMAL & CLEAN */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-lg w-full p-6 rounded-[4px] shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Upload Study Material</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Quick upload for ZIP archives, Videos, PDFs, or lecture notes.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    reset();
                                    setFilePreview(null);
                                    setShowExternalLink(false);
                                    setShowMoreOptions(false);
                                }}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 1. File Upload Dropzone (Supports ALL files: ZIP, Video, PDF, Docs, etc.) */}
                            {!showExternalLink && (
                                <div>
                                    <InputLabel value="Select Resource File (ZIP, Video, PDF, etc.) *" />
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
                                            accept="*/*"
                                        />

                                        {filePreview ? (
                                            <div className="flex items-center justify-between gap-3 text-left bg-white p-3 rounded-[4px] border border-emerald-200 shadow-2xs">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-[4px] bg-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                                                        {filePreview.type === 'ZIP' ? (
                                                            <FileArchive size={20} />
                                                        ) : filePreview.type === 'Video' ? (
                                                            <Video size={20} />
                                                        ) : filePreview.type === 'Audio' ? (
                                                            <Music size={20} />
                                                        ) : filePreview.type === 'Image' ? (
                                                            <ImageIcon size={20} />
                                                        ) : (
                                                            <FileText size={20} />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{filePreview.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#16a34a]">
                                                                {filePreview.type}
                                                            </span>
                                                            <span className="text-[11px] text-slate-500">{filePreview.size}</span>
                                                        </div>
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
                                                    <span className="text-xs font-bold text-[#16a34a] hover:underline">Click to browse any file</span>
                                                    <span className="text-xs text-slate-500"> or drag & drop</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-medium">
                                                    Supports: <strong className="text-slate-700">ZIP / RAR, Video (MP4/MKV), PDF, Word, PowerPoint, Audio</strong> (Up to 500MB)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.file} className="mt-1" />
                                </div>
                            )}

                            {/* 2. Material Title (Required, auto-filled from filename) */}
                            <div>
                                <InputLabel htmlFor="title" value="Material Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Chapter 03 - Higher Math Revision Package"
                                    required
                                    className="mt-1"
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            {/* 3. Target Batch (Single dropdown, defaults to All Batches) */}
                            <div>
                                <InputLabel htmlFor="batch_id" value="Target Batch (Optional)" />
                                <div className="mt-1">
                                    <SelectInput
                                        value={data.batch_id}
                                        onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                        options={[
                                            { id: '', name: 'All Batches (Public to All Students)' },
                                            ...batches.map(b => ({ id: b.id, name: b.name }))
                                        ]}
                                        placeholder="All Batches (Public to All Students)"
                                    />
                                </div>
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Leave blank to make this material available to all enrolled students.
                                </span>
                            </div>

                            {/* 4. External URL / YouTube / Drive Link Toggle */}
                            <div className="pt-0.5">
                                {!showExternalLink ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowExternalLink(true)}
                                        className="text-[11.5px] font-semibold text-slate-600 hover:text-[#16a34a] flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <LinkIcon size={13} className="text-slate-400" />
                                        <span>Or share a YouTube / Google Drive link instead</span>
                                    </button>
                                ) : (
                                    <div className="p-3 bg-slate-50 rounded-[4px] border border-slate-200/80 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <InputLabel htmlFor="link_url" value="External Video or Resource URL" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowExternalLink(false);
                                                    setData('link_url', '');
                                                }}
                                                className="text-[10.5px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                                            >
                                                Switch back to file upload
                                            </button>
                                        </div>
                                        <TextInput
                                            id="link_url"
                                            type="url"
                                            value={data.link_url}
                                            onChange={(e) => setData('link_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                                            className="mt-1"
                                        />
                                        <InputError message={errors.link_url} className="mt-1" />
                                    </div>
                                )}
                            </div>

                            {/* 5. Collapsible "+ More Options (Subject, Description)" */}
                            <div className="pt-1 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 transition-colors cursor-pointer"
                                >
                                    <span>{showMoreOptions ? '− Hide optional details' : '+ Add Subject or Description (Optional)'}</span>
                                    {showMoreOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {showMoreOptions && (
                                    <div className="mt-3 space-y-3 pt-2 border-t border-slate-100 animate-in fade-in">
                                        <div>
                                            <InputLabel htmlFor="subject_id" value="Specific Subject (Optional)" />
                                            <div className="mt-1">
                                                <SelectInput
                                                    value={data.subject_id}
                                                    onChange={(e) => setData('subject_id', e.target ? e.target.value : e)}
                                                    options={[
                                                        { id: '', name: 'General / Auto-assigned' },
                                                        ...subjects.map(s => ({ id: s.id, name: s.name }))
                                                    ]}
                                                    placeholder="Select Subject"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Short Description / Instructions" />
                                            <TextArea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Brief notes or instructions for students..."
                                                rows={2}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Action Buttons */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                        setFilePreview(null);
                                        setShowExternalLink(false);
                                        setShowMoreOptions(false);
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
                                    <span>{processing ? 'Uploading File...' : 'Upload Resource'}</span>
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
