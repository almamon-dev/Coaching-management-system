import React from 'react';

const QuestionSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse border-b border-[#ebebeb] last:border-0 bg-white h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="flex items-center justify-center">
                    <div className="w-[18px] h-[18px] bg-slate-100 border border-slate-200 rounded-[3px]"></div>
                </div>
            </td>
            
            {visibleColumns.includes('product') && (
                <td className="px-4 py-1 w-[350px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 rounded-[4px] flex-shrink-0"></div>
                        <div className="flex flex-col gap-1.5 leading-tight">
                            <div className="h-2.5 w-32 bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                        </div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('question') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col gap-1.5 leading-tight">
                        <div className="h-2.5 w-48 bg-slate-100 rounded-full"></div>
                        <div className="h-2 w-32 bg-slate-50 rounded-full italic"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1 w-[200px]">
                    <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[130px]">
                    <div className="h-[22px] w-[80px] bg-slate-50 border border-slate-100 rounded-full mx-auto"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <div className="h-2.5 w-24 bg-slate-50 rounded-full mx-auto"></div>
                </td>
            )}

            <td className="px-4 py-1 text-right w-[120px]">
                <div className="flex items-center justify-end gap-1">
                    <div className="w-[30px] h-[30px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                    <div className="w-[30px] h-[30px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default QuestionSkeleton;
