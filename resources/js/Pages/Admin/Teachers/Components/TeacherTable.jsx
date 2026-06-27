import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle, SquarePen, Trash2, Mail, Briefcase } from 'lucide-react';

const TeacherTable = ({ 
    teachers, 
    handleDelete, 
    isProcessing,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    visibleColumns 
}) => {
    const availableBulkIds = teachers.data ? teachers.data.map(u => u.id) : [];
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-[#ebebeb] bg-slate-50/50">
                        <th className="py-3 px-4 w-[48px] text-center select-none">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto cursor-pointer transition-all flex items-center justify-center select-none",
                                    isAllSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1]"
                                )}
                            >
                                {isAllSelected && (
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                            </div>
                        </th>
                        {visibleColumns.includes('employee_id') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700 w-[80px]">Emp ID</th>}
                        {visibleColumns.includes('name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Teacher Detail</th>}
                        {visibleColumns.includes('designation') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Designation</th>}
                        {visibleColumns.includes('department') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Department</th>}
                        <th className="py-3 px-4 text-[12px] font-bold text-slate-700 text-right w-[120px] select-none">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {isProcessing ? (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="p-8 text-center">
                                <div className="w-6 h-6 border-2 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </td>
                        </tr>
                    ) : teachers.data && teachers.data.length > 0 ? (
                        teachers.data.map((profile) => {
                            const isSelected = selectedIds.includes(profile.id);

                            return (
                                <tr 
                                    key={profile.id} 
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    <td className="py-2 px-4 text-center select-none">
                                        <div
                                            onClick={() => toggleSelect(profile.id)}
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto transition-all flex items-center justify-center select-none cursor-pointer",
                                                isSelected
                                                    ? "bg-[#008060] border-[#008060]"
                                                    : "bg-white border-[#d1d1d1] hover:border-slate-400"
                                            )}
                                        >
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-white rounded-sm" />
                                            )}
                                        </div>
                                    </td>

                                    {visibleColumns.includes('employee_id') && (
                                        <td className="py-2 px-4">
                                            <span className="text-[12.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                                {profile.employee_id}
                                            </span>
                                        </td>
                                    )}

                                    {visibleColumns.includes('name') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[32px] h-[32px] bg-[#e4f1ef] text-[#008060] font-bold text-[13px] rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                    {profile.user?.name?.substring(0, 2).toUpperCase() || 'TR'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                                                        {profile.user?.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium text-slate-500">
                                                        <Mail size={10} />
                                                        <span>{profile.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('designation') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-1.5 text-[12.5px]">
                                                <Briefcase size={13} className="text-[#008060]" />
                                                <span className="font-bold text-slate-700">{profile.designation}</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('department') && (
                                        <td className="py-2 px-4">
                                            <span className="text-[13px] font-bold text-slate-700">
                                                {profile.department || '-'}
                                            </span>
                                        </td>
                                    )}

                                    <td className="py-2 px-4 text-right select-none">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route('admin.teachers.edit', profile.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer"
                                                title="Edit Teacher"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(profile)}
                                                className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer"
                                                title="Delete Teacher"
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
                                <h5 className="text-[13.5px] font-bold text-slate-700">No teachers found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Start by registering a new teacher.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherTable;
