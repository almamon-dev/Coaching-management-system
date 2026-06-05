import SelectInput from '@/Components/SelectInput';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AcademicClassPagination = ({ classes, filters, total, handlePerPageChange, handlePageChange }) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 10, 10);
    const count = classes.data?.length || 0;

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

    const prevUrl = getPaginatedUrl(classes.prev_page_url || classes.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(classes.next_page_url || classes.links?.next, startIdx + perPage);

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
                <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                    {total !== undefined ? (
                        `${fromIdx} - ${toIdx} of ${total}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>

                <div className="flex gap-1">
                    <Link
                        href={prevUrl}
                        preserveState
                        preserveScroll
                        prefetch
                        as="button"
                        disabled={!classes.prev_page_url}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <Link
                        href={nextUrl}
                        preserveState
                        preserveScroll
                        prefetch
                        as="button"
                        disabled={!classes.next_page_url}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AcademicClassPagination;
