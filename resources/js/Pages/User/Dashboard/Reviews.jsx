import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { Star, MessageSquare, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const Reviews = ({ auth, reviews }) => {
    const list = reviews.data || [];

    return (
        <UserLayout user={auth.user}>
            <Head title="My Reviews" />

            <div className="space-y-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[18px] font-bold text-[#081621] tracking-tight">My Reviews</h1>
                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">Products you've reviewed and rated</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-[2px]">
                        {list.length} review{list.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[4px] border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Product</th>
                                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide w-24">Rating</th>
                                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Review</th>
                                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide text-center w-24">Image</th>
                                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide text-right w-24">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {list.length > 0 ? list.map((review) => (
                                <tr key={review.id} className="hover:bg-slate-50/60 transition-colors group">
                                    {/* Product */}
                                    <td className="px-4 py-2.5 max-w-[200px]">
                                        <p className="text-[12px] font-bold text-[#081621] truncate leading-tight" title={review.product_name}>
                                            {review.product_name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{review.date}</p>
                                    </td>

                                    {/* Rating */}
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    strokeWidth={1.5}
                                                    className={i < review.rating
                                                        ? "fill-amber-400 text-amber-500"
                                                        : "fill-slate-100 text-slate-200"}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{review.rating}/5</p>
                                    </td>

                                    {/* Comment */}
                                    <td className="px-4 py-2.5 max-w-[280px]">
                                        <p className="text-[12px] text-slate-600 font-medium line-clamp-2 leading-snug" title={review.comment}>
                                            {review.comment || <span className="text-slate-300 italic">No comment</span>}
                                        </p>
                                    </td>

                                    {/* Images */}
                                    <td className="px-4 py-2.5 text-center">
                                        {review.images && review.images.length > 0 ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <img
                                                    src={review.images[0]}
                                                    alt="Review"
                                                    className="w-9 h-9 object-cover rounded-[2px] border border-slate-200"
                                                />
                                                {review.images.length > 1 && (
                                                    <span className="text-[10px] text-slate-400 font-bold">+{review.images.length - 1}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-medium">—</span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-2.5 text-right">
                                        <span className={cn(
                                            "inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tight border",
                                            review.status === 'Published'
                                                ? "bg-green-50 text-green-700 border-green-100"
                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                        )}>
                                            {review.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-5 py-14 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageSquare size={22} className="text-slate-200" />
                                        </div>
                                        <p className="text-[13px] font-bold text-slate-400">No Reviews Yet</p>
                                        <p className="text-[11px] text-slate-300 mt-1">You haven't reviewed any products.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
};

export default Reviews;
