import React, { Fragment } from 'react';
import { router } from '@inertiajs/react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function Pagination({
    pagination,
    total: propTotal,
    fromIdx: propFrom,
    toIdx: propTo,
    perPage: propPerPage,
    onPerPageChange,
    onPrevPage,
    onNextPage,
    hasPrev: propHasPrev,
    hasNext: propHasNext,
    perPageOptions = [10, 15, 30, 50, 100],
    itemLabel = 'entries',
    className = '',
}) {
    // Support both server-side Inertia paginator (`pagination`) and client-side pagination props
    const isServer = Boolean(pagination);

    const total = isServer
        ? pagination.meta?.total ?? pagination.total ?? 0
        : propTotal ?? 0;

    const fromIdx = isServer
        ? pagination.meta?.from ?? pagination.from ?? 0
        : propFrom ?? 0;

    const toIdx = isServer
        ? pagination.meta?.to ?? pagination.to ?? 0
        : propTo ?? 0;

    const perPage = isServer
        ? Number(pagination.meta?.per_page ?? pagination.per_page ?? 10)
        : Number(propPerPage ?? 10);

    const prevUrl = isServer
        ? pagination.meta?.links?.find((l) => l.label?.includes('Previous'))?.url ||
          pagination.prev_page_url ||
          pagination.links?.prev
        : null;

    const nextUrl = isServer
        ? pagination.meta?.links?.find((l) => l.label?.includes('Next'))?.url ||
          pagination.next_page_url ||
          pagination.links?.next
        : null;

    const hasPrev = isServer ? Boolean(prevUrl) : Boolean(propHasPrev);
    const hasNext = isServer ? Boolean(nextUrl) : Boolean(propHasNext);

    if (isServer && total === 0 && !pagination.data?.length) return null;

    const handlePerPage = (newPerPage) => {
        const val = Number(newPerPage);
        if (onPerPageChange) {
            onPerPageChange(val);
            return;
        }
        if (isServer && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('per_page', String(val));
            url.searchParams.set('page', '1');
            router.get(url.pathname + url.search, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handlePrev = () => {
        if (!hasPrev) return;
        if (onPrevPage) {
            onPrevPage();
            return;
        }
        if (prevUrl) {
            router.get(prevUrl, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handleNext = () => {
        if (!hasNext) return;
        if (onNextPage) {
            onNextPage();
            return;
        }
        if (nextUrl) {
            router.get(nextUrl, {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <div
            className={`flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-200/80 bg-slate-50/50 font-sans ${className}`}
        >
            {/* Left: Entries Info */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium whitespace-nowrap min-w-0">
                <span>Showing</span>
                <span className="font-bold text-slate-800 tabular-nums">
                    {total > 0 ? `${fromIdx}–${toIdx}` : '0'}
                </span>
                <span>of</span>
                <span className="font-bold text-slate-800 tabular-nums">{total}</span>
                <span className="hidden sm:inline">{itemLabel}</span>
            </div>

            {/* Right: Per Page Selector & Prev/Next Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Listbox value={perPage} onChange={handlePerPage}>
                    <div className="relative">
                        <Listbox.Button
                            aria-label="Items per page"
                            className="h-8 pl-2.5 pr-2 flex items-center justify-between gap-1.5 text-xs font-semibold rounded-[4px] border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#16a34a] transition-colors cursor-pointer min-w-[54px] shadow-none"
                        >
                            <span className="tabular-nums text-slate-800 font-semibold">{perPage}</span>
                            <ChevronDown size={13} className="text-slate-400 shrink-0" />
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute right-0 bottom-full mb-1 w-20 max-h-48 overflow-auto rounded-[4px] bg-white py-1 shadow-lg ring-1 ring-black/5 border border-slate-200 focus:outline-none z-50">
                                {perPageOptions.map((opt) => (
                                    <Listbox.Option
                                        key={opt}
                                        value={opt}
                                        className={({ active, selected }) =>
                                            `flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer select-none transition-colors ${
                                                selected
                                                    ? 'bg-emerald-50 text-[#16a34a] font-bold'
                                                    : active
                                                    ? 'bg-slate-50 text-slate-900 font-medium'
                                                    : 'text-slate-700'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className="tabular-nums">{opt}</span>
                                                {selected && <Check size={12} className="text-[#16a34a] stroke-[2.5]" />}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={!hasPrev}
                        aria-label="Previous page"
                        className="h-8 px-2 sm:px-2.5 flex items-center justify-center gap-1 text-xs font-semibold rounded-[4px] border border-slate-200 bg-white text-slate-700 hover:border-[#16a34a]/40 hover:text-[#16a34a] hover:bg-emerald-50/50 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-none active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                        <span className="hidden sm:inline">Prev</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!hasNext}
                        aria-label="Next page"
                        className="h-8 px-2 sm:px-2.5 flex items-center justify-center gap-1 text-xs font-semibold rounded-[4px] border border-slate-200 bg-white text-slate-700 hover:border-[#16a34a]/40 hover:text-[#16a34a] hover:bg-emerald-50/50 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-none active:scale-95 cursor-pointer"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
