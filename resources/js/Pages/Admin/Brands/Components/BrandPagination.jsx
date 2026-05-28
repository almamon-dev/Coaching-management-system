import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import SelectInput from '@/Components/SelectInput';

const BrandPagination = ({ brands, filters, total, stats, handlePerPageChange }) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 10, 10);
    const count = brands.data?.length || 0;

    const fromIdx = count > 0 ? startIdx : 0;
    const toIdx   = count > 0 ? startIdx + count - 1 : 0;
    const totalCount = stats?.total ?? total ?? null;

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

    const prevUrl = getPaginatedUrl(brands.prev_page_url || brands.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(brands.next_page_url || brands.links?.next, startIdx + perPage);

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
                    {totalCount !== null
                        ? `${fromIdx} - ${toIdx} of ${totalCount}`
                        : `${fromIdx} - ${toIdx}`
                    }
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

export default BrandPagination;
