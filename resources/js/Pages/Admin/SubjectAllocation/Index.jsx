import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SelectInput from '@/Components/SelectInput';
import Notify from '@/Utils/Notify';
import { Save, AlertTriangle, BookOpen, User, Trash2 } from 'lucide-react';

export default function Index({ auth, classes, sections, subjects, teachers, allocations, filters }) {
    const { data, setData, post, processing } = useForm({
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
        allocations: allocations || {}
    });

    const handleClassChange = (classId) => {
        setData('class_id', classId);
        setData('section_id', '');
        router.get(route('admin.subject-allocation.index'), { class_id: classId }, { preserveState: true, replace: true });
    };

    const handleSectionChange = (sectionId) => {
        setData('section_id', sectionId);
        router.get(route('admin.subject-allocation.index'), { class_id: data.class_id, section_id: sectionId }, { preserveState: true, replace: true });
    };

    const [assignments, setAssignments] = useState([]);

    // Update form allocations when props change
    useEffect(() => {
        const initialAssignments = Object.keys(allocations || {}).map(subjectId => ({
            id: Math.random().toString(36).substr(2, 9),
            subject_id: subjectId,
            teacher_id: allocations[subjectId]
        }));
        setAssignments(initialAssignments);
    }, [allocations]);

    const handleAddAssignment = () => {
        setAssignments([...assignments, { id: Math.random().toString(36).substr(2, 9), subject_id: '', teacher_id: '' }]);
    };

    const handleRemoveAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const handleAssignmentChange = (id, field, value) => {
        setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Transform array back to object
        const finalAllocations = {};
        assignments.forEach(a => {
            if (a.subject_id && a.teacher_id) {
                finalAllocations[a.subject_id] = a.teacher_id;
            }
        });

        setData('allocations', finalAllocations);
    };

    // Use another useEffect to post after setData if needed, or just post directly
    // Let's rewrite submit to post directly without needing an extra render cycle
    const handleSave = () => {
        const finalAllocations = {};
        assignments.forEach(a => {
            if (a.subject_id && a.teacher_id) {
                finalAllocations[a.subject_id] = a.teacher_id;
            }
        });

        post(route('admin.subject-allocation.store'), {
            data: { class_id: data.class_id, section_id: data.section_id, allocations: finalAllocations },
            onSuccess: () => Notify.success('Saved', 'Subject allocations updated successfully.'),
            preserveScroll: true
        });
    };

    const hasSelection = data.class_id && data.section_id;

    // Get selected subject IDs to disable them in other dropdowns
    const selectedSubjectIds = assignments.map(a => a.subject_id).filter(Boolean);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Subject Allocation" />

            <div className="mb-6">
                <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Subject Allocation</h1>
                <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Assign teachers to specific subjects for each class and section.</p>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Class <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={data.class_id}
                            onChange={(e) => handleClassChange(e.target.value)}
                            options={[{ id: '', name: 'Select a Class' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Section <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={data.section_id}
                            onChange={(e) => handleSectionChange(e.target.value)}
                            options={[{ id: '', name: 'Select a Section' }, ...sections.map(s => ({ id: s.id, name: s.name }))]}
                            disabled={!data.class_id}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Allocation Table */}
            {hasSelection ? (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] flex flex-col">
                    <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold text-[13px]">
                            <BookOpen size={16} />
                            <span>Assigned Subjects</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddAssignment}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-[3px] text-[12px] font-bold hover:bg-blue-100 transition-colors"
                        >
                            + Add Subject
                        </button>
                    </div>
                    
                    <div className="flex-1">
                        <div className="overflow-visible">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-[#ebebeb]">
                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700">Subject</th>
                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700 w-[350px]">Assigned Teacher</th>
                                        <th className="py-2.5 px-4 text-[12px] font-bold text-slate-700 w-[60px] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ebebeb]">
                                    {assignments.map((assignment, index) => (
                                        <tr key={assignment.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-2 px-4">
                                                <SelectInput
                                                    value={assignment.subject_id}
                                                    onChange={(e) => handleAssignmentChange(assignment.id, 'subject_id', e.target.value)}
                                                    options={[{ id: '', name: '-- Select Subject --' }, ...subjects
                                                        .filter(subject => !selectedSubjectIds.includes(subject.id.toString()) || assignment.subject_id === subject.id.toString())
                                                        .map(subject => ({ id: subject.id.toString(), name: `${subject.name} (${subject.code})` }))
                                                    ]}
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <SelectInput
                                                    value={assignment.teacher_id}
                                                    onChange={(e) => handleAssignmentChange(assignment.id, 'teacher_id', e.target.value)}
                                                    disabled={!assignment.subject_id}
                                                    options={[{ id: '', name: '-- Select Teacher --' }, ...teachers
                                                        .filter(t => t.specializations && t.specializations.map(s => s.toString()).includes(assignment.subject_id))
                                                        .map(t => ({ id: t.id.toString(), name: t.name }))
                                                    ]}
                                                />
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAssignment(assignment.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-[3px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors mx-auto"
                                                    title="Remove Subject"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-10 text-center text-slate-400">
                                                <p className="text-[13px] mb-2">No subjects assigned yet.</p>
                                                <button
                                                    type="button"
                                                    onClick={handleAddAssignment}
                                                    className="text-blue-600 font-semibold hover:underline"
                                                >
                                                    Add the first subject
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#ebebeb] bg-slate-50 flex justify-end rounded-b-[4px]">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={processing}
                            className="px-6 py-2 bg-[#008060] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                        >
                            <Save size={14} />
                            Save Allocations
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                    <AlertTriangle className="mx-auto mb-3 text-slate-300" size={40} />
                    <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Class/Section Selected</h2>
                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">Please select both a class and a section from the filters above to assign subject teachers.</p>
                </div>
            )}
        </AdminLayout>
    );
}
