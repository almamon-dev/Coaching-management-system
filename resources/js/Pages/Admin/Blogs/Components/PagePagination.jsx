import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SelectInput from '@/Components/Form/SelectInput';

const PagePagination = ({ pages, filters, total, handlePerPageChange }) => {
    const fromIdx = pages.from || 0;
    const toIdx = pages.to || 0;
    const displayTotal = total || pages.total || 0;

    const prevUrl = pages.prev_page_url;
    const nextUrl = pages.next_page_url;

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
            <div className="flex items-center gap-2">
                <div className="w-[75px]">
                    <SelectInput
                        value={filters?.per_page || 10}
                        onChange={handlePerPageChange}
                        showSearch={false}
                        direction="up"
                        options={[
                            { id: '5',   name: '5'   },
                            { id: '10',  name: '10'  },
                            { id: '20',  name: '20'  },
                            { id: '50',  name: '50'  },
                            { id: '100', name: '100' }
                        ]}
                        className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {fromIdx} - {toIdx} of {displayTotal}
                </span>

                <div className="flex gap-1">
                    {prevUrl ? (
                        <Link
                            href={prevUrl}
                            prefetch
                            preserveState
                            preserveScroll
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] transition-all bg-white shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] opacity-30 cursor-not-allowed bg-white shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}

                    {nextUrl ? (
                        <Link
                            href={nextUrl}
                            prefetch
                            preserveState
                            preserveScroll
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] hover:border-[#008060] hover:text-[#008060] transition-all bg-white shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#202223] opacity-30 cursor-not-allowed bg-white shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagePagination;
