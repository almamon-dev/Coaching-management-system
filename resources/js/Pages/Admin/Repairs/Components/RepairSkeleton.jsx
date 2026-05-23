import React from 'react';

const RepairSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse bg-white">
            {/* Checkbox Placeholder */}
            <td className="pl-4 pr-2 py-3.5">
                <div className="w-[18px] h-[18px] bg-slate-100 rounded"></div>
            </td>

            {/* Ticket Column */}
            {visibleColumns.includes('ticket') && (
                <td className="px-4 py-3.5">
                    <div className="h-4 bg-slate-100 rounded w-20 mb-1.5"></div>
                    <div className="h-3.5 bg-slate-50 rounded w-12"></div>
                </td>
            )}

            {/* Customer Column */}
            {visibleColumns.includes('customer') && (
                <td className="px-4 py-3.5">
                    <div className="h-4 bg-slate-100 rounded w-28 mb-1.5"></div>
                    <div className="h-3.5 bg-slate-50 rounded w-24"></div>
                </td>
            )}

            {/* Gadget Specs Column */}
            {visibleColumns.includes('gadget') && (
                <td className="px-4 py-3.5">
                    <div className="h-4 bg-slate-100 rounded w-36 mb-1.5"></div>
                    <div className="h-3.5 bg-slate-50 rounded w-24"></div>
                </td>
            )}

            {/* Date Column */}
            {visibleColumns.includes('date') && (
                <td className="px-4 py-3.5 text-center">
                    <div className="h-4 bg-slate-100 rounded w-20 mx-auto"></div>
                </td>
            )}

            {/* Technician Column */}
            {visibleColumns.includes('technician') && (
                <td className="px-4 py-3.5">
                    <div className="h-8 bg-slate-100 rounded w-32"></div>
                </td>
            )}

            {/* Status Column */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-3.5 text-center">
                    <div className="h-6 bg-slate-100 rounded-full w-24 mx-auto"></div>
                </td>
            )}

            {/* Cost Column */}
            {visibleColumns.includes('cost') && (
                <td className="px-4 py-3.5 text-right font-bold">
                    <div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div>
                </td>
            )}

            {/* Actions Column */}
            <td className="px-6 py-3.5 text-center">
                <div className="w-8 h-8 bg-slate-100 rounded-full mx-auto"></div>
            </td>
        </tr>
    );
};

export default RepairSkeleton;
