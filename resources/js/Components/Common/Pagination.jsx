import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {
    if (!links || links.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
            {links.map((link, key) => (
                <Link
                    key={key}
                    href={link.url || '#'}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-[4px] transition-all ${
                        link.active 
                        ? 'bg-[#008060] text-white shadow-sm' 
                        : link.url 
                            ? 'bg-white text-slate-600 border border-[#ebebeb] hover:border-[#008060] hover:text-[#008060]' 
                            : 'text-slate-400 bg-slate-50 cursor-not-allowed border border-transparent'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

export default Pagination;
