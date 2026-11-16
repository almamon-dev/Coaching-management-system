import React from 'react';

export default function TableSkeleton({ columns = [], rowCount = 5, selectable = false }) {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="animate-pulse min-h-[50px]">
                    {selectable && (
                        <td className="px-3.5 py-3 w-[36px] min-w-[36px] max-w-[36px] whitespace-nowrap">
                            <div className="flex items-center justify-center">
                                <div className="h-3.5 w-3.5 bg-slate-200/80 rounded-[2px]" />
                            </div>
                        </td>
                    )}
                    {columns.map((col, colIndex) => (
                        <td key={colIndex} className={`px-3.5 py-3 ${col.className || ''}`}>
                            <div className="flex items-center min-h-[26px]">
                                <div
                                    className={`h-3.5 bg-slate-200/80 rounded-[3px] ${
                                        colIndex === 0
                                            ? 'w-28'
                                            : colIndex === columns.length - 1
                                            ? 'w-16 ml-auto'
                                            : 'w-20'
                                    }`}
                                />
                            </div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
