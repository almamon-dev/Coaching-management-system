import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, X, Eye, FileText, ArrowRight } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';
import DataTable from '@/Components/Table/DataTable';

export default function AssignmentIndex({ assignments = [], batches = [], subjects = [], teachers = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        batch_id: batches[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        teacher_id: teachers[0]?.id || '',
        description: '',
        attachment_url: '',
        due_date: new Date().toISOString().split('T')[0],
        max_marks: 50,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.assignments.store'), {
            onSuccess: () => { 
                reset(); 
                setShowModal(false); 
            }
        });
    };

    const batchOptions = [
        { id: '', name: 'All Batches' },
        ...batches.map(b => ({ id: String(b.id), name: b.name }))
    ];

    const subjectOptions = [
        { id: '', name: 'All Subjects' },
        ...subjects.map(s => ({ id: String(s.id), name: s.name }))
    ];

    const filteredAssignments = useMemo(() => {
        return assignments.filter((a) => {
            const matchesSearch = !search ||
                a.title?.toLowerCase().includes(search.toLowerCase()) ||
                a.batch?.name?.toLowerCase().includes(search.toLowerCase()) ||
                a.subject?.name?.toLowerCase().includes(search.toLowerCase()) ||
                a.description?.toLowerCase().includes(search.toLowerCase());

            const matchesBatch = !selectedBatch || String(a.batch_id) === String(selectedBatch);
            const matchesSubject = !selectedSubject || String(a.subject_id) === String(selectedSubject);

            return matchesSearch && matchesBatch && matchesSubject;
        });
    }, [assignments, search, selectedBatch, selectedSubject]);

    const assignmentColumns = [
        {
            header: 'Assignment Title',
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
            header: 'Batch',
            accessor: 'batch.name',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {row.batch?.name || '—'}
                </span>
            ),
        },
        {
            header: 'Subject',
            accessor: 'subject.name',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.subject?.name || 'General'}
                </span>
            ),
        },
        {
            header: 'Due Date',
            accessor: 'due_date',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.due_date}
                </span>
            ),
        },
        {
            header: 'Max Marks',
            accessor: 'max_marks',
            cell: (row) => (
                <span className="whitespace-nowrap text-xs font-bold text-slate-800">
                    {row.max_marks} Marks
                </span>
            ),
        },
        {
            header: 'Submissions',
            accessor: 'submissions',
            className: 'text-center',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    <FileText size={12} className="text-emerald-500" /> {row.submissions?.length || 0}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={route('admin.assignments.submissions', row.id)}
                        className="inline-flex items-center gap-1 font-bold text-[#16a34a] hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-[3px] text-[11px] transition-all"
                        title="Review Submissions"
                    >
                        <Eye size={12} /> Review
                    </Link>
                </div>
            ),
        },
    ];

    const assignmentFilters = (
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
                value={selectedSubject}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedSubject(val);
                }}
                options={subjectOptions}
                placeholder="Filter by Subject"
                showSearch={false}
            />
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Assignments & Homework" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignments & Homework</h1>
                    <p className="text-sm text-slate-500">Create batch assignments, collect student homework & provide feedback.</p>
                </div>
                <div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Create Assignment
                    </button>
                </div>
            </div>

            {/* ASSIGNMENTS DATATABLE */}
            <DataTable
                columns={assignmentColumns}
                data={filteredAssignments}
                selectable={true}
                itemNoun="assignments"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search assignment title, batch..."
                advancedFilters={assignmentFilters}
            />

            {/* CREATE ASSIGNMENT MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Create New Assignment</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Define instructions, deadlines and target batch.</p>
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
                                <InputLabel htmlFor="title" value="Assignment Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Vector Physics Problem Set 01"
                                    required
                                    className="mt-1"
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="batch_id" value="Batch *" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.batch_id}
                                            onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                            options={batches.map(b => ({ id: b.id, name: b.name }))}
                                        />
                                    </div>
                                    <InputError message={errors.batch_id} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="subject_id" value="Subject" />
                                    <div className="mt-1">
                                        <SelectInput
                                            value={data.subject_id}
                                            onChange={(e) => setData('subject_id', e.target ? e.target.value : e)}
                                            options={subjects.map(s => ({ id: s.id, name: s.name }))}
                                            placeholder="Select Subject"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="due_date" value="Due Date *" />
                                    <TextInput
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                    <InputError message={errors.due_date} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="max_marks" value="Max Marks *" />
                                    <TextInput
                                        id="max_marks"
                                        type="number"
                                        value={data.max_marks}
                                        onChange={(e) => setData('max_marks', e.target.value)}
                                        placeholder="50"
                                        required
                                        className="mt-1"
                                    />
                                    <InputError message={errors.max_marks} className="mt-1" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Instructions / Description" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Write instructions or assignment questions..."
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="attachment_url" value="Resource / Attachment Link (Optional)" />
                                <TextInput
                                    id="attachment_url"
                                    type="url"
                                    value={data.attachment_url}
                                    onChange={(e) => setData('attachment_url', e.target.value)}
                                    placeholder="https://drive.google.com/..."
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
                                    Create Assignment
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
