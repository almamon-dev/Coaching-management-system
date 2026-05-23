import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Check, Search, SquarePen, Trash2 } from 'lucide-react';
import StatusDropdown from '@/Components/StatusDropdown';
import CouponSkeleton from './CouponSkeleton';
import { cn } from '@/lib/utils';

const CouponTable = ({ campaigns, selectedIds, toggleSelectAll, toggleSelect, handleDeleteClick, isProcessing, visibleColumns = [], selectAllAcrossPages }) => {
    const isAllOnPageSelected = campaigns.data.length > 0 && campaigns.data.every(item => selectedIds.includes(item.id));

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    selectAllAcrossPages || isAllOnPageSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                )}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={11} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('coupon') && <th className="px-4 py-2.5 w-[300px]">Coupon</th>}
                        {visibleColumns.includes('code') && <th className="px-4 py-2.5 text-center w-[140px]">Promo Code</th>}
                        {visibleColumns.includes('discount') && <th className="px-4 py-2.5 text-center w-[130px]">Discount</th>}
                        {visibleColumns.includes('min_purchase') && <th className="px-4 py-2.5 text-center w-[130px]">Min. Purchase</th>}
                        {visibleColumns.includes('usage') && <th className="px-4 py-2.5 text-center w-[140px]">Used / Limit</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px]">Status</th>}
                        {visibleColumns.includes('expiry') && <th className="px-4 py-2.5 text-center w-[150px]">Expiry</th>}
                        <th className="px-6 py-2.5 text-right w-[160px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {isProcessing ? (
                        Array.from({ length: campaigns.data?.length || 5 }).map((_, i) => <CouponSkeleton key={i} />)
                    ) : campaigns.data.length > 0 ? (
                        campaigns.data.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <tr 
                                    key={item.id} 
                                    className={cn(
                                        "group transition-colors h-[48px]",
                                        isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
                                    )}
                                >
                                    <td className="pl-4 pr-2 py-1 w-10">
                                        <div
                                            onClick={() => toggleSelect(item.id)}
                                            className={cn(
                                                "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                                isSelected
                                                    ? "bg-[#008060] border-[#008060]"
                                                    : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                                            )}
                                        >
                                            {isSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                                        </div>
                                    </td>
                                    {visibleColumns.includes('coupon') && (
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb] group-hover:border-[#008060]/30 transition-all font-bold text-[#202223] text-[14px]">
                                                    {item.title.charAt(0)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[12px] font-bold text-[#202223] group-hover:text-[#008060] transition-colors leading-tight truncate">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-[10px] text-[#6d7175] font-bold mt-0.5 uppercase tracking-tight">
                                                        ID: #{item.id.toString().padStart(4, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('code') && (
                                        <td className="px-4 py-1">
                                            <div className="flex justify-center">
                                                <code className="text-[11px] text-[#6d7175] font-bold bg-[#f7f7f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb] tracking-tight whitespace-nowrap uppercase">
                                                    {item.code}
                                                </code>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('discount') && (
                                        <td className="px-4 py-1 text-center">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] font-bold text-[11px] bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]">
                                                {item.discount_type === 'percentage' ? `${item.discount_value}%` : `${item.discount_value}৳`}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.includes('min_purchase') && (
                                        <td className="px-4 py-1 text-center text-[11px] font-bold text-[#202223] uppercase tracking-tight">
                                            {item.min_purchase > 0 ? `${item.min_purchase}৳` : 'No Minimum'}
                                        </td>
                                    )}
                                    {visibleColumns.includes('usage') && (
                                        <td className="px-4 py-1 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-[#6d7175] tracking-tight">
                                                    {item.used_count} <span className="text-[#bababa] mx-0.5">/</span> {item.usage_limit || '∞'}
                                                </span>
                                                <div className="w-16 h-1 bg-[#f1f1f1] rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#008060] rounded-full transition-all duration-500"
                                                        style={{ width: `${item.usage_limit ? Math.min((item.used_count / item.usage_limit) * 100, 100) : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('status') && (
                                        <td className="px-4 py-1 text-center">
                                            <StatusDropdown
                                                value={item.status ? 1 : 0}
                                                options={[
                                                    { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                                                    { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                                                ]}
                                                onChange={(newVal) => {
                                                    router.patch(route('admin.marketing.status', item.id), { status: newVal }, { preserveScroll: true });
                                                }}
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.includes('expiry') && (
                                        <td className="px-4 py-1 text-center whitespace-nowrap">
                                            <span className="text-[11px] text-[#6d7175]">
                                                {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : 'Lifetime'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-1 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={route("admin.marketing.campaigns.edit", item.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                                                title="Edit Coupon"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(item.id, item.title)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-lg font-bold">No coupons found</p>
                                <p className="text-sm">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CouponTable;
