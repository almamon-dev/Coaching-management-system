import React from 'react';
import { Check, Trash2, Send, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const QuestionRow = ({ q, isSelected, toggleSelect, handleReply, handleDelete, visibleColumns }) => {
    return (
        <tr className={cn(
            "group transition-colors h-[48px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(q.id)}
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
                            {q.product?.primary_image ? (
                                <img src={q.product.primary_image.full_url} className="w-full h-full object-contain" />
                            ) : (
                                <ImageIcon size={14} className="text-[#bababa]" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Link 
                                href={route('admin.products.edit', q.product?.id)}
                                className="text-[12px] text-[#202223] font-bold hover:underline truncate transition-colors leading-tight"
                            >
                                {q.product?.name}
                            </Link>
                            {q.product?.sku && (
                                <span className="text-[10px] font-medium text-[#6d7175] mt-0.5">#{q.product.sku}</span>
                            )}
                        </div>
                    </div>
                </td>
            )}
            {visibleColumns.includes('question') && (
                <td className="px-4 py-1">
                    <div className="flex flex-col truncate leading-tight">
                        <p className="text-[12px] text-[#202223] font-medium truncate">
                            {q.question}
                        </p>
                        {q.answer && (
                            <p className="text-[10px] text-[#008060] mt-0.5 font-medium truncate italic">
                                A: {q.answer}
                            </p>
                        )}
                    </div>
                </td>
            )}
            {visibleColumns.includes('customer') && (
                <td className="px-4 py-1">
                    <span className="text-[11px] text-[#202223] font-bold">
                        {q.user?.name || 'Guest'}
                    </span>
                </td>
            )}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    {q.answer ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[10px] bg-[#e4f1ef] text-[#008060] text-[10px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                            Answered
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[10px] bg-[#fff5ea] text-[#916a00] text-[10px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#916a00]" />
                            Pending
                        </span>
                    )}
                </td>
            )}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className="text-[11px] text-[#6d7175]">
                        {new Date(q.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}
            <td className="px-4 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => handleReply(q)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Reply to Question"
                    >
                        <Send size={12} />
                    </button>
                    <button
                        onClick={() => handleDelete(q.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Question"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default QuestionRow;
