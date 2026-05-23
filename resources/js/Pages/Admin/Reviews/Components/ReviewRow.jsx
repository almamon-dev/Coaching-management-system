import React from 'react';
import { Check, Star, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import StatusDropdown from '@/Components/StatusDropdown';
import { cn } from '@/lib/utils';

const ReviewRow = ({ review, isSelected, toggleSelect, handleDelete, visibleColumns }) => {
    const onDelete = () => {
        handleDelete(review.id, review.user?.name);
    };

    return (
        <tr className={cn(
            "group transition-colors h-[48px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(review.id)}
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
            {visibleColumns.includes('product') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb]">
                            {review.product?.primary_image ? (
                                <img src={review.product.primary_image.full_url} className="w-full h-full object-contain" />
                            ) : (
                                <ImageIcon size={14} className="text-[#bababa]" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Link
                                href={route('admin.products.edit', review.product?.id)}
                                className="text-[12px] text-[#202223] font-bold hover:underline truncate transition-colors leading-tight"
                            >
                                {review.product?.name}
                            </Link>
                        </div>
                    </div>
                </td>
            )}
            {visibleColumns.includes('rating') && (
                <td className="px-4 py-1 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={10}
                                className={i < review.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-slate-200'}
                            />
                        ))}
                    </div>
                </td>
            )}
            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col leading-tight">
                        <span className="text-[12px] font-bold text-[#202223]">{review.user?.name}</span>
                        <span className="text-[10px] text-[#6d7175] font-medium truncate max-w-[150px]">{review.user?.email}</span>
                    </div>
                </td>
            )}
            {visibleColumns.includes('comment') && (
                <td className="px-4 py-1">
                    <p className="text-[11px] text-[#202223] font-medium line-clamp-2 italic">
                        "{review.comment}"
                    </p>
                </td>
            )}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={review.status ? 1 : 0}
                        options={[
                            { label: 'Published', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Hidden', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.post(route('admin.reviews.toggle-status', review.id));
                        }}
                    />
                </td>
            )}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className="text-[11px] text-[#6d7175]">
                        {new Date(review.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}
            <td className="px-4 py-1 text-right">
                <div className="flex items-center justify-end gap-1 transition-all">
                    <button
                        onClick={onDelete}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Review"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ReviewRow;
