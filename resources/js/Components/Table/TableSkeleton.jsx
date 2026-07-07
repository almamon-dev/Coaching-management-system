import React from 'react';

export default function TableSkeleton({ columns = [], rowCount = 5, selectable = false }) {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="animate-pulse border-b border-[#ebebeb] last:border-0 h-[48px]">
                    {selectable && (
                        <td className="py-2 px-4 w-[48px] text-center border-b border-[#ebebeb]">
                            <div className="w-[16px] h-[16px] bg-slate-100 border-[1.5px] border-[#d1d1d1] rounded-[3px] mx-auto"></div>
                        </td>
                    )}
                    {columns.map((col, colIndex) => (
                        <td key={colIndex} className="py-2 px-4 border-b border-[#ebebeb]">
                            {colIndex === 0 ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0"></div>
                                    <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                                </div>
                            ) : colIndex === columns.length - 1 ? (
                                <div className="flex items-center justify-end gap-1.5">
                                    <div className="w-[26px] h-[26px] bg-slate-100 rounded-[2px]"></div>
                                    <div className="w-[26px] h-[26px] bg-slate-100 rounded-[2px]"></div>
                                </div>
                            ) : (
                                <div className={`h-2.5 bg-slate-50 rounded-full ${colIndex % 2 === 0 ? 'w-24' : 'w-16'}`}></div>
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
