import React, { memo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Pagination Component
 * 
 * Renders a clean, modern, and highly professional pagination bar.
 */
const Pagination = memo(({ meta, links: propLinks }) => {
    // Resolve links from either meta object or direct prop
    const links = meta?.links || propLinks || [];

    // Early exit if pagination is unnecessary or invalid
    if (!meta || meta.total === 0 || meta.last_page <= 1 || !Array.isArray(links)) return null;

    return (
        <div className="mt-10 mb-4 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Navigational Link Actions */}
            <div className="flex items-center gap-2">
                {links.map((link, index) => {
                    // Filter out invalid/empty pagination slots
                    if (!link.url && !link.label.includes('Previous') && !link.label.includes('Next')) return null;

                    const isPrev = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');
                    let content = link.label;
                    
                    if (isPrev) content = (
                        <div className="flex items-center gap-1.5 px-1">
                            <ArrowLeft size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">Prev</span>
                        </div>
                    );
                    else if (isNext) content = (
                        <div className="flex items-center gap-1.5 px-1">
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </div>
                    );

                    const isActive = link.active;
                    const isUrl = !!link.url;

                    const isNumber = !isPrev && !isNext;

                    return (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url || '#'}
                            className={`
                                flex items-center justify-center font-bold transition-all duration-300
                                ${isNumber ? 'w-[36px] h-[36px] rounded-full text-[14px]' : 'h-[36px] px-3 rounded-full text-[13px]'}
                                ${isActive
                                    ? 'bg-[#16a34a] text-white shadow-md shadow-[#16a34a]/30'
                                    : isUrl
                                        ? 'bg-white border border-slate-200 text-slate-600 hover:border-[#16a34a] hover:text-[#16a34a] hover:shadow-sm'
                                        : 'bg-transparent text-slate-300 cursor-not-allowed'}
                            `}
                            onClick={(e) => !isUrl && e.preventDefault()}
                        >
                            {typeof content === 'string' ? (
                                <span dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                content
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Results Metadata Summary */}
            <div className="text-[14px] text-slate-500 font-medium tracking-wide">
                Showing <strong className="text-[#081621]">{meta.from || 0}-{meta.to || 0}</strong> of <strong className="text-[#081621]">{meta.total}</strong> products
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

export default Pagination;
