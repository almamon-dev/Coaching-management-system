import React from 'react';
import { SearchX } from 'lucide-react';

export default function TableEmptyState({ 
    colSpan, 
    title = 'No items found', 
    description = 'Try adjusting your search or filters to find what you are looking for.' 
}) {
    return (
        <tr>
            <td colSpan={colSpan} className="py-12 px-6 text-center border-b border-[#ebebeb]">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-[#ebebeb]">
                        <SearchX size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-700 mb-1">{title}</h3>
                    <p className="text-[13px] text-slate-500 max-w-sm">
                        {description}
                    </p>
                </div>
            </td>
        </tr>
    );
}
