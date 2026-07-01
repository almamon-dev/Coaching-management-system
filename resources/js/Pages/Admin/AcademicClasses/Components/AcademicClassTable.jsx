import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle, SquarePen, Trash2, Hash, Layers, Check } from 'lucide-react';
import AcademicClassSkeleton from './AcademicClassSkeleton';

const AcademicClassTable = ({
    classes,
    filters,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    handleDelete,
    isProcessing,
    visibleColumns,
    stats
}) => {
    const availableBulkIds = classes.data.map(u => u.id);
    const isAllSelected = selectedIds.length === availableBulkIds.length && availableBulkIds.length > 0;
    const shouldShowSkeletons = isProcessing;

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
                                    <Check size={12} strokeWidth={3} className="text-white" />
                                )}
                            </div>
                        </th>
                        {visibleColumns.includes('name') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Class Name</th>}
                        {visibleColumns.includes('numeric_value') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Numeric Value</th>}
                        {visibleColumns.includes('sections') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Total Sections</th>}
                        {visibleColumns.includes('created_at') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Created At</th>}
                        {visibleColumns.includes('updated_at') && <th className="py-3 px-4 text-[12px] font-bold text-slate-700">Updated At</th>}
                        <th className="py-3 px-4 text-[12px] font-bold text-slate-700 text-right w-[120px] select-none">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <AcademicClassSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : classes.data && classes.data.length > 0 ? (
                        classes.data.map((academic_class) => {
                            const isSelected = selectedIds.includes(academic_class.id);

                            return (
                                <tr
                                    key={academic_class.id}
                                    className={cn(
                                        "border-b border-[#ebebeb] hover:bg-slate-50/40 transition-colors",
                                        isSelected && "bg-[#f0f9f7]/20"
                                    )}
                                >
                                    <td className="py-2 px-4 text-center select-none">
                                        <div
                                            onClick={() => toggleSelect(academic_class.id)}
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] mx-auto transition-all flex items-center justify-center select-none cursor-pointer",
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
                                        <td className="py-2 px-4">
                                            <span className="text-[13px] font-bold text-slate-800">
                                                {academic_class.name}
                                            </span>
                                        </td>
                                    )}

                                    {visibleColumns.includes('numeric_value') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                                                <Hash size={13} className="text-slate-400" />
                                                <span className="font-medium text-slate-700 bg-slate-100 px-2 rounded">{academic_class.numeric_value}</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('sections') && (
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600">
                                                <Layers size={13} className="text-slate-400" />
                                                <span className="font-medium text-[#008060] bg-[#e4f1ef] px-2 rounded-full border border-[#a3dfd2]/30">{academic_class.sections_count || 0} Sections</span>
                                            </div>
                                        </td>
                                    )}

                                    {visibleColumns.includes('created_at') && (
                                        <td className="py-2 px-4 text-[13px] text-slate-600">
                                            {academic_class.created_at ? new Date(academic_class.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                    )}

                                    {visibleColumns.includes('updated_at') && (
                                        <td className="py-2 px-4 text-[13px] text-slate-600">
                                            {academic_class.updated_at ? new Date(academic_class.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                    )}

                                    <td className="py-2 px-4 text-right select-none">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route('admin.classes.edit', academic_class.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all cursor-pointer"
                                                title="Edit Class"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(academic_class)}
                                                className="h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all border-none bg-[#ff4d4f] text-white hover:bg-[#cf1322] cursor-pointer"
                                                title="Delete Class"
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
                                <h5 className="text-[13.5px] font-bold text-slate-700">No classes found</h5>
                                <p className="text-[12px] text-[#6d7175] mt-0.5">Start by adding a new academic class.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AcademicClassTable;
