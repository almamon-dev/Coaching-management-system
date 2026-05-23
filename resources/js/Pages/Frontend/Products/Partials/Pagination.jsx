import React, { memo } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Pagination Component
 * 
 * Renders a professional pagination bar with navigational links and results metadata.
 * Wrapped in React.memo to optimize performance during high-frequency filter updates.
 * 
 * @param {Object} props.meta - Pagination metadata (total, current_page, etc).
 * @param {Array} props.links - Raw pagination links from Laravel.
 */
const Pagination = memo(({ meta, links: propLinks }) => {
    // Resolve links from either meta object or direct prop
    const links = meta?.links || propLinks || [];

    // Early exit if pagination is unnecessary or invalid
    if (!meta || meta.total === 0 || meta.last_page <= 1 || !Array.isArray(links)) return null;

    return (
        <div className="mt-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Navigational Link Actions */}
            <div className="flex items-center gap-1.5">
                {links.map((link, index) => {
                    // Filter out invalid/empty pagination slots
                    if (!link.url && !link.label.includes('Previous') && !link.label.includes('Next')) return null;

                    // Standardize labels for StarTech professional aesthetic
                    let label = link.label;
                    if (label.includes('Previous')) label = 'PREV';
                    if (label.includes('Next')) label = 'NEXT';

                    const isActive = link.active;
                    const isUrl = !!link.url;

                    // Use index + label as a stable key to ensure uniqueness for non-unique labels
                    return (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url || '#'}
                            className={`
                                min-w-[32px] h-[32px] flex items-center justify-center px-3 
                                text-[12px] font-bold rounded-[3px] transition-all duration-300
                                ${isActive
                                    ? 'bg-[#4f46e5] text-white shadow-sm'
                                    : isUrl
                                        ? 'bg-[#f1f3f9] text-[#6676a4] hover:bg-[#4f46e5] hover:text-white hover:shadow-md'
                                        : 'bg-[#f8f9fa] text-slate-300 cursor-not-allowed'}
                            `}
                            onClick={(e) => !isUrl && e.preventDefault()}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>

            {/* Results Metadata Summary */}
            <div className="text-[14px] text-slate-600 font-medium bg-white/50 px-4 py-1 rounded-full border border-slate-100">
                Showing <span className="text-[#081621] font-bold">{meta.from || 0}</span> to <span className="text-[#081621] font-bold">{meta.to || 0}</span> of <span className="text-[#081621] font-bold">{meta.total}</span> Results
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

export default Pagination;
