import React from 'react';
import { Check, Search } from 'lucide-react';
import CounterSkeleton from './CounterSkeleton';
import CounterRow from './CounterRow';

const CounterTable = ({ 
    counters, 
    filters, 
    selectedIds, 
    selectAllAcrossPages, 
    toggleSelectAll, 
    toggleSelect, 
    handleDelete, 
    isProcessing, 
    activeTab, 
    stats, 
    visibleColumns = [] 
}) => {
    const isAllOnPageSelected = counters.data?.length > 0 && counters.data.every(c => selectedIds.includes(c.id));
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">
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
                        {visibleColumns.includes('name') && <th className="px-4 py-2.5 w-[200px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Desk Name</th>}
                        {visibleColumns.includes('description') && <th className="px-4 py-2.5 w-[320px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Description</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Status</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 text-center w-[140px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Date Added</th>}
                        <th className="px-6 py-2.5 text-right w-[110px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: counters.data?.length > 0 ? counters.data.length : 5 }).map((_, i) => (
                            <CounterSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : counters.data?.length > 0 ? (
                        counters.data.map((counter) => (
                            <CounterRow
                                key={counter.id}
                                counter={counter}
                                isSelected={selectAllAcrossPages || selectedIds.includes(counter.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[15px] font-bold text-slate-700">No counter desks found</p>
                                <p className="text-[13px] text-slate-400 mt-1 font-medium">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CounterTable;
