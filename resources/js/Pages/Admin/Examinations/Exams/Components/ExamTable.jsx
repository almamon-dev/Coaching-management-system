import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle, SquarePen, Trash2, Calendar, BookOpen, Check } from 'lucide-react';

const ExamTable = ({ 
    exams, 
    handleDelete, 
    isProcessing,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    visibleColumns 
}) => {
    const availableBulkIds = exams.data ? exams.data.map(u => u.id) : [];
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-[#ebebeb] bg-slate-50/50">
                        <th className="py-2 px-3 w-[48px] text-center select-none">
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
                        {visibleColumns.includes('name') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700">Exam Name</th>}
                        {visibleColumns.includes('academic_session') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700">Academic Session</th>}
                        {visibleColumns.includes('start_date') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700">Start Date</th>}
                        {visibleColumns.includes('end_date') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700">End Date</th>}
                        {visibleColumns.includes('status') && <th className="py-2 px-3 text-[12px] font-bold text-slate-700 w-[120px]">Status</th>}
                        <th className="py-2 px-3 text-[12px] font-bold text-slate-700 text-right w-[120px] select-none">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {exams.data && exams.data.length > 0 ? (
                        exams.data.map((exam) => {
                            const isSelected = selectedIds.includes(exam.id);

                            return (
                                <tr 
                                    key={exam.id} 
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    <td className="py-1 px-3 text-center select-none">
                                        <div
                                            onClick={() => toggleSelect(exam.id)}
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

                                    {visibleColumns.includes('name') && (
                                        <td className="py-1 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-[28px] h-[28px] bg-[#e4f1ef] text-[#008060] font-bold text-[12px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                    <BookOpen size={14} />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                                                    {exam.name}
                                                </span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('academic_session') && (
                                        <td className="py-1 px-3">
                                            <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {exam.academic_session?.name || 'N/A'}
                                            </span>
                                        </td>
                                    )}

                                    {visibleColumns.includes('start_date') && (
                                        <td className="py-1 px-3">
                                            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600">
                                                <Calendar size={13} className="text-[#008060]" />
                                                {new Date(exam.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('end_date') && (
                                        <td className="py-1 px-3">
                                            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600">
                                                <Calendar size={13} className="text-[#008060]" />
                                                {new Date(exam.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                    )}
                                    
                                    {visibleColumns.includes('status') && (
                                        <td className="py-1 px-3">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider",
                                                exam.status === 'upcoming' ? 'bg-amber-100 text-amber-800' :
                                                exam.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                exam.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-purple-100 text-purple-800'
                                            )}>
                                                {exam.status}
                                            </span>
                                        </td>
                                    )}

                                    <td className="py-1 px-3 text-right select-none">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route('admin.exams.edit', exam.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer"
                                                title="Edit Exam"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(exam)}
                                                className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer"
                                                title="Delete Exam"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-slate-400 bg-white">
                                <AlertTriangle className="mx-auto mb-2.5 text-slate-300" size={32} />
                                <h5 className="text-[13.5px] font-bold text-slate-700">No exams found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Start by creating a new exam.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExamTable;
