import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, FileMinus, Search, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import { toast } from 'react-toastify';

export default function StudentTransfer({ auth, classes, sections, sessions, students, filters }) {
    const [filterState, setFilterState] = useState({
        class_id: filters.class_id || '',
        section_id: filters.section_id || '',
    });

    const [filteredSections, setFilteredSections] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        enrollment_ids: [],
        transfer_date: new Date().toISOString().split('T')[0],
        transfer_reason: '',
    });

    // Update section dropdown when class changes
    useEffect(() => {
        if (filterState.class_id) {
            const cls = classes.find(c => c.id.toString() === filterState.class_id.toString());
            if (cls && cls.sections) {
                setFilteredSections(cls.sections);
            } else {
                setFilteredSections(sections);
            }
        } else {
            setFilteredSections([]);
        }
    }, [filterState.class_id, classes, sections]);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filterState, [field]: value };
        
        // Reset section if class changes
        if (field === 'class_id') {
            newFilters.section_id = '';
        }
        
        setFilterState(newFilters);

        if (newFilters.class_id && newFilters.section_id) {
            const url = new URL(window.location.href);
            url.searchParams.set('class_id', newFilters.class_id);
            url.searchParams.set('section_id', newFilters.section_id);
            window.location.href = url.toString();
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setData('enrollment_ids', students.map(s => s.enrollment_id));
        } else {
            setData('enrollment_ids', []);
        }
    };

    const handleSelectStudent = (enrollmentId) => {
        const currentIds = data.enrollment_ids;
        if (currentIds.includes(enrollmentId)) {
            setData('enrollment_ids', currentIds.filter(id => id !== enrollmentId));
        } else {
            setData('enrollment_ids', [...currentIds, enrollmentId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.enrollment_ids.length === 0) {
            toast.error('Please select at least one student to transfer.');
            return;
        }

        if (confirm(`Are you sure you want to mark ${data.enrollment_ids.length} student(s) as transferred? This will remove them from active enrollments.`)) {
            post(route('admin.student-transfer.store'), {
                onSuccess: () => {
                    toast.success('Students transferred successfully.');
                    setData('enrollment_ids', []);
                },
                onError: () => {
                    toast.error('Failed to transfer students.');
                }
            });
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Student Transfer" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Transfer (TC)</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Issue Transfer Certificates and mark students as transferred.</p>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] mb-6">
                <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50 flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Class <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={filterState.class_id}
                            onChange={(e) => handleFilterChange('class_id', e.target.value)}
                            options={[
                                { id: '', name: 'Select Class' },
                                ...classes.map(c => ({ id: c.id, name: c.name }))
                            ]}
                            className="h-[34px] text-[13px] w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Section <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={filterState.section_id}
                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                            options={[
                                { id: '', name: 'Select Section' },
                                ...filteredSections.map(s => ({ id: s.id, name: s.name }))
                            ]}
                            className="h-[34px] text-[13px] w-full"
                            disabled={!filterState.class_id}
                        />
                    </div>
                </div>

                {!filterState.class_id || !filterState.section_id ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <h3 className="text-[14px] font-bold text-slate-700">Select Class & Section</h3>
                        <p className="text-[12px] text-slate-400 mt-1">to load students for transfer.</p>
                    </div>
                ) : students && students.length > 0 ? (
                    <div className="p-4 border-t border-[#ebebeb]">
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex gap-3 items-start">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-amber-800">Transfer Confirmation</h4>
                                <p className="text-[12px] text-amber-700 mt-1">
                                    Selecting students and marking them as transferred will change their enrollment status to <strong>transferred</strong>. They will no longer appear in the active student lists for this session.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4 mb-4 bg-slate-50 p-4 rounded-md border border-slate-100">
                                <div className="w-full md:w-1/3">
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Transfer Date <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date"
                                        value={data.transfer_date}
                                        onChange={e => setData('transfer_date', e.target.value)}
                                        className="h-[34px] w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060]"
                                        required
                                    />
                                    {errors.transfer_date && <div className="text-red-500 text-[11px] mt-1">{errors.transfer_date}</div>}
                                </div>
                                <div className="w-full md:w-2/3">
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Transfer Reason (Optional)</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Relocation, Moving to another school"
                                        value={data.transfer_reason}
                                        onChange={e => setData('transfer_reason', e.target.value)}
                                        className="h-[34px] w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060]"
                                    />
                                    {errors.transfer_reason && <div className="text-red-500 text-[11px] mt-1">{errors.transfer_reason}</div>}
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-[#ebebeb] rounded-t-md">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#f4f6f8]">
                                            <th className="py-3 px-4 w-[50px] text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={students.length > 0 && data.enrollment_ids.length === students.length}
                                                    className="rounded-[3px] border-slate-300 text-[#008060] focus:ring-[#008060]"
                                                />
                                            </th>
                                            <th className="py-3 px-4 text-[12px] font-bold w-[150px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student ID</th>
                                            <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student Name</th>
                                            <th className="py-3 px-4 text-[12px] font-bold w-[120px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Roll No</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#ebebeb]">
                                        {students.map((student) => (
                                            <tr key={student.enrollment_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-2 px-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.enrollment_ids.includes(student.enrollment_id)}
                                                        onChange={() => handleSelectStudent(student.enrollment_id)}
                                                        className="rounded-[3px] border-slate-300 text-[#008060] focus:ring-[#008060]"
                                                    />
                                                </td>
                                                <td className="py-2 px-4">
                                                    <span className="text-[12.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                        {student.student_id}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <span className="text-[13px] font-semibold text-[#202223]">{student.name}</span>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <span className="text-[13px] font-bold text-slate-600">{student.roll_number || 'N/A'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="flex justify-end p-4 bg-slate-50 border-x border-b border-[#ebebeb] rounded-b-md">
                                <button
                                    type="submit"
                                    disabled={processing || data.enrollment_ids.length === 0}
                                    className="h-[34px] px-6 bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold rounded-[3px] shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <FileMinus size={15} />
                                    {processing ? 'Processing...' : `Transfer ${data.enrollment_ids.length > 0 ? data.enrollment_ids.length : ''} Student(s)`}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <h3 className="text-[14px] font-bold text-slate-700">No Students Found</h3>
                        <p className="text-[12px] text-slate-400 mt-1">There are no active students in this class and section.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
