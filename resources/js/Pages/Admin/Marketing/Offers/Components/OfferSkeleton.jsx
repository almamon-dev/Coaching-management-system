import React from 'react';

const OfferSkeleton = () => {
    return (
        <tr className="animate-pulse border-b border-slate-100 last:border-0">
            <td className="pl-4 pr-2 py-3 w-[45px]">
                <div className="w-4 h-4 bg-slate-100 rounded-[3px]"></div>
            </td>
            <td className="px-4 py-3 w-[80px]">
                <div className="w-16 h-10 bg-slate-50 border border-slate-100 rounded-[4px]"></div>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-48 bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-24 bg-slate-50 rounded-full"></div>
                </div>
            </td>
            <td className="px-4 py-3 w-[150px]">
                <div className="h-5 w-20 bg-slate-50 rounded-[3px]"></div>
            </td>
            <td className="px-4 py-3 w-[240px]">
                <div className="h-3 w-36 bg-slate-50 rounded-full"></div>
            </td>
            <td className="px-4 py-3 text-center w-[130px]">
                <div className="h-6 w-20 bg-slate-50 border border-slate-100 rounded-[3px] mx-auto"></div>
            </td>
            <td className="px-6 py-2 text-right w-[160px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[26px] h-[26px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                    <div className="w-[26px] h-[26px] bg-slate-50 border border-slate-100 rounded-[2px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default OfferSkeleton;
