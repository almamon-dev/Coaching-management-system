import React from 'react';
import { Search } from 'lucide-react';

export default function TableEmptyState({
    colSpan,
    title = 'No records found',
    description = 'There are no entries available right now. Check back later or adjust your search filters.',
}) {
    const content = (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-4 text-center w-full max-w-full font-sans">
            <div className="w-12 h-12 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mb-3 border border-emerald-100 shadow-2xs shrink-0">
                <Search className="text-[#16a34a]" size={20} strokeWidth={1.75} />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 tracking-tight px-2">
                {title}
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 max-w-[360px] mx-auto leading-relaxed font-normal px-2">
                {description}
            </p>
        </div>
    );

    if (colSpan) {
        return (
            <tr>
                <td colSpan={colSpan} className="bg-white">
                    {content}
                </td>
            </tr>
        );
    }

    return <div className="bg-white">{content}</div>;
}
