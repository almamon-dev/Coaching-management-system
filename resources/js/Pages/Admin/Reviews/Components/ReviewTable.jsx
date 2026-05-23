import React from 'react';
import { Check, Search } from 'lucide-react';
import ReviewRow from './ReviewRow';
import ReviewSkeleton from './ReviewSkeleton';

const ReviewTable = ({ 
    reviews, 
    selectedIds, 
    selectAllAcrossPages,
    toggleSelectAll, 
    toggleSelect,
    isProcessing,
    activeTab,
    stats,
    visibleColumns
}) => {
    const isAllOnPageSelected = reviews.data.length > 0 && reviews.data.every(r => selectedIds.includes(r.id));
    
    // Smart Skeleton Logic: Only show skeletons if we are loading AND the current tab has data to load
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={`w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center ${selectAllAcrossPages || isAllOnPageSelected
                                    ? "bg-[#008060] border-[#008060]"
                                    : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                    }`}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('product') && <th className="px-4 py-2.5 w-[250px]">Product</th>}
                        {visibleColumns.includes('rating') && <th className="px-4 py-2.5 text-center w-[120px]">Rating</th>}
                        {visibleColumns.includes('customer') && <th className="px-4 py-2.5 w-[200px]">Customer</th>}
                        {visibleColumns.includes('comment') && <th className="px-4 py-2.5 text-left">Comment</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[120px]">Status</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 text-center w-[140px]">Date</th>}
                        <th className="px-6 py-2.5 text-right w-[160px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {shouldShowSkeletons ? (
                        Array.from({ length: reviews.data?.length > 0 ? reviews.data.length : 3 }).map((_, i) => (
                            <ReviewSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : reviews.data?.length > 0 ? (
                        reviews.data.map((review) => (
                            <ReviewRow
                                key={review.id}
                                review={review}
                                isSelected={selectAllAcrossPages || selectedIds.includes(review.id)}
                                toggleSelect={() => toggleSelect(review.id)}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-lg font-bold">No reviews found</p>
                                <p className="text-sm">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewTable;
