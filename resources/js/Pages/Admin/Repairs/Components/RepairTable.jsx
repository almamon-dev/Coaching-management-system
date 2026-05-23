import { Check, Search } from 'lucide-react';
import RepairRow from './RepairRow';
import RepairSkeleton from './RepairSkeleton';

const RepairTable = ({
    repairs,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    technicians,
    handleQuickAssign,
    handleQuickStatus,
    isProcessing,
    activeTab,
    stats,
    visibleColumns = [],
    handleDelete
}) => {
    const isAllOnPageSelected = repairs.data?.length > 0 && repairs.data.every(r => selectedIds.includes(r.id));
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={`w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center ${selectAllAcrossPages || isAllOnPageSelected
                                    ? "bg-[#008060] border-[#008060]"
                                    : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                    }`}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('ticket') && <th className="px-4 py-2.5 w-[140px]">Ticket #</th>}
                        {visibleColumns.includes('customer') && <th className="px-4 py-2.5 w-[200px]">Customer</th>}
                        {visibleColumns.includes('gadget') && <th className="px-4 py-2.5 w-[280px]">Gadget Details</th>}
                        {visibleColumns.includes('date') && <th className="px-4 py-2.5 text-center w-[120px]">Date Added</th>}
                        {visibleColumns.includes('technician') && <th className="px-4 py-2.5 w-[160px]">Technician Assignee</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[140px]">Status</th>}
                        {visibleColumns.includes('cost') && <th className="px-4 py-2.5 text-right w-[120px]">Bill Cost</th>}
                        <th className="px-6 py-2.5 text-center w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: repairs.data?.length > 0 ? repairs.data.length : 5 }).map((_, i) => (
                            <RepairSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : repairs.data?.length > 0 ? (
                        repairs.data.map((repair) => (
                            <RepairRow
                                key={repair.id}
                                repair={repair}
                                isSelected={selectAllAcrossPages || selectedIds.includes(repair.id)}
                                toggleSelect={toggleSelect}
                                technicians={technicians}
                                handleQuickAssign={handleQuickAssign}
                                handleQuickStatus={handleQuickStatus}
                                visibleColumns={visibleColumns}
                                handleDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[15px] font-bold text-slate-700">No repair tickets found</p>
                                <p className="text-[13px] text-slate-400 mt-1">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RepairTable;
