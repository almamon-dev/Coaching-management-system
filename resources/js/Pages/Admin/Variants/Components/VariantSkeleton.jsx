import React from 'react';

const VariantSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse bg-white border-b border-[#ebebeb]">
            <td className="w-10 px-5 py-3">
                <div className="w-[18px] h-[18px] bg-[#f1f1f1] rounded-[3px]"></div>
            </td>
            
            {visibleColumns.includes('variant') && (
                <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f1f1f1]"></div>
                        <div className="h-4 bg-[#f1f1f1] rounded w-32"></div>
                    </div>
                </td>
            )}
            
            {visibleColumns.includes('type') && (
                <td className="px-3 py-3">
                    <div className="h-5 bg-[#f1f1f1] rounded-full w-16"></div>
                </td>
            )}
            
            {visibleColumns.includes('options') && (
                <td className="px-3 py-3">
                    <div className="h-5 bg-[#f1f1f1] rounded-full w-20"></div>
                </td>
            )}
            
            {visibleColumns.includes('status') && (
                <td className="px-3 py-3">
                    <div className="h-[26px] bg-[#f1f1f1] rounded-[4px] w-[85px]"></div>
                </td>
            )}
            
            <td className="px-5 py-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="h-[28px] bg-[#f1f1f1] rounded-[4px] w-[100px]"></div>
                    <div className="h-[28px] bg-[#f1f1f1] rounded-[4px] w-[28px]"></div>
                    <div className="h-[28px] bg-[#f1f1f1] rounded-[4px] w-[28px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default VariantSkeleton;
