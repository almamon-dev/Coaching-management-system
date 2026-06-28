import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SelectInput from '@/Components/SelectInput';
import Notify from '@/Utils/Notify';
import { Users, Search, ArrowRight, CheckCircle2, CheckSquare, Square } from 'lucide-react';

export default function StudentPromotion({ auth, classes, sessions, students, filters }) {
    const [fromSections, setFromSections] = useState([]);
    const [toSections, setToSections] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        from_session: filters.from_session || '',
        from_class: filters.from_class || '',
        from_section: filters.from_section || '',
        to_session: filters.to_session || '',
        to_class: filters.to_class || '',
        to_section: filters.to_section || '',
        student_ids: [],
    });

    // Populate from_sections when from_class changes
    useEffect(() => {
        if (data.from_class) {
            const cls = classes.find(c => c.id == data.from_class);
            setFromSections(cls?.sections || []);
        } else {
            setFromSections([]);
        }
    }, [data.from_class, classes]);

    // Populate to_sections when to_class changes
    useEffect(() => {
        if (data.to_class) {
            const cls = classes.find(c => c.id == data.to_class);
            setToSections(cls?.sections || []);
        } else {
            setToSections([]);
        }
    }, [data.to_class, classes]);

    const handleSearch = (e) => {
        e.preventDefault();
        
        if (!data.from_session || !data.from_class || !data.from_section) {
            Notify.error('Error', 'Please select Current Session, Class, and Section to search.');
            return;
        }

        router.get(route('admin.student-promotion.index'), {
            from_session: data.from_session,
            from_class: data.from_class,
            from_section: data.from_section,
            to_session: data.to_session,
            to_class: data.to_class,
            to_section: data.to_section,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleSelectAll = () => {
        if (data.student_ids.length === students.length) {
            setData('student_ids', []);
        } else {
            setData('student_ids', students.map(s => s.id));
        }
    };

    const toggleSelectStudent = (id) => {
        if (data.student_ids.includes(id)) {
            setData('student_ids', data.student_ids.filter(sId => sId !== id));
        } else {
            setData('student_ids', [...data.student_ids, id]);
        }
    };

    const handlePromote = (e) => {
        e.preventDefault();
        
        if (data.student_ids.length === 0) {
            Notify.error('Error', 'Please select at least one student to promote.');
            return;
        }
        
        if (!data.to_session || !data.to_class || !data.to_section) {
            Notify.error('Error', 'Please select Target Session, Class, and Section.');
            return;
        }

        post(route('admin.student-promotion.store'), {
            onSuccess: () => {
                Notify.success('Success', 'Students successfully promoted!');
                setData('student_ids', []);
            },
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Student Promotion" />

            <div className="mb-6">
                <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Student Promotion</h1>
                <p className="text-[#008060] text-[13px] mt-0.5 font-bold">Transfer students from one academic session to the next.</p>
            </div>

            {/* Step 1: Filter Current Students */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] mb-6">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search size={18} className="text-[#008060]" />
                        <h2 className="text-[15px] font-bold text-slate-800">1. Select Current Class</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Current Session</label>
                            <SelectInput
                                value={data.from_session}
                                onChange={e => setData('from_session', e.target.value)}
                                options={[{id: '', name: 'Select Session'}, ...sessions.map(s => ({id: s.id.toString(), name: s.name}))]}
                                className="w-full h-[38px]"
                                showSearch={false}
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Current Class</label>
                            <SelectInput
                                value={data.from_class}
                                onChange={e => {
                                    setData('from_class', e.target.value);
                                    setData('from_section', '');
                                }}
                                options={[{id: '', name: 'Select Class'}, ...classes.map(c => ({id: c.id.toString(), name: c.name}))]}
                                className="w-full h-[38px]"
                                showSearch={true}
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Current Section</label>
                            <SelectInput
                                value={data.from_section}
                                onChange={e => setData('from_section', e.target.value)}
                                options={[{id: '', name: 'Select Section'}, ...fromSections.map(s => ({id: s.id.toString(), name: s.name}))]}
                                className="w-full h-[38px]"
                                showSearch={false}
                                disabled={!data.from_class}
                            />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <button 
                            type="button" 
                            onClick={handleSearch}
                            className="h-[38px] px-6 bg-slate-800 text-white rounded-[4px] text-[13px] font-bold hover:bg-slate-700 transition-all flex items-center gap-2 shadow"
                        >
                            Fetch Students
                        </button>
                    </div>
                </div>
            </div>

            {/* Step 2: Students List & Promotion Config */}
            {students && students.length > 0 && (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] mb-12">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-[#008060]" />
                            <h2 className="text-[15px] font-bold text-slate-800">2. Select Students & Promote</h2>
                        </div>
                        <span className="px-3 py-1 bg-[#e6f2ef] text-[#008060] text-[12px] font-bold rounded-full">
                            {students.length} Students Found
                        </span>
                    </div>

                    <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                        <h3 className="text-[13px] font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Select Destination Class</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Promote To Session</label>
                                <SelectInput
                                    value={data.to_session}
                                    onChange={e => setData('to_session', e.target.value)}
                                    options={[{id: '', name: 'Select Session'}, ...sessions.map(s => ({id: s.id.toString(), name: s.name}))]}
                                    className="w-full h-[36px]"
                                    showSearch={false}
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Promote To Class</label>
                                <SelectInput
                                    value={data.to_class}
                                    onChange={e => {
                                        setData('to_class', e.target.value);
                                        setData('to_section', '');
                                    }}
                                    options={[{id: '', name: 'Select Class'}, ...classes.map(c => ({id: c.id.toString(), name: c.name}))]}
                                    className="w-full h-[36px]"
                                    showSearch={true}
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Promote To Section</label>
                                <SelectInput
                                    value={data.to_section}
                                    onChange={e => setData('to_section', e.target.value)}
                                    options={[{id: '', name: 'Select Section'}, ...toSections.map(s => ({id: s.id.toString(), name: s.name}))]}
                                    className="w-full h-[36px]"
                                    showSearch={false}
                                    disabled={!data.to_class}
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={handlePromote}
                                    disabled={processing || data.student_ids.length === 0}
                                    className="w-full h-[36px] bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <CheckCircle2 size={16} /> Promote ({data.student_ids.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-white border-b border-[#ebebeb]">
                                    <th className="py-3 px-6 w-[60px] text-center select-none">
                                        <div onClick={toggleSelectAll} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${data.student_ids.length === students.length && students.length > 0 ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1]'}`}>
                                            {data.student_ids.length === students.length && students.length > 0 && <CheckCircle2 size={12} strokeWidth={3} className="text-white" />}
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-[12px] font-bold text-slate-700 uppercase tracking-wider">Student Name</th>
                                    <th className="py-3 px-6 text-[12px] font-bold text-slate-700 uppercase tracking-wider">Current Info</th>
                                    <th className="py-3 px-6 text-[12px] font-bold text-slate-700 uppercase tracking-wider text-right">Result/Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ebebeb]">
                                {students.map((student) => {
                                    const isSelected = data.student_ids.includes(student.id);
                                    return (
                                        <tr key={student.id} className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/30' : ''}`}>
                                            <td className="py-3 px-6 text-center select-none">
                                                <div onClick={() => toggleSelectStudent(student.id)} className={`w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center ${isSelected ? 'bg-[#008060] border-[#008060]' : 'bg-white border-[#d1d1d1] hover:border-slate-400'}`}>
                                                    {isSelected && <CheckCircle2 size={12} strokeWidth={3} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="text-[13px] font-bold text-slate-800">{student.name}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">ID: {student.student_id || student.id}</div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="text-[12px] font-medium text-slate-700">
                                                    {student.academic_class?.name}
                                                </div>
                                                <div className="text-[11px] text-[#008060] mt-0.5 font-bold">
                                                    Section: {student.section?.name}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                {isSelected ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008060] bg-[#e6f2ef] px-2.5 py-1 rounded-full">
                                                        Selected for Promotion
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                                        Not Selected
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {students && students.length === 0 && data.from_class && (
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <Users size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">No Students Found</h3>
                    <p className="text-[13px] text-slate-500 max-w-sm">There are no students enrolled in the selected class and section for this session.</p>
                </div>
            )}
        </AdminLayout>
    );
}
