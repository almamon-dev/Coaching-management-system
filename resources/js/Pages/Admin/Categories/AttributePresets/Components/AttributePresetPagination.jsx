import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SelectInput from '@/Components/SelectInput';

const AttributePresetPagination = ({ presets, filters, total, onPerPageChange, onPageChange }) => {
    if (!presets || !presets.data) return null;

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCursor = searchParams.has('cursor');
    const startIdx = hasCursor ? parseInt(searchParams.get('start_index') || '1', 10) : 1;
    const perPage = parseInt(filters?.per_page || 15, 10);
    const count = presets.data?.length || 0;

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

    const prevUrl = getPaginatedUrl(presets.prev_page_url || presets.links?.prev, Math.max(1, startIdx - perPage));
    const nextUrl = getPaginatedUrl(presets.next_page_url || presets.links?.next, startIdx + perPage);

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
                <div className="w-[70px]">
                    <SelectInput
                        value={filters?.per_page || 15}
                        onChange={(e) => onPerPageChange && onPerPageChange(e)}
                        showSearch={false}
                        direction="up"
                        options={[
                            { id: '10', name: '10' },
                            { id: '15', name: '15' },
                            { id: '20', name: '20' },
                            { id: '50', name: '50' },
                            { id: '100', name: '100' }
                        ]}
                        className="[&_button]:h-[28px] [&_button]:py-0 [&_button]:px-2 [&_button]:text-[12px] min-w-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                    {(presets.total !== undefined) ? (
                        `${presets.from || 0} - ${presets.to || 0} of ${presets.total || 0} presets`
                    ) : (
                        `${fromIdx} - ${toIdx} presets`
                    )}
                </span>

                <div className="flex gap-1">
                    <button
                        onClick={() => onPageChange && onPageChange(prevUrl)}
                        disabled={!prevUrl}
                        className="w-8 h-8 flex items-center justify-center rounded-[3px] border border-[#d1d1d1] text-[#202223] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => onPageChange && onPageChange(nextUrl)}
                        disabled={!nextUrl}
                        className="w-8 h-8 flex items-center justify-center rounded-[3px] border border-[#d1d1d1] text-[#202223] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttributePresetPagination;
