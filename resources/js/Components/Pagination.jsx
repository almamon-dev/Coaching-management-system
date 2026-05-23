import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, key) => (
                <Link
                    key={key}
                    href={link.url || '#'}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-[2px] transition-all ${
                        link.active 
                        ? 'bg-[#3749bb] text-white' 
                        : link.url 
                            ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                            : 'text-slate-300 bg-slate-50 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

export default Pagination;
