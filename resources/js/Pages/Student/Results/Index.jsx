import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Printer, FileText, BarChart2, BookOpen, User as UserIcon, Calendar, GraduationCap } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';

export default function Index({ auth, results }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedExamId, setSelectedExamId] = useState(results?.[0]?.id || null);

    const tabs = [
        { id: 'summary', label: 'Summary Overview', icon: BarChart2 },
        { id: 'performance', label: 'Detailed Performance', icon: BookOpen },
    ];

    const activeResult = results?.find(r => r.id === selectedExamId);

    return (
        <UserLayout user={auth?.user}>
            <Head title="My Results" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Academic Results History</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">View your overall summary and detailed subject performance.</p>
                </div>
                {activeTab === 'performance' && activeResult && (
                    <a 
                        href={route('user.results.report-card', activeResult.id)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#008060] text-white text-[13px] font-bold rounded-[4px] hover:bg-[#006e52] transition-colors shadow-sm"
                    >
                        <Printer size={15} />
                        Print Full Report Card
                    </a>
                )}
            </div>

            {results?.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Left Sidebar Tabs */}
                    <div className="w-full md:w-[240px] shrink-0 bg-white rounded-[6px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden sticky top-[90px]">
                        <div className="flex flex-col py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-5 py-3 text-[13px] font-bold transition-all relative
                                            ${isActive ? 'text-[#008060] bg-[#f9fbfb]' : 'text-[#6d7175] hover:bg-slate-50 hover:text-slate-900'}
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#008060]" />
                                        )}
                                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                        {tab.label}
                                        {isActive && <span className="ml-auto text-[#008060]">›</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 w-full overflow-hidden bg-white rounded-[6px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-6">
                        
                        {/* Tab 1: Summary View */}
                        {activeTab === 'summary' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                                        <GraduationCap size={18} className="text-[#008060]" />
                                        All Examinations
                                    </h2>
                                </div>
                                <div className="w-full overflow-x-auto rounded-[4px] border border-[#ebebeb]">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="bg-[#f9fbfb]">
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center w-12">SL</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb]">Examination</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Class & Section</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Total Marks</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">GPA</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Grade</th>
                                                <th className="py-3 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result, idx) => (
                                                <tr key={result.id} className="bg-white hover:bg-[#f9fbfb] transition-colors border-b border-[#ebebeb] last:border-0">
                                                    <td className="py-3 px-4 text-[13px] text-slate-500 text-center">{idx + 1}</td>
                                                    <td className="py-3 px-4 text-[13px] text-slate-800 font-bold">{result.exam?.name}</td>
                                                    <td className="py-3 px-4 text-[13px] text-slate-600 text-center">{result.academic_class?.name} - {result.section?.name}</td>
                                                    <td className="py-3 px-4 text-[13px] text-slate-800 text-center font-bold">{result.total_marks}</td>
                                                    <td className="py-3 px-4 text-[13px] text-[#008060] text-center font-black">{result.gpa}</td>
                                                    <td className={`py-3 px-4 text-[13px] text-center font-black ${result.grade === 'F' ? 'text-red-500' : 'text-slate-800'}`}>
                                                        {result.grade}
                                                    </td>
                                                    <td className="py-3 px-4 text-[13px] text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedExamId(result.id);
                                                                setActiveTab('performance');
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#ebebeb] rounded text-[12px] font-bold text-[#008060] hover:bg-[#f9fbfb] transition-colors shadow-sm"
                                                        >
                                                            <BookOpen size={14} /> View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Detailed Performance */}
                        {activeTab === 'performance' && (
                            <div className="animate-in fade-in duration-300">
                                {/* Exam Selector */}
                                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#f9fbfb] rounded-[6px] border border-[#ebebeb]">
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <div className="w-full md:w-64">
                                            <SelectInput
                                                value={selectedExamId || ''}
                                                onChange={(e) => setSelectedExamId(parseInt(e.target.value))}
                                                placeholder="Select Examination..."
                                                options={results.map(r => ({
                                                    id: r.id,
                                                    name: `${r.exam?.name} (${r.academic_class?.name})`
                                                }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    {activeResult && (
                                        <div className="flex items-center gap-4 text-[12px] font-bold text-slate-600 bg-white px-4 py-2 border border-[#ebebeb] rounded shadow-sm">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#008060]"/> {new Date(activeResult.exam?.start_date).getFullYear() || 'N/A'}</span>
                                            <div className="w-px h-4 bg-slate-200"></div>
                                            <span>GPA: <span className="text-[#008060] font-black">{activeResult.gpa}</span></span>
                                        </div>
                                    )}
                                </div>

                                {activeResult ? (
                                    <div className="w-full overflow-x-auto rounded-[4px] border border-[#ebebeb]">
                                        <table className="w-full text-left border-collapse min-w-[700px] bg-white">
                                            <thead>
                                                <tr className="bg-[#f9fbfb]">
                                                    <th className="py-2 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] w-12 text-center">SL</th>
                                                    <th className="py-2 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb]">Subject Name</th>
                                                    <th className="py-2 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Marks Obtained</th>
                                                    <th className="py-2 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Grade Point</th>
                                                    <th className="py-2 px-4 text-[11px] font-bold text-[#6d7175] uppercase tracking-wider border-b border-[#ebebeb] text-center">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeResult.marks_data && activeResult.marks_data.length > 0 ? (
                                                    activeResult.marks_data.map((mark, mIdx) => (
                                                        <tr key={mIdx} className="hover:bg-[#f9fbfb] transition-colors border-b border-[#ebebeb] last:border-0">
                                                            <td className="py-2 px-4 text-[13px] text-slate-500 text-center">{mIdx + 1}</td>
                                                            <td className="py-2 px-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-slate-800">{mark.subject_name}</span>
                                                                    {/* Subject Teacher placeholder */}
                                                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5"><UserIcon size={10} className="text-slate-300" /> Subject Teacher</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-4 text-[13px] font-bold text-slate-800 text-center">{mark.marks}</td>
                                                            <td className="py-2 px-4 text-[13px] font-black text-[#008060] text-center">{parseFloat(mark.grade_point).toFixed(2)}</td>
                                                            <td className={`py-2 px-4 text-[13px] font-black text-center ${mark.grade === 'F' ? 'text-red-500' : 'text-slate-800'}`}>
                                                                {mark.grade}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="py-12 text-center">
                                                            <FileText className="mx-auto mb-3 text-slate-300" size={32} />
                                                            <p className="text-[13px] font-medium text-slate-500">No detailed marks available for this exam.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center bg-slate-50 rounded border border-[#ebebeb]">
                                        <p className="text-[13px] text-slate-500">Select an examination from the dropdown above to view details.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-16 text-center">
                    <FileText className="mx-auto mb-4 text-slate-300" size={48} />
                    <h2 className="text-[16px] font-bold text-slate-700 mb-2">No Results Available</h2>
                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                        You do not have any published examination results yet. When results are published by the administration, they will appear here.
                    </p>
                </div>
            )}
        </UserLayout>
    );
}
