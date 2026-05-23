import React from 'react';

const UserSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse border-b border-[#ebebeb] last:border-0 h-[48px]">
            <td className="py-2 px-4 w-[48px] text-center">
                <div className="w-[17px] h-[17px] bg-slate-100 border-[1.5px] border-[#d1d1d1] rounded-[3px] mx-auto"></div>
            </td>
            
            {visibleColumns.includes('name') && (
                <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0"></div>
                        <div className="flex flex-col min-w-0">
                            <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('email') && (
                <td className="py-2 px-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-slate-100"></div>
                        <div className="h-2.5 w-40 bg-slate-50 rounded-full"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('roles') && (
                <td className="py-2 px-4">
                    <div className="flex gap-1">
                        <div className="h-[18px] w-20 bg-slate-100 border border-[#ebebeb] rounded-[4px]"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="py-2 px-4">
                    <div className="h-[18px] w-16 bg-slate-50 border border-[#ebebeb] rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="py-2 px-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-slate-100"></div>
                        <div className="h-2.5 w-24 bg-slate-50 rounded-full"></div>
                    </div>
                </td>
            )}

            <td className="py-2 px-4 text-right w-[120px]">
                <div className="flex items-center justify-end gap-1.5">
                    <div className="w-[28px] h-[28px] bg-slate-100 border border-[#ebebeb] rounded-[4px]"></div>
                    <div className="w-[28px] h-[28px] bg-slate-100 border border-[#ebebeb] rounded-[4px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default UserSkeleton;
