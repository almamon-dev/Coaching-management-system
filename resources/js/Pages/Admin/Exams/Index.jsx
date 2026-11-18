import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, X, Eye, Edit, Layers, FileText } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';
import DataTable from '@/Components/Table/DataTable';

export default function ExamIndex({ exams = [], batches = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        course_id: batches[0]?.id || '',
        batch_id: batches[0]?.id || '',
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: 100,
        pass_marks: 40,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.exams.store'), {
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

    const statusOptions = [
        { id: '', name: 'All Status' },
        { id: 'published', name: 'Published' },
        { id: 'upcoming', name: 'Upcoming' },
    ];

    const filteredExams = useMemo(() => {
        return exams.filter((ex) => {
            const matchesSearch = !search ||
                ex.title?.toLowerCase().includes(search.toLowerCase()) ||
                ex.batch?.name?.toLowerCase().includes(search.toLowerCase()) ||
                ex.course?.title?.toLowerCase().includes(search.toLowerCase());

            const matchesBatch = !selectedBatch || String(ex.batch_id) === String(selectedBatch);
            const matchesStatus = !selectedStatus ||
                (selectedStatus === 'published' ? ex.status === 'published' : ex.status !== 'published');

            return matchesSearch && matchesBatch && matchesStatus;
        });
    }, [exams, search, selectedBatch, selectedStatus]);

    const examColumns = [
        {
            header: 'Exam Title',
            accessor: 'title',
            cell: (row) => (
                <div>
                    <span className="font-bold text-slate-900 text-xs block max-w-[240px] truncate" title={row.title}>
                        {row.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                        {row.course?.title || 'Coaching Exam'}
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
            header: 'Exam Date',
            accessor: 'exam_date',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.exam_date}
                </span>
            ),
        },
        {
            header: 'Marks',
            accessor: 'total_marks',
            cell: (row) => (
                <span className="whitespace-nowrap text-xs font-bold text-slate-800">
                    {row.total_marks} <span className="text-[10px] font-medium text-slate-400">(Pass: {row.pass_marks})</span>
                </span>
            ),
        },
        {
            header: 'Students',
            accessor: 'results',
            className: 'text-center',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    <FileText size={12} className="text-emerald-500" /> {row.results?.length || 0}
                </span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
                <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[10.5px] font-bold rounded-full capitalize ${row.status === 'published' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                    {row.status}
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
                        href={route('admin.exams.marks', row.id)}
                        className="inline-flex items-center gap-1 font-bold text-[#16a34a] hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-[3px] text-[11px] transition-all"
                        title="Enter Marks"
                    >
                        <Edit size={12} /> Enter Marks
                    </Link>
                    <Link
                        href={route('admin.exams.results', row.id)}
                        className="inline-flex items-center gap-1 font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-[3px] text-[11px] transition-all"
                        title="View Results"
                    >
                        <Eye size={12} /> Results
                    </Link>
                </div>
            ),
        },
    ];

    const examFilters = (
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
                value={selectedStatus}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedStatus(val);
                }}
                options={statusOptions}
                placeholder="Filter by Status"
                showSearch={false}
            />
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Exam Management" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exam Management</h1>
                    <p className="text-sm text-slate-500">Create coaching evaluations, enter marks & publish auto-calculated GPAs.</p>
                </div>
                <div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Create Exam
                    </button>
                </div>
            </div>

            {/* EXAMS DATATABLE */}
            <DataTable
                columns={examColumns}
                data={filteredExams}
                selectable={true}
                itemNoun="exams"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search exam title, batch..."
                advancedFilters={examFilters}
            />

            {/* CREATE EXAM MODAL */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white max-w-md w-full p-6 rounded-[4px] shadow-xl space-y-4 border border-slate-200/80 overflow-visible relative my-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Create Coaching Exam</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Define exam schedule, batch and grading parameters.</p>
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
                                <InputLabel htmlFor="title" value="Exam Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Monthly Physics Model Test 01"
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
                                    <InputLabel htmlFor="exam_date" value="Exam Date *" />
                                    <TextInput
                                        id="exam_date"
                                        type="date"
                                        value={data.exam_date}
                                        onChange={(e) => setData('exam_date', e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="total_marks" value="Total Marks *" />
                                    <TextInput
                                        id="total_marks"
                                        type="number"
                                        value={data.total_marks}
                                        onChange={(e) => setData('total_marks', e.target.value)}
                                        placeholder="100"
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="pass_marks" value="Pass Marks *" />
                                    <TextInput
                                        id="pass_marks"
                                        type="number"
                                        value={data.pass_marks}
                                        onChange={(e) => setData('pass_marks', e.target.value)}
                                        placeholder="40"
                                        required
                                        className="mt-1"
                                    />
                                </div>
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
                                    Create Exam
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
