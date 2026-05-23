import React from 'react';

const AttributePresetSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse bg-white h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#f1f2f3] rounded-[3px]"></div>
                </div>
            </td>
            
            {visibleColumns.includes('name') && (
                <td className="px-4 py-1 w-[300px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#f1f2f3] rounded-[4px] border border-[#ebebeb] flex-shrink-0"></div>
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="h-3 w-32 bg-[#f1f2f3] rounded-sm"></div>
                            <div className="h-2 w-20 bg-[#f1f2f3] rounded-sm"></div>
                        </div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1 w-[200px]">
                    <div className="h-5 w-24 bg-[#f1f2f3] rounded-[2px] border border-[#ebebeb]"></div>
                </td>
            )}

            {visibleColumns.includes('fields') && (
                <td className="px-4 py-1 text-center w-[120px]">
                    <div className="h-5 w-8 bg-[#f1f2f3] rounded-[2px] mx-auto border border-[#ebebeb]"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 w-[160px]">
                    <div className="h-3 w-28 bg-[#f1f2f3] rounded-sm"></div>
                </td>
            )}

            <td className="px-6 py-1 text-right w-[120px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[30px] h-[30px] bg-[#f1f2f3] rounded-[2px] border border-[#ebebeb]"></div>
                    <div className="w-[30px] h-[30px] bg-[#f1f2f3] rounded-[2px] border border-[#ebebeb]"></div>
                </div>
            </td>
        </tr>
    );
};

export default AttributePresetSkeleton;
