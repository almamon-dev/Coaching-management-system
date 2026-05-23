import React from 'react';
import SelectInput from '@/Components/SelectInput';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VariantPagination = ({ variants, filters, total, handlePerPageChange, handlePageChange }) => {
    const perPage = parseInt(filters?.per_page || 10, 10);
    const fromIdx = variants.from || 0;
    const toIdx = variants.to || 0;

    const prevUrl = variants.prev_page_url;
    const nextUrl = variants.next_page_url;

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white rounded-b-[8px]">
            <div className="flex items-center gap-2">
                <div className="w-[75px]">
                    <SelectInput
                        value={filters?.per_page || 10}
                        onChange={handlePerPageChange}
                        showSearch={false}
                        direction="up"
                        options={[
                            { id: '5', name: '5' },
                            { id: '10', name: '10' },
                            { id: '20', name: '20' },
                            { id: '50', name: '50' },
                            { id: '100', name: '100' }
                        ]}
                        className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {total !== undefined ? (
                        `${fromIdx} - ${toIdx} of ${total}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>

                <div className="flex gap-1">
                    <Link
                        href={prevUrl || '#'}
                        preserveState
                        preserveScroll
                        prefetch
                        as="button"
                        disabled={!prevUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <Link
                        href={nextUrl || '#'}
                        preserveState
                        preserveScroll
                        prefetch
                        as="button"
                        disabled={!nextUrl}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VariantPagination;
