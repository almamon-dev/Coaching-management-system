import { ChevronLeft, ChevronRight } from 'lucide-react';
import SelectInput from '@/Components/SelectInput';

const QuestionPagination = ({ questions, filters, total, handlePerPageChange, handlePageChange }) => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 10, 10);
    const count = questions.data?.length || 0;

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

    const prevUrl = getPaginatedUrl(questions.prev_page_url || questions.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(questions.next_page_url || questions.links?.next, startIdx + perPage);

    return (
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
            <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#202223] font-bold tabular-nums">
                    {total !== undefined ? (
                        `${fromIdx} - ${toIdx} of ${total}`
                    ) : (
                        `${fromIdx} - ${toIdx}`
                    )}
                </span>
                <div className="w-[65px]">
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
                        className="[&_button]:h-[32px] [&_button]:py-0 min-w-0"
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

                <div className="flex gap-1.5">
                    <button
                        onClick={() => handlePageChange && handlePageChange(prevUrl)}
                        disabled={!prevUrl}
                        className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => handlePageChange && handlePageChange(nextUrl)}
                        disabled={!nextUrl}
                        className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionPagination;
