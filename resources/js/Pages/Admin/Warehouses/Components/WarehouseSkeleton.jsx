import React from 'react';

const WarehouseSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse h-[52px]">
            <td className="pl-4 pr-2 py-1 w-[50px]">
                <div className="w-[17px] h-[17px] bg-[#f1f1f1] rounded-[3px]" />
            </td>
            {visibleColumns.includes('warehouse') && (
                <td className="px-4 py-1 w-[300px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-[#f1f1f1]" />
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-2.5 bg-[#f1f1f1] rounded w-32" />
                            <div className="h-2 bg-[#f9fafb] rounded w-16" />
                        </div>
                    </div>
                </td>
            )}
            {visibleColumns.includes('address') && (
                <td className="px-4 py-1 min-w-[200px]">
                    <div className="flex items-start gap-2">
                        <div className="shrink-0 w-5 h-5 bg-[#f1f1f1] rounded-full" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-2.5 bg-[#f1f1f1] rounded w-[80%]" />
                            <div className="h-2 bg-[#f9fafb] rounded w-[60%]" />
                        </div>
                    </div>
                </td>
            )}
            {visibleColumns.includes('phone') && (
                <td className="px-4 py-1 text-center w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-4 bg-[#f1f1f1] rounded w-24 mx-auto" />
                        <div className="h-2 bg-[#f9fafb] rounded w-12 mx-auto" />
                    </div>
                </td>
            )}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <div className="h-6 bg-[#f1f1f1] rounded-full w-24 mx-auto" />
                </td>
            )}
            {visibleColumns.includes('date') && (
                <td className="px-4 py-1 text-center w-[160px]">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="h-2.5 bg-[#f1f1f1] rounded w-16" />
                        <div className="h-2 bg-[#f9fafb] rounded w-12" />
                    </div>
                </td>
            )}
            <td className="px-6 py-1 text-right w-[130px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[28px] h-[28px] bg-[#f1f1f1] rounded-[4px]" />
                    <div className="w-[28px] h-[28px] bg-[#f1f1f1] rounded-[4px]" />
                </div>
            </td>
        </tr>
    );
};

export default WarehouseSkeleton;
