import React from 'react';
import { AlertTriangle, BookOpen, Clock, Activity, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const EnrollmentTable = ({ enrollments, selectedIds = [], toggleSelectAll, toggleSelect, visibleColumns = ['session', 'student_id', 'name', 'class', 'status'] }) => {
    const availableBulkIds = enrollments.data ? enrollments.data.map(e => e.id) : [];
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;
    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-[#ebebeb] bg-slate-50/50">
                        <th className="py-2 px-3 w-[40px] text-center">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[16px] h-[16px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center select-none",
                                    isAllSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1]"
                                )}
                            >
                                {isAllSelected && (
                                    <Check size={12} strokeWidth={3} className="text-white" />
                                )}
                            </div>
                        </th>
                        {visibleColumns.includes('session') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 whitespace-nowrap">Session</th>}
                        {visibleColumns.includes('student_id') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 whitespace-nowrap">Student ID</th>}
                        {visibleColumns.includes('name') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 whitespace-nowrap">Student Detail</th>}
                        {visibleColumns.includes('class') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 whitespace-nowrap">Class & Section</th>}
                        {visibleColumns.includes('status') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 whitespace-nowrap">Status</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {enrollments.data && enrollments.data.length > 0 ? (
                        enrollments.data.map((enrollment) => {
                            const isSelected = selectedIds.includes(enrollment.id);
                            
                            return (
                                <tr 
                                    key={enrollment.id} 
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    <td className="py-1 px-3 text-center select-none">
                                        <div
                                            onClick={() => toggleSelect(enrollment.id)}
                                            className={cn(
                                                "w-[16px] h-[16px] border-[1.5px] rounded-[3px] mx-auto transition-all flex items-center justify-center select-none cursor-pointer",
                                                isSelected
                                                    ? "bg-[#008060] border-[#008060]"
                                                    : "bg-white border-[#d1d1d1] hover:border-slate-400"
                                            )}
                                        >
                                            {isSelected && (
                                                <Check size={12} strokeWidth={3} className="text-white" />
                                            )}
                                        </div>
                                    </td>
                                    
                                    {visibleColumns.includes('session') && (
                                        <td className="py-1 px-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-700">
                                                <Clock size={13} className="text-[#008060] shrink-0" />
                                                <span>{enrollment.academic_session?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('student_id') && (
                                        <td className="py-1 px-3 whitespace-nowrap">
                                            <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {enrollment.student_profile?.student_id || 'N/A'}
                                            </span>
                                        </td>
                                    )}

                                    {visibleColumns.includes('name') && (
                                        <td className="py-1 px-3 min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-[28px] h-[28px] bg-[#e4f1ef] text-[#008060] font-bold text-[12px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                    {enrollment.student_profile?.user?.name?.substring(0, 2).toUpperCase() || 'ST'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight whitespace-nowrap">
                                                        {enrollment.student_profile?.user?.name || 'Unknown'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium text-slate-500 whitespace-nowrap">
                                                        <span>Roll: {enrollment.roll_number || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('class') && (
                                        <td className="py-1 px-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-[12.5px]">
                                                <BookOpen size={13} className="text-[#008060] shrink-0" />
                                                <span className="font-bold text-slate-700">{enrollment.academic_class?.name || 'N/A'}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-600">{enrollment.section?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('status') && (
                                        <td className="py-1 px-3 whitespace-nowrap">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[11px] font-bold border",
                                                enrollment.status === 'active' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                                enrollment.status === 'promoted' && "bg-blue-50 text-blue-700 border-blue-200",
                                                enrollment.status === 'graduated' && "bg-purple-50 text-purple-700 border-purple-200",
                                                enrollment.status === 'transferred' && "bg-orange-50 text-orange-700 border-orange-200",
                                                enrollment.status === 'failed' && "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'Unknown'}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                        );
                    })
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-12 text-center text-slate-400 bg-white">
                                <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                <h5 className="text-[13.5px] font-bold text-slate-700">No enrollments found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Try adjusting your filters or search.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EnrollmentTable;
