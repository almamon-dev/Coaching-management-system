import React from 'react';

const CategorySkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse border-b border-[#f1f1f1] last:border-0 h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-slate-100 border-[1.5px] border-[#d1d1d1] rounded-[3px]"></div>
            </td>
            
            {visibleColumns.includes('category') && (
                <td className="px-4 py-1 w-[350px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#f7f7f7] border border-[#ebebeb] rounded-[4px] flex-shrink-0"></div>
                        <div className="flex flex-col min-w-0">
                            <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-20 bg-slate-50 rounded-full mt-0.5"></div>
                        </div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('parent') && (
                <td className="px-4 py-1 w-[180px]">
                    <div className="flex items-center gap-1.5 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1 text-center w-[120px]">
                    <div className="h-4 w-20 bg-slate-50 rounded-[2px] mx-auto border border-[#ebebeb] animate-pulse"></div>
                </td>
            )}

            {visibleColumns.includes('attributes') && (
                <td className="px-4 py-1 text-center w-[100px]">
                    <div className="h-5 w-8 bg-slate-100 rounded-[2px] mx-auto border border-[#ebebeb] animate-pulse"></div>
                </td>
            )}

            {visibleColumns.includes('products') && (
                <td className="px-4 py-1 text-center w-[100px]">
                    <div className="h-5 w-8 bg-slate-100 rounded-[2px] mx-auto border border-[#ebebeb] animate-pulse"></div>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[130px]">
                    <div className="h-[22px] w-[80px] bg-slate-50 border border-[#ebebeb] rounded-full mx-auto animate-pulse"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center w-[150px]">
                    <div className="h-2.5 w-20 bg-slate-50 rounded-full mx-auto animate-pulse"></div>
                </td>
            )}

            <td className="px-6 py-1 text-right w-[160px]">
                <div className="flex items-center justify-end gap-1 animate-pulse">
                    <div className="w-[26px] h-[26px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                    <div className="w-[26px] h-[26px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                    <div className="w-[26px] h-[26px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default CategorySkeleton;
