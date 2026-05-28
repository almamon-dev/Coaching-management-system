import React from 'react';

const ProductSkeleton = ({ visibleColumns = [] }) => {
    return (
        <tr className="animate-pulse border-b border-[#f1f1f1] last:border-0 h-[48px]">
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div className="w-[17px] h-[17px] bg-slate-100 rounded-[3px]"></div>
            </td>

            {visibleColumns.includes('product') && (
                <td className="px-4 py-1 w-[240px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 rounded-[4px] flex-shrink-0"></div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-2.5 w-3/4 bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-1/2 bg-slate-50 rounded-full"></div>
                        </div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-5 w-20 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('stock') && (
                <td className="px-4 py-1 w-[80px]">
                    <div className="flex flex-col gap-1">
                        <div className="h-2.5 w-16 bg-slate-100 rounded-full"></div>
                        <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                    </div>
                </td>
            )}

            {visibleColumns.includes('category') && (
                <td className="px-4 py-1 w-[120px]">
                    <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('brand') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-20 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('price') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-16 bg-slate-100 rounded-full ml-auto"></div>
                </td>
            )}

            {visibleColumns.includes('discount_price') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-16 bg-slate-100 rounded-full ml-auto"></div>
                </td>
            )}

            {visibleColumns.includes('is_featured') && (
                <td className="px-4 py-1 w-[60px]">
                    <div className="h-4 w-4 bg-slate-100 rounded-full mx-auto"></div>
                </td>
            )}

            {visibleColumns.includes('view_count') && (
                <td className="px-4 py-3 text-right">
                    <div className="h-3 w-8 bg-[#ebebeb] rounded animate-pulse ml-auto"></div>
                </td>
            )}

            {visibleColumns.includes('warranty') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-20 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                </td>
            )}

            {visibleColumns.includes('updated_at') && (
                <td className="px-4 py-1 w-[90px]">
                    <div className="h-2.5 w-24 bg-slate-100 rounded-full"></div>
                </td>
            )}

            <td className="px-6 py-1 w-[130px]">
                <div className="flex items-center justify-end gap-2">
                    <div className="w-7 h-7 bg-slate-50 rounded-[4px]"></div>
                    <div className="w-7 h-7 bg-slate-50 rounded-[4px]"></div>
                    <div className="w-7 h-7 bg-slate-50 rounded-[4px]"></div>
                </div>
            </td>
        </tr>
    );
};

export default ProductSkeleton;
