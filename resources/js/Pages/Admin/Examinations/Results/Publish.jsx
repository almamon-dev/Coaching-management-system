import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SelectInput from '@/Components/Form/SelectInput';
import Notify from '@/Utils/Notify';
import { FileCheck2, AlertTriangle, Search, CheckCircle, Send, Loader2, Printer } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import ConfirmModal from '@/Components/Modal/ConfirmModal';

export default function Publish({ auth, exams, classes, sections, filters, results, isPublished }) {
    const { data, setData, post, processing } = useForm({
        exam_id: filters?.exam_id || '',
        class_id: filters?.class_id || '',
        section_id: filters?.section_id || '',
    });

    const [isFetching, setIsFetching] = useState(false);
    const [search, setSearch] = useState('');
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
        router.get(route('admin.results.publish'), { exam_id, class_id, section_id }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsFetching(false),
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.exam_id || !data.class_id || !data.section_id) {
            Notify.error('Error', 'Please select all criteria before publishing results.');
            return;
        }

        if (isPublished) {
            Notify.error('Error', 'Results are already published.');
            return;
        }

        setConfirmModal({ show: true });
    };

    const confirmPublish = () => {
        post(route('admin.results.doPublish'), {
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

    const filteredResults = results?.filter(r => 
        r.student?.name.toLowerCase().includes(search.toLowerCase()) || 
        r.student?.email.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Publish Results" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Publish Results</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Review generated results and publish them to students.</p>
                </div>
                {results?.length > 0 && !isPublished && (
                    <button 
                        onClick={submit}
                        disabled={processing}
                        className="px-4 py-1.5 bg-[#008060] text-white rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-sm disabled:opacity-70"
                    >
                        {processing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Publish All Results
                    </button>
                )}
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

            {/* Content Section */}
            {data.exam_id && data.class_id && data.section_id ? (
                isFetching ? (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-12 text-center">
                        <Loader2 className="mx-auto mb-3 text-slate-300 animate-spin" size={32} />
                        <h2 className="text-[14px] font-bold text-slate-600">Loading results...</h2>
                    </div>
                ) : results?.length > 0 ? (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                        <div className="border-b border-[#ebebeb] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                {isPublished ? (
                                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-[3px] border border-blue-100">
                                        <CheckCircle size={14} />
                                        Published
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-[3px] border border-amber-100">
                                        <AlertTriangle size={14} />
                                        Draft (Not Published)
                                    </span>
                                )}
                                <span className="text-[13px] font-medium text-slate-600">
                                    {results.length} Students
                                </span>
                            </div>
                            <div className="relative w-full sm:w-[280px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                                <TextInput
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search student..."
                                    className="h-[32px] pl-9 w-full text-[12px]"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#f4f6f8]">
                                        <th className="py-3 px-4 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student Name</th>
                                        <th className="py-3 px-4 text-[12px] font-bold text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Total Marks</th>
                                        <th className="py-3 px-4 text-[12px] font-bold text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">GPA</th>
                                        <th className="py-3 px-4 text-[12px] font-bold text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Grade</th>
                                        <th className="py-3 px-4 text-[12px] font-bold text-center text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Status</th>
                                        <th className="py-3 px-4 text-[12px] font-bold text-right text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ebebeb]">
                                    {filteredResults.map((result) => (
                                        <tr key={result.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-2.5 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800">{result.student?.name}</span>
                                                    <span className="text-[11px] text-slate-500">{result.student?.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 text-center text-[13px] font-medium text-slate-700">
                                                {result.total_marks}
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <span className="text-[13px] font-bold text-[#008060]">{result.gpa}</span>
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <span className={`text-[12px] font-bold px-2 py-0.5 rounded-[3px] border ${result.grade === 'F' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    {result.grade}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <span className={`text-[12px] font-bold ${result.status === 'Failed' ? 'text-red-600' : 'text-[#008060]'}`}>
                                                    {result.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-4 text-right">
                                                <a 
                                                    href={route('admin.results.report-card', result.id)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#008060] hover:bg-[#e4f1ef] transition-colors"
                                                    title="View Report Card"
                                                >
                                                    <Printer size={16} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredResults.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500 text-[13px]">
                                                No results found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                        <AlertTriangle className="mx-auto mb-3 text-amber-400" size={40} />
                        <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Results Generated</h2>
                        <p className="text-[13px] text-slate-500 max-w-sm mx-auto mb-4">Results for the selected exam and class have not been generated yet. Please generate results first.</p>
                        <button 
                            onClick={() => router.get(route('admin.results.generation'))}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-[3px] text-[12px] font-bold hover:bg-slate-50"
                        >
                            Go to Generate Results
                        </button>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                    <FileCheck2 className="mx-auto mb-3 text-slate-300" size={40} />
                    <h2 className="text-[15px] font-bold text-slate-700 mb-1">No Criteria Selected</h2>
                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">Please select an Exam, Class, and Section from the filters above to review and publish results.</p>
                </div>
            )}

            <ConfirmModal
                show={confirmModal.show}
                onClose={() => setConfirmModal({ show: false })}
                onConfirm={confirmPublish}
                title="Publish Results"
                message="Are you sure you want to publish these results? Once published, they will become visible to students and parents."
                type="success"
                confirmText="Yes, Publish Results"
                processing={processing}
            />
        </AdminLayout>
    );
}
