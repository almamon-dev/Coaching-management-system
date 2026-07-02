import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SelectInput from '@/Components/Form/SelectInput';
import Notify from '@/Utils/Notify';
import { Calculator, AlertTriangle, FileCheck2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/Components/Modal/ConfirmModal';

export default function Generation({ auth, exams, classes, sections, filters, existingResults, isPublished, previewData, subjectsList }) {
    const { data, setData, post, processing } = useForm({
        exam_id: filters?.exam_id || '',
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
    });

    const [isFetching, setIsFetching] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ show: false });

    const handleFilterChange = (field, value) => {
        setData(field, value);
        
        if (field === 'class_id') {
            setData('section_id', '');
            if (data.exam_id && value) {
                fetchData(data.exam_id, value, '');
            }
        } else if (field === 'exam_id') {
            if (value && data.class_id && data.section_id) {
                fetchData(value, data.class_id, data.section_id);
            }
        } else if (field === 'section_id') {
            if (data.exam_id && data.class_id && value) {
                fetchData(data.exam_id, data.class_id, value);
            }
        }
    };

    const fetchData = (exam_id, class_id, section_id) => {
        setIsFetching(true);
        router.get(route('admin.results.generation'), { exam_id, class_id, section_id }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsFetching(false),
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.exam_id || !data.class_id || !data.section_id) {
            Notify.error('Error', 'Please select all criteria before generating results.');
            return;
        }

        if (existingResults && isPublished) {
            Notify.error('Error', 'Results for this exam are already published and cannot be regenerated.');
            return;
        }

        if (existingResults) {
            setConfirmModal({ show: true });
            return;
        }

        confirmGenerate();
    };

    const confirmGenerate = () => {
        post(route('admin.results.generate'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmModal({ show: false });
            },
            onError: (errors) => {
                setConfirmModal({ show: false });
                if (errors.error) Notify.error('Error', errors.error);
            }
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Generate Results" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Generate Results</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Process and calculate student results based on marks.</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Exam <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={data.exam_id}
                            onChange={(e) => handleFilterChange('exam_id', e.target.value)}
                            options={[{ id: '', name: 'Select an Exam' }, ...exams.map(e => ({ id: e.id, name: e.name }))]}
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Class <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={data.class_id}
                            onChange={(e) => handleFilterChange('class_id', e.target.value)}
                            options={[{ id: '', name: 'Select a Class' }, ...classes.map(c => ({ id: c.id, name: c.name }))]}
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Select Section <span className="text-red-500">*</span></label>
                        <SelectInput
                            value={data.section_id}
                            onChange={(e) => handleFilterChange('section_id', e.target.value)}
                            options={[{ id: '', name: 'Select a Section' }, ...sections.map(s => ({ id: s.id, name: s.name }))]}
                            disabled={!data.class_id}
                        />
                    </div>
                </div>
            </div>

            {/* Action Section */}
            {data.exam_id && data.class_id && data.section_id ? (
                isFetching ? (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-12 text-center">
                        <Loader2 className="mx-auto mb-3 text-slate-300 animate-spin" size={32} />
                        <h2 className="text-[14px] font-bold text-slate-600">Loading details...</h2>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Action Panel */}
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-8 text-center">
                            {existingResults ? (
                                <>
                                    {isPublished ? (
                                        <>
                                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                                <FileCheck2 size={28} />
                                            </div>
                                            <h2 className="text-[18px] font-bold text-slate-800 mb-2">Results Published</h2>
                                            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed max-w-2xl mx-auto">
                                                The results for this class and exam have already been published. You cannot regenerate published results. To make changes, unpublish them first.
                                            </p>
                                            <button disabled className="px-6 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-[3px] text-[13px] cursor-not-allowed mx-auto">
                                                Cannot Regenerate
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                                <AlertTriangle size={28} />
                                            </div>
                                            <h2 className="text-[18px] font-bold text-slate-800 mb-2">Results Already Generated</h2>
                                            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed max-w-2xl mx-auto">
                                                Results for this class and exam have already been generated, but are not yet published. You can preview the marks below and regenerate them if marks have been updated.
                                            </p>
                                            <button 
                                                onClick={submit} 
                                                disabled={processing}
                                                className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-[3px] text-[13px] hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 mx-auto"
                                            >
                                                {processing ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                                                Regenerate Results
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-[#e4f1ef] text-[#008060] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#bce3db]">
                                        <Calculator size={28} />
                                    </div>
                                    <h2 className="text-[18px] font-bold text-slate-800 mb-2">Ready to Generate</h2>
                                    <p className="text-[13px] text-slate-500 mb-6 leading-relaxed max-w-2xl mx-auto">
                                        Click the button below to process all entered marks shown in the preview below and calculate total marks, GPA, and grades for all students in this section.
                                    </p>
                                    <button 
                                        onClick={submit} 
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-[#008060] text-white font-bold rounded-[3px] text-[13px] hover:bg-[#006e52] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 mx-auto"
                                    >
                                        {processing ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                                        Generate Results
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Marks Preview Table */}
                        {previewData && previewData.length > 0 ? (
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                                <div className="p-4 border-b border-[#ebebeb] bg-slate-50/50">
                                    <h2 className="text-[15px] font-bold text-slate-800">Marks Preview</h2>
                                    <p className="text-[12px] text-slate-500 mt-0.5">Preview of marks before result generation</p>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse font-sans min-w-[800px] border-t-0 [&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0 [&_tr:last-child>td]:border-b-0">
                                        <thead>
                                            <tr className="bg-[#f4f6f8]">
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] sticky left-0 z-10 bg-[#0bd462] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student Name</th>
                                                {subjectsList.map(subject => (
                                                    <th key={subject.id} className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] text-center whitespace-nowrap text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0" title={subject.name}>
                                                        {subject.code || subject.name.substring(0, 8)}
                                                    </th>
                                                ))}
                                                <th className="py-1.5 px-2 border border-[#0aa84e] font-medium text-[13px] text-center bg-[#0aa84e] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Total Raw Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, idx) => (
                                                <tr key={idx} className="bg-white hover:bg-slate-50/40 transition-colors">
                                                    <td className="py-1.5 px-2 border border-[#e5e7e5] sticky left-0 bg-white z-10">
                                                        <div className="flex flex-col">
                                                            <span className="text-[12.5px] font-medium text-[#333]">{row.student?.name}</span>
                                                            <span className="text-[11.5px] text-[#666]">{row.student?.email}</span>
                                                        </div>
                                                    </td>
                                                    {subjectsList.map(subject => (
                                                        <td key={subject.id} className="py-1.5 px-2 border border-[#e5e7e5] text-center">
                                                            {row.marks[subject.id] !== undefined ? (
                                                                <span className="text-[12.5px] font-bold text-[#333]">{row.marks[subject.id]}</span>
                                                            ) : (
                                                                <span className="text-[12px] text-slate-300">-</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td className="py-1.5 px-2 border border-[#e5e7e5] text-center bg-[#f0fcf5]">
                                                        <span className="text-[12.5px] font-bold text-[#008060]">{row.total_raw_marks}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-12 text-center">
                                <AlertTriangle className="mx-auto mb-3 text-amber-400" size={32} />
                                <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Marks Found</h2>
                                <p className="text-[13px] text-slate-500 max-w-sm mx-auto">No marks have been entered for this class and section. Please enter marks before generating results.</p>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                    <Calculator className="mx-auto mb-3 text-slate-300" size={40} />
                    <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Criteria Selected</h2>
                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">Please select an Exam, Class, and Section from the filters above to generate results.</p>
                </div>
            )}

            <ConfirmModal
                show={confirmModal.show}
                onClose={() => setConfirmModal({ show: false })}
                onConfirm={confirmGenerate}
                title="Regenerate Results"
                message="Results have already been generated for this class and section. Regenerating will overwrite existing results with the latest marks. Are you sure you want to proceed?"
                type="warning"
                confirmText="Yes, Regenerate"
                processing={processing}
            />
        </AdminLayout>
    );
}
