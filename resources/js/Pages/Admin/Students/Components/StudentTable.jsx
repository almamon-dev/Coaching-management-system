import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle, SquarePen, Trash2, Mail, BookOpen, Check, Eye } from 'lucide-react';

const StudentTable = ({ 
    students, 
    handleDelete, 
    isProcessing,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    visibleColumns 
}) => {
    const availableBulkIds = students.data ? students.data.map(u => u.id) : [];
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                    <tr className="bg-[#f4f6f8]">
                        <th className="py-2 px-3 w-[48px] text-center select-none text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
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
                        {visibleColumns.includes('student_id') && <th className="py-2 px-3 text-[12px] font-bold w-[60px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student ID</th>}
                        {visibleColumns.includes('name') && <th className="py-2 px-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Student Detail</th>}
                        {visibleColumns.includes('class') && <th className="py-2 px-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Class & Section</th>}
                        {visibleColumns.includes('roll_number') && <th className="py-2 px-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Roll No.</th>}
                        <th className="py-2 px-3 text-[12px] font-bold text-right w-[120px] select-none text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {students.data && students.data.length > 0 ? (
                        students.data.map((student) => {
                            const isSelected = selectedIds.includes(student.id);

                            return (
                                <tr 
                                    key={student.id} 
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    <td className="py-1 px-3 text-center select-none">
                                        <div
                                            onClick={() => toggleSelect(student.id)}
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

                                    {visibleColumns.includes('student_id') && (
                                        <td className="py-1 px-3">
                                            <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {student.student_id}
                                            </span>
                                        </td>
                                    )}

                                    {visibleColumns.includes('name') && (
                                        <td className="py-1 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-[28px] h-[28px] bg-[#e4f1ef] text-[#008060] font-bold text-[12px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                    {student.user?.name?.substring(0, 2).toUpperCase() || 'ST'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                                                        {student.user?.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium text-slate-500">
                                                        <Mail size={10} />
                                                        <span>{student.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('class') && (
                                        <td className="py-1 px-3">
                                            <div className="flex items-center gap-1.5 text-[12.5px]">
                                                <BookOpen size={13} className="text-[#008060]" />
                                                <span className="font-bold text-slate-700">{student.latest_enrollment?.academic_class?.name || 'N/A'}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-600">{student.latest_enrollment?.section?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('roll_number') && (
                                        <td className="py-1 px-3">
                                            <span className="text-[13px] font-bold text-slate-700">
                                                {student.latest_enrollment?.roll_number || 'N/A'}
                                            </span>
                                        </td>
                                    )}

                                    <td className="py-1 px-3 text-right select-none">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route('admin.students.show', student.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#008060] text-white rounded-[2px] hover:bg-[#006e52] transition-all cursor-pointer"
                                                title="View Student Details"
                                            >
                                                <Eye size={12} />
                                            </Link>
                                            <Link
                                                href={route('admin.students.edit', student.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer"
                                                title="Edit Student"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(student)}
                                                className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer"
                                                title="Delete Student"
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
                                <h5 className="text-[13.5px] font-bold text-slate-700">No students found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Start by admitting a new student.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
