import React from 'react';
import SelectInput from '@/Components/Form/SelectInput';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPerPageChange, perPageOptions = [10, 15, 30, 50, 100] }) {
    if (!pagination) return null;
    
    const fromIdx = pagination.meta?.from || pagination.from || 0;
    const toIdx = pagination.meta?.to || pagination.to || 0;
    const totalCount = pagination.meta?.total || pagination.total || 0;
    const prevUrl = pagination.meta?.links?.find(l => l.label.includes('Previous'))?.url || pagination.prev_page_url || pagination.links?.prev;
    const nextUrl = pagination.meta?.links?.find(l => l.label.includes('Next'))?.url || pagination.next_page_url || pagination.links?.next;
    const perPage = pagination.meta?.per_page || pagination.per_page || 10;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 px-4 py-3 border-t border-[#ebebeb] bg-white">
            <div className="flex items-center gap-2">
                <SelectInput
                    value={perPage}
                    onChange={(e) => onPerPageChange && onPerPageChange(e.target.value)}
                    showSearch={false}
                    direction="up"
                    options={perPageOptions.map(num => ({ id: num.toString(), name: num.toString() }))}
                    className="w-[75px] [&_button]:h-[30px] [&_button]:py-0 [&_button]:text-[12px] min-w-0"
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                    {totalCount > 0 ? `${fromIdx} - ${toIdx} of ${totalCount}` : `0 - 0`}
                </span>

                <div className="flex gap-1">
                    <Link
                        href={prevUrl || '#'}
                        preserveState preserveScroll prefetch as="button" disabled={!prevUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <Link
                        href={nextUrl || '#'}
                        preserveState preserveScroll prefetch as="button" disabled={!nextUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
