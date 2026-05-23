import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SelectInput from '@/Components/SelectInput';

const WarehousePagination = ({ warehouses, filters, total, handlePerPageChange, handlePageChange }) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 10, 10);
    const count = warehouses.data?.length || 0;

    const fromIdx = count > 0 ? startIdx : 0;
    const toIdx = count > 0 ? startIdx + count - 1 : 0;

    const getPaginatedUrl = (url, nextStartIndex) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url, window.location.origin);
            urlObj.searchParams.set('start_index', nextStartIndex.toString());
            return urlObj.pathname + urlObj.search;
        } catch (e) {
            return url;
        }
    };

    const prevUrl = getPaginatedUrl(warehouses.prev_page_url || warehouses.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(warehouses.next_page_url || warehouses.links?.next, startIdx + perPage);

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white rounded-b-[4px]">
            {/* Rows Per Page */}
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

            {/* Navigation Info & Controls */}
            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {(warehouses.total !== undefined) ? (
                        `${warehouses.from || 0} - ${warehouses.to || 0} of ${warehouses.total || 0}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>

                <div className="flex gap-1">
                    <button
                        onClick={() => handlePageChange && handlePageChange(prevUrl)}
                        disabled={!prevUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => handlePageChange && handlePageChange(nextUrl)}
                        disabled={!nextUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarehousePagination;
