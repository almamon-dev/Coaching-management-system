import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import TeacherLayout from '@/Layouts/TeacherLayout';
import SelectInput from '@/Components/Form/SelectInput';
import TextInput from '@/Components/Form/TextInput';
import Notify from '@/Utils/Notify';
import ConfirmModal from '@/Components/Modal/ConfirmModal';
import { Search, Save, AlertTriangle, FileSpreadsheet, Award } from 'lucide-react';

export default function MarksEntry({ auth, exams, classes, sections, subjects, students, existingMarks, filters }) {
    const { data, setData, post, processing, errors } = useForm({
        exam_id: filters?.exam_id || '',
        academic_class_id: filters?.academic_class_id || '',
        section_id: filters?.section_id || '',
        subject_id: filters?.subject_id || '',
        marks: [], 
    });

    // Initialize marks form data when students or existing marks change
    useEffect(() => {
        if (students && students.length > 0) {
            const marksData = students.map(student => {
                const existing = existingMarks[student.id];
                return {
                    student_id: student.id,
                    marks: existing ? existing.marks : '',
                    comments: existing ? existing.comments : '',
                };
            });
            setData('marks', marksData);
        } else {
            setData('marks', []);
        }
    }, [students, existingMarks]);

    const handleFilterChange = (field, value) => {
        setData(field, value);
    };

    const handleSearch = () => {
        if (!data.exam_id || !data.academic_class_id || !data.section_id || !data.subject_id) {
            Notify.error('Required', 'Please select Exam, Class, Section, and Subject.');
            return;
        }

        router.get(route('teacher.marks.entry'), {
            exam_id: data.exam_id,
            academic_class_id: data.academic_class_id,
            section_id: data.section_id,
            subject_id: data.subject_id,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleMarkChange = (index, field, value) => {
        const newMarks = [...data.marks];
        newMarks[index][field] = value;
        setData('marks', newMarks);
    };

    const submit = (e) => {
        e.preventDefault();
        executeSave();
    };

    const executeSave = () => {
        post(route('teacher.marks.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                Notify.success('Success', 'Marks saved successfully.');
            }
        });
    };

    const handleAutoSave = () => {
        if (!data.exam_id || !data.academic_class_id || !data.section_id || !data.subject_id) return;
        
        axios.post(route('teacher.marks.store'), data)
            .catch(error => {
                console.error("Auto-save error:", error);
            });
    };

    return (
        <TeacherLayout user={auth?.user}>
            <Head title="Marks Entry" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Marks Entry</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Enter student marks for examinations.</p>
                </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Examination</label>
                        <SelectInput
                            value={data.exam_id}
                            onChange={(e) => handleFilterChange('exam_id', e.target.value)}
                            options={exams}
                            placeholder="Select Exam"
                        />
                        {errors.exam_id && <p className="text-[11px] text-red-500 mt-1">{errors.exam_id}</p>}
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Class</label>
                        <SelectInput
                            value={data.academic_class_id}
                            onChange={(e) => handleFilterChange('academic_class_id', e.target.value)}
                            options={classes}
                            placeholder="Select Class"
                        />
                        {errors.academic_class_id && <p className="text-[11px] text-red-500 mt-1">{errors.academic_class_id}</p>}
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Section</label>
                        <SelectInput
                            value={data.section_id}
                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                            options={sections.filter(s => String(s.academic_class_id) === String(data.academic_class_id))}
                            placeholder="Select Section"
                        />
                        {errors.section_id && <p className="text-[11px] text-red-500 mt-1">{errors.section_id}</p>}
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Subject</label>
                        <SelectInput
                            value={data.subject_id}
                            onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                            options={subjects}
                            placeholder="Select Subject"
                        />
                        {errors.subject_id && <p className="text-[11px] text-red-500 mt-1">{errors.subject_id}</p>}
                    </div>
                    <div>
                        <button
                            onClick={handleSearch}
                            className="w-full h-[36px] bg-slate-800 text-white rounded-[3px] text-[12px] font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search size={14} /> Fetch Students
                        </button>
                    </div>
                </div>
            </div>

            {students && students.length > 0 ? (
                <form onSubmit={submit} className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                    <div className="p-4 border-b border-[#ebebeb] flex justify-between items-center bg-[#f8f9fa]">
                        <div className="flex items-center gap-2 text-slate-700">
                            <FileSpreadsheet size={18} className="text-[#008060]"/>
                            <span className="text-[13px] font-bold">Student List ({students.length})</span>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] text-[12px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            <Save size={14} /> {processing ? 'Saving...' : 'Save Marks'}
                        </button>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse font-sans min-w-[600px] border-t-0 [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tr:last-child>td]:border-b-0">
                            <thead>
                                <tr className="bg-[#0bd462] text-white">
                                    <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[100px]">Roll No</th>
                                    <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Student Name</th>
                                    <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] w-[180px]">Marks Obtained</th>
                                    <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px]">Comments / Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id} className="bg-white hover:bg-slate-50/40 transition-colors group">
                                        <td className="py-1.5 px-2 border border-[#e5e7e5] text-[12.5px] font-bold text-[#333]">
                                            {student.roll_number || '-'}
                                        </td>
                                        <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                            <div className="text-[12.5px] font-medium text-[#333]">{student.name}</div>
                                            <div className="text-[11.5px] text-[#666]">{student.email}</div>
                                        </td>
                                        <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                            <TextInput
                                                type="number"
                                                step="0.01"
                                                value={data.marks[index]?.marks ?? ''}
                                                onChange={(e) => handleMarkChange(index, 'marks', e.target.value)}
                                                onBlur={handleAutoSave}
                                                className="w-full text-[13px] h-[30px] font-bold text-center border-[#d1d1d1] focus:border-[#0bd462] focus:ring-[#0bd462] shadow-none rounded-[3px]"
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="py-1.5 px-2 border border-[#e5e7e5]">
                                            <TextInput
                                                type="text"
                                                value={data.marks[index]?.comments ?? ''}
                                                onChange={(e) => handleMarkChange(index, 'comments', e.target.value)}
                                                onBlur={handleAutoSave}
                                                className="w-full text-[13px] h-[30px] border-[#d1d1d1] focus:border-[#0bd462] focus:ring-[#0bd462] shadow-none rounded-[3px]"
                                                placeholder="Optional comment"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-[#ebebeb] bg-slate-50/50 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-[#008060] text-white rounded-[3px] text-[13px] font-bold hover:bg-[#006e52] transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            <Save size={16} /> Save All Marks
                        </button>
                    </div>
                </form>
            ) : filters?.exam_id ? (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] p-12 text-center shadow-sm">
                    <AlertTriangle className="mx-auto mb-3 text-amber-500" size={40} />
                    <h5 className="text-[15px] font-bold text-slate-800">No students found</h5>
                    <p className="text-[13px] text-[#6d7175] mt-1 max-w-md mx-auto">
                        No active enrollments found for the selected Class and Section. Please make sure students are enrolled and their status is active.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-[4px] border border-dashed border-[#d1d1d1] p-12 text-center bg-slate-50/50">
                    <FileSpreadsheet className="mx-auto mb-3 text-slate-400" size={40} />
                    <h5 className="text-[15px] font-bold text-slate-700">Select filters to enter marks</h5>
                    <p className="text-[13px] text-[#6d7175] mt-1 max-w-sm mx-auto">
                        Choose an Exam, Class, Section, and Subject from the filters above and click "Fetch Students" to begin data entry.
                    </p>
                </div>
            )}

        </TeacherLayout>
    );
}
