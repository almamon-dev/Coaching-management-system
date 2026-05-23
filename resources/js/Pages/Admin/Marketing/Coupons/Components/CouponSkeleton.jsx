import React from 'react';

const CouponSkeleton = () => {
    return (
        <tr className="animate-pulse border-b border-slate-100 last:border-0">
            <td className="pl-6 pr-2 py-3 w-[60px]">
                <div className="w-4 h-4 bg-slate-100 rounded-[1px]"></div>
            </td>
            <td className="pl-2 pr-6 py-3 w-[280px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-[1px] flex-shrink-0 flex items-center justify-center text-slate-300 font-bold text-lg italic">

                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="h-2.5 w-32 bg-slate-100 rounded-full"></div>
                        <div className="h-2 w-16 bg-slate-50 rounded-full"></div>
                    </div>
                </div>
            </td>
            <td className="px-5 py-3 w-[140px]">
                <div className="h-5 w-20 bg-slate-100 rounded-[1px] mx-auto"></div>
            </td>
            <td className="px-5 py-3 w-[130px]">
                <div className="h-5 w-16 bg-slate-50 rounded-[1px] mx-auto"></div>
            </td>
            <td className="px-5 py-3 text-center w-[130px]">
                <div className="h-3 w-16 bg-slate-50 rounded-full mx-auto"></div>
            </td>
            <td className="px-5 py-3 text-center w-[140px]">
                <div className="flex flex-col items-center gap-1.5">
                    <div className="h-2.5 w-12 bg-slate-100 rounded-full"></div>
                    <div className="h-1 w-12 bg-slate-50 rounded-full"></div>
                </div>
            </td>
            <td className="px-5 py-3 text-center w-[130px]">
                <div className="h-6 w-24 bg-slate-50 border border-slate-100 rounded-[2px] mx-auto"></div>
            </td>
            <td className="px-5 py-3 text-center w-[150px]">
                <div className="h-3 w-20 bg-slate-50 rounded-full mx-auto"></div>
            </td>
            <td className="px-6 py-2 text-right w-[160px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[30px] h-[30px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                    <div className="w-[30px] h-[30px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default CouponSkeleton;
