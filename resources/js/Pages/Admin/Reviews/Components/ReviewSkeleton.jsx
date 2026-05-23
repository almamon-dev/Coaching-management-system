import React from 'react';

const ReviewSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse bg-white border-b border-[#ebebeb] last:border-0 h-[48px]">
            {/* Checkbox */}
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="flex items-center justify-center">
                    <div className="w-[18px] h-[18px] bg-slate-100 border border-slate-200 rounded-[3px]"></div>
                </div>
            </td>

            {/* Product */}
            {visibleColumns.includes('product') && (
                <td className="px-4 py-1 w-[250px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 rounded-[4px] flex-shrink-0"></div>
                        <div className="h-2.5 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                </td>
            )}

            {/* Rating */}
            {visibleColumns.includes('rating') && (
                <td className="px-4 py-1 text-center w-[120px]">
                    <div className="flex items-center justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2.5 h-2.5 bg-slate-100 rounded-full"></div>
                        ))}
                    </div>
                </td>
            )}

            {/* Customer */}
            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1 w-[200px]">
                    <div className="flex flex-col gap-1.5 leading-tight">
                        <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                        <div className="h-2 w-32 bg-slate-50 rounded-full"></div>
                    </div>
                </td>
            )}

            {/* Comment */}
            {visibleColumns.includes('comment') && (
                <td className="px-4 py-1">
                    <div className="h-2.5 w-full bg-slate-50 rounded-full"></div>
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center w-[120px]">
                    <div className="h-[22px] w-24 bg-slate-50 rounded-full mx-auto border border-slate-100"></div>
                </td>
            )}

            {/* Date */}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center w-[140px]">
                    <div className="h-2.5 w-20 bg-slate-50 rounded-full mx-auto"></div>
                </td>
            )}

            {/* Actions */}
            <td className="px-4 py-1 text-right w-[120px]">
                <div className="w-[30px] h-[30px] bg-slate-50 border border-slate-100 rounded-[2px] ml-auto"></div>
            </td>
        </tr>
    );
};

export default ReviewSkeleton;
