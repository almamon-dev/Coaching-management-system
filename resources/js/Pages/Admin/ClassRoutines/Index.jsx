import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, AlertTriangle, X, Calendar, Clock, BookOpen, Layers } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function ClassRoutineIndex({ routines = [], batches = [], subjects = [] }) {
    const { errors: pageErrors } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        batch_id: batches[0]?.id || '',
        room: 'Room 101',
        class_date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:30',
        status: 'scheduled',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.class-routines.store'), {
            onSuccess: () => { reset(); setShowModal(false); }
        });
    };

    const batchOptions = batches.map(b => ({ 
        id: b.id, 
        name: `${b.name} — [${b.course?.title || 'Subject'}]` 
    }));

    const selectedBatchObj = batches.find(b => String(b.id) === String(data.batch_id));

    const columns = [
        {
            header: "Date & Time",
            accessor: "class_date",
            className: "w-[180px]",
            cell: (row) => (
                <div className="whitespace-nowrap">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#16a34a]" /> {row.class_date}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-slate-400" /> {row.start_time} - {row.end_time}
                    </div>
                </div>
            )
        },
        {
            header: "Batch Name",
            accessor: "batch",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Layers size={14} className="text-[#16a34a] shrink-0" />
                    <span className="font-bold text-slate-900 text-xs">{row.batch ? row.batch.name : 'N/A'}</span>
                </div>
            )
        },
        {
            header: "Subject",
            accessor: "subject",
            cell: (row) => (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    <BookOpen size={12} /> {row.batch?.course?.title || 'General Subject'}
                </span>
            )
        },
        {
            header: "Room",
            accessor: "room",
            className: "w-[110px]",
            cell: (row) => <span className="text-xs text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-[3px]">{row.room || 'Room 101'}</span>
        },
        {
            header: "Status",
            accessor: "status",
            className: "w-[120px]",
            cell: (row) => (
                <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                    row.status === 'scheduled' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' :
                    row.status === 'rescheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                    {row.status}
                </span>
            )
        }
    ];

    const filteredRoutines = routines.filter(r => {
        const batchName = r.batch?.name || '';
        const subjectName = r.batch?.course?.title || '';
        const query = search.toLowerCase();
        return batchName.toLowerCase().includes(query) || subjectName.toLowerCase().includes(query) || (r.class_date || '').includes(query);
    });

    return (
        <AdminLayout>
            <Head title="Class & Routine Management" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Class & Routine Management</h1>
                    <p className="text-sm text-slate-500">Schedule weekly coaching routines by Batch & Subject with automatic room conflict detection.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Schedule Class Routine
                </button>
            </div>

            {/* CONFLICT / GENERAL ERRORS */}
            {pageErrors.room && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                    <span>{pageErrors.room}</span>
                </div>
            )}

            {/* MODULAR DATATABLE */}
            <DataTable
                columns={columns}
                data={filteredRoutines}
                selectable={true}
                itemNoun="routines"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by batch name, subject, or date..."
            />

            {/* SCHEDULE CLASS MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Schedule Class Routine</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="batch_id" value="Select Batch *" />
                                <SelectInput
                                    value={data.batch_id}
                                    onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                    options={batchOptions}
                                    placeholder="Select Batch"
                                />
                                <InputError message={errors.batch_id} className="mt-1" />
                            </div>

                            {selectedBatchObj?.course && (
                                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-md flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Subject</span>
                                        <span className="text-xs font-bold text-[#16a34a]">{selectedBatchObj.course.title} ({selectedBatchObj.course.code})</span>
                                    </div>
                                    <BookOpen size={18} className="text-[#16a34a]" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="room" value="Room Number *" />
                                <TextInput
                                    id="room"
                                    type="text"
                                    value={data.room}
                                    onChange={(e) => setData('room', e.target.value)}
                                    placeholder="Room 101"
                                    required
                                />
                                <InputError message={errors.room} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <InputLabel htmlFor="class_date" value="Class Date *" />
                                    <TextInput
                                        id="class_date"
                                        type="date"
                                        value={data.class_date}
                                        onChange={(e) => setData('class_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="start_time" value="Start Time *" />
                                    <TextInput
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_time" value="End Time *" />
                                    <TextInput
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        required
                                    />
                                </div>
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
                                    Schedule & Verify Conflict
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
