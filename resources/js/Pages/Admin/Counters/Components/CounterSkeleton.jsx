import React from 'react';

const CounterSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse border-b border-[#f1f1f1] last:border-0 h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-slate-100 border-[1.5px] border-[#d1d1d1] rounded-[3px]"></div>
            </td>
            
            {visibleColumns.includes('name') && (
                <td className="px-4 py-1 w-[200px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 bg-slate-100 rounded flex-shrink-0"></div>
                        <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('description') && (
                <td className="px-4 py-1 w-[320px]">
                    <div className="h-3 w-56 bg-slate-50 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[130px]">
                    <div className="h-[22px] w-[80px] bg-slate-50 border border-[#ebebeb] rounded-full mx-auto animate-pulse"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <div className="h-3 w-20 bg-slate-50 rounded-full mx-auto animate-pulse"></div>
                </td>
            )}

            <td className="px-6 py-1 text-right w-[110px]">
                <div className="flex items-center justify-end gap-1 animate-pulse">
                    <div className="w-[26px] h-[26px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                    <div className="w-[26px] h-[26px] bg-slate-100 border border-[#ebebeb] rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default CounterSkeleton;
