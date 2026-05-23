import React from 'react';

/**
 * SupplierSkeleton Component
 * Placeholder rows for the supplier table during loading.
 */
const SupplierSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse h-[52px]">
            {/* Checkbox */}
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-[#f1f1f1] rounded-[3px]" />
            </td>

            {/* Supplier Info */}
            {visibleColumns.includes('supplier') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[4px] bg-[#f1f1f1]" />
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-2.5 bg-[#f1f1f1] rounded w-32" />
                            <div className="h-2 bg-[#f9fafb] rounded w-16" />
                        </div>
                    </div>
                </td>
            )}

            {/* Contact Person */}
            {visibleColumns.includes('contact') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-2.5 bg-[#f1f1f1] rounded w-24" />
                        <div className="h-2 bg-[#f9fafb] rounded w-28" />
                    </div>
                </td>
            )}

            {/* Brands */}
            {visibleColumns.includes('brands') && (
                <td className="px-4 py-1">
                    <div className="flex gap-1">
                        <div className="h-4 bg-[#f1f1f1] rounded w-12" />
                        <div className="h-4 bg-[#f1f1f1] rounded w-12" />
                    </div>
                </td>
            )}

            {/* Phone */}
            {visibleColumns.includes('phone') && (
                <td className="px-4 py-1 text-center">
                    <div className="h-4 bg-[#f1f1f1] rounded w-20 mx-auto" />
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <div className="h-6 bg-[#f1f1f1] rounded-full w-20 mx-auto" />
                </td>
            )}

            {/* Joined Date */}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="h-2.5 bg-[#f1f1f1] rounded w-16" />
                        <div className="h-2 bg-[#f9fafb] rounded w-12" />
                    </div>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <div className="w-[26px] h-[26px] bg-[#f1f1f1] rounded-[2px]" />
                    <div className="w-[26px] h-[26px] bg-[#f1f1f1] rounded-[2px]" />
                    <div className="w-[26px] h-[26px] bg-[#f1f1f1] rounded-[2px]" />
                </div>
            </td>
        </tr>
    );
};

export default SupplierSkeleton;
