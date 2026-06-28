import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Save, Settings2, RefreshCw, BookOpen } from 'lucide-react';
import SelectInput from '@/Components/SelectInput';
import { toast } from 'react-toastify';

export default function Index({ sessions, classes, sections, students, filters }) {
    const [filterState, setFilterState] = useState({
        session_id: filters?.session_id || '',
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
    });

    const { data, setData, post, processing } = useForm({
        rolls: []
    });

    // Initialize the form with student data when loaded
    useEffect(() => {
        if (students && students.length > 0) {
            setData('rolls', students.map(s => ({
                enrollment_id: s.enrollment_id,
                roll_number: s.current_roll || ''
            })));
        } else {
            setData('rolls', []);
        }
    }, [students]);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filterState, [field]: value };
        setFilterState(newFilters);
        
        if (newFilters.session_id && newFilters.class_id && newFilters.section_id) {
            router.get(route('admin.roll-generation.index'), newFilters, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleRollChange = (enrollmentId, value) => {
        const updatedRolls = data.rolls.map(roll => {
            if (roll.enrollment_id === enrollmentId) {
                return { ...roll, roll_number: value };
            }
            return roll;
        });
        setData('rolls', updatedRolls);
    };

    const autoGenerateSequential = () => {
        const updatedRolls = data.rolls.map((roll, index) => ({
            ...roll,
            roll_number: index + 1
        }));
        setData('rolls', updatedRolls);
        toast.success('Generated sequential rolls based on display order.');
    };

    const autoGenerateMeritWise = () => {
        toast.info('Marks and Grading module is currently ongoing. Merit-wise roll generation will be available soon!', {
            icon: '🚧'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roll-generation.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Roll numbers saved successfully!');
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Roll Generation" />

            <div className="max-w-full mx-auto p-4 md:p-6 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Roll Generation</h1>
                        <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Manage and generate roll numbers for students in a class.</p>
                    </div>
                    {students && students.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={autoGenerateSequential}
                                className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7] text-[12.5px] font-bold rounded-[3px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <RefreshCw size={14} className="text-[#5c5f62]" />
                                Auto Generate
                            </button>
                            <button
                                type="button"
                                onClick={autoGenerateMeritWise}
                                className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7] text-[12.5px] font-bold rounded-[3px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <RefreshCw size={14} className="text-[#5c5f62]" />
                                Grade Wise Generate
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="h-[32px] px-4 bg-[#008060] hover:bg-[#006e52] text-white text-[12.5px] font-bold rounded-[3px] shadow-inner-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                            >
                                <Save size={14} />
                                {processing ? 'Saving...' : 'Save Rolls'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    
                    {/* Toolbar / Filter */}
                    <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50 flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/4">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Session <span className="text-red-500">*</span></label>
                            <SelectInput
                                value={filterState.session_id}
                                onChange={(e) => handleFilterChange('session_id', e.target.value)}
                                options={[
                                    { id: '', name: 'Select Session' },
                                    ...sessions.map(s => ({ id: s.id, name: s.name }))
                                ]}
                                className="h-[34px] text-[13px] w-full"
                            />
                        </div>
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
                                    ...sections
                                        .filter(s => filterState.class_id ? s.academic_class_id == filterState.class_id : true)
                                        .map(s => ({ id: s.id, name: s.name }))
                                ]}
                                className="h-[34px] text-[13px] w-full"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {!filterState.session_id || !filterState.class_id || !filterState.section_id ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                                <Settings2 size={40} className="mb-3 text-slate-300" />
                                <p className="text-[14px] font-medium text-slate-500">Please select Session, Class, and Section</p>
                                <p className="text-[12px] text-slate-400 mt-1">to load students for roll generation.</p>
                            </div>
                        ) : students && students.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-y border-[#ebebeb] bg-[#f8f9fa]">
                                            <th className="py-3 px-4 text-[12px] font-bold text-slate-600 w-[60px] text-center">#</th>
                                            <th className="py-3 px-4 text-[12px] font-bold text-slate-600 w-[130px]">Student ID</th>
                                            <th className="py-3 px-4 text-[12px] font-bold text-slate-600">Student Name</th>
                                            <th className="py-3 px-4 text-[12px] font-bold text-slate-600 w-[180px]">Class & Section</th>
                                            <th className="py-3 px-4 text-[12px] font-bold text-slate-600 w-[150px]">Roll Number</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#ebebeb]">
                                        {students.map((student, index) => {
                                            const rollData = data.rolls.find(r => r.enrollment_id === student.enrollment_id);
                                            return (
                                                <tr key={student.enrollment_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-2 px-4 text-center text-[12px] font-medium text-slate-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                            {student.student_id}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-4 text-[13px] font-bold text-slate-800">
                                                        {student.name}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="inline-flex items-center gap-1.5 text-[12px] bg-emerald-50 text-[#008060] px-2.5 py-1 rounded-md border border-emerald-100">
                                                            <BookOpen size={12} className="shrink-0" />
                                                            <span className="font-bold">{student.class}</span>
                                                            <span className="opacity-50">•</span>
                                                            <span className="font-bold">{student.section}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input 
                                                            type="number"
                                                            min="1"
                                                            value={rollData?.roll_number || ''}
                                                            onChange={(e) => handleRollChange(student.enrollment_id, e.target.value)}
                                                            className="w-[120px] h-[30px] rounded-[3px] border border-[#d1d1d1] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] text-[13px] font-medium px-2 py-1"
                                                            placeholder="Roll No"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                                <p className="text-[14px] font-medium text-slate-500">No active students found in this class.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
