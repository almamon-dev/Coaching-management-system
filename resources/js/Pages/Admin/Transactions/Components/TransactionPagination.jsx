import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SelectInput from '@/Components/SelectInput';

/**
 * TransactionPagination Component
 * Matches the Category module's minimalist pagination design.
 */
const TransactionPagination = ({ 
    transactions, 
    filters, 
    handlePerPageChange, 
    handlePageChange 
}) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 10, 10);
    const count = transactions.data?.length || 0;

    const fromIdx = count > 0 ? startIdx : 0;
    const toIdx = count > 0 ? startIdx + count - 1 : 0;

    const getPaginatedUrl = (url, nextStartIndex) => {
        if (!url) return '#';
        try {
            const urlObj = new URL(url, window.location.origin);
            urlObj.searchParams.set('start_index', nextStartIndex.toString());
            return urlObj.pathname + urlObj.search;
        } catch (e) {
            return url;
        }
    };

    const prevUrl = getPaginatedUrl(transactions.prev_page_url || transactions.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(transactions.next_page_url || transactions.links?.next, startIdx + perPage);

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
            {/* Per Page Selector */}
            <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {total !== undefined ? (
                        `${fromIdx} - ${toIdx} of ${total}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>
                <div className="w-[75px]">
                    <SelectInput
                        value={filters?.per_page || 10}
                        onChange={handlePerPageChange}
                        showSearch={false}
                        direction="up"
                        options={[
                            { id: '10', name: '10' },
                            { id: '20', name: '20' },
                            { id: '50', name: '50' },
                            { id: '100', name: '100' }
                        ]}
                        className="[&_button]:h-[30px] [&_button]:py-0 min-w-0 shadow-none border-[#d1d1d1]"
                    />
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {(transactions.total !== undefined) ? (
                        `${transactions.from || 0} - ${transactions.to || 0} of ${transactions.total || 0}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>

                <div className="flex gap-1">
                    <Link
                        href={prevUrl}
                        preserveState
                        preserveScroll
                        as="button"
                        disabled={!prevUrl || prevUrl === '#'}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <Link
                        href={nextUrl}
                        preserveState
                        preserveScroll
                        as="button"
                        disabled={!nextUrl || nextUrl === '#'}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TransactionPagination;
