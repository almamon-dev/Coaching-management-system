import React from 'react';
import { Check, Search } from 'lucide-react';
import PageRow from './PageRow';

const PageSkeleton = ({ visibleColumns }) => (
    <tr className="animate-pulse h-[48px]">
        <td className="pl-4 pr-2 py-1 w-[45px]">
            <div className="w-[17px] h-[17px] bg-slate-100 rounded-[3px] border border-slate-200" />
        </td>
        {visibleColumns.includes('title') && (
            <td className="px-4 py-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[4px] bg-slate-100 border border-slate-200" />
                    <div className="flex flex-col gap-1.5 w-full">
                        <div className="h-3.5 bg-slate-100 rounded w-[120px]" />
                        <div className="h-2.5 bg-slate-100 rounded w-[60px]" />
                    </div>
                </div>
            </td>
        )}
        {visibleColumns.includes('slug') && (
            <td className="px-4 py-1 text-center">
                <div className="h-4 bg-slate-100 rounded w-[80px] mx-auto" />
            </td>
        )}
        {visibleColumns.includes('meta') && (
            <td className="px-4 py-1">
                <div className="flex flex-col gap-1.5">
                    <div className="h-3 bg-slate-100 rounded w-[150px]" />
                    <div className="h-2.5 bg-slate-100 rounded w-[110px]" />
                </div>
            </td>
        )}
        {visibleColumns.includes('status') && (
            <td className="px-4 py-1 text-center">
                <div className="h-6 bg-slate-100 rounded-full w-[80px] mx-auto" />
            </td>
        )}
        {visibleColumns.includes('updated_at') && (
            <td className="px-4 py-1 text-center">
                <div className="h-3.5 bg-slate-100 rounded w-[70px] mx-auto" />
            </td>
        )}
        <td className="px-6 py-1 text-right">
            <div className="flex items-center justify-end gap-1.5">
                <div className="w-[26px] h-[26px] bg-slate-100 rounded-[2px]" />
                <div className="w-[26px] h-[26px] bg-slate-100 rounded-[2px]" />
            </div>
        </td>
    </tr>
);

const PageTable = ({
    pages,
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
    const isAllOnPageSelected = pages.data.length > 0 && pages.data.every(page => selectedIds.includes(page.id));
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
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
                        {visibleColumns.includes('title') && <th className="px-4 py-2.5 w-[280px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Page Info</th>}
                        {visibleColumns.includes('slug') && <th className="px-4 py-2.5 text-center w-[180px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Slug/Route</th>}
                        {visibleColumns.includes('meta') && <th className="px-4 py-2.5 w-[320px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Search Engine Metadata</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Status</th>}
                        {visibleColumns.includes('updated_at') && <th className="px-4 py-2.5 text-center w-[130px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Last Updated</th>}
                        <th className="px-6 py-2.5 text-right w-[150px] text-[#6d7175] bg-[#f4f6f8] first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {shouldShowSkeletons ? (
                        Array.from({ length: pages.data?.length > 0 ? pages.data.length : 5 }).map((_, i) => (
                            <PageSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : pages.data?.length > 0 ? (
                        pages.data.map((page) => (
                            <PageRow
                                key={page.id}
                                page={page}
                                selected={selectAllAcrossPages || selectedIds.includes(page.id)}
                                onSelect={toggleSelect}
                                onDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[16px] font-bold text-[#202223]">No pages found</p>
                                <p className="text-[13px] text-[#6d7175] mt-1">Try refining your search or status filter.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PageTable;
