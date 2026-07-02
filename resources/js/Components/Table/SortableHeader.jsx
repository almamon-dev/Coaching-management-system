import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function SortableHeader({ 
    label, 
    field, 
    currentSortField, 
    currentSortDirection, 
    routeConfig, 
    align = 'left' 
}) {
    const isActive = currentSortField === field;
    
    const handleSort = () => {
        let newDirection = 'asc';
        if (isActive) {
            newDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        }
        
        router.get(route(routeConfig.name), {
            ...routeConfig.params,
            sort_field: field,
            sort_direction: newDirection,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <th 
            className={`px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider cursor-pointer hover:bg-[#ebebeb] transition-colors select-none first:rounded-tl-[6px] last:rounded-tr-[6px] border-b-0 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
            onClick={handleSort}
        >
            <div className={`flex items-center gap-2 inline-flex ${align === 'right' ? 'flex-row-reverse' : ''}`}>
                <span>{label}</span>
                <span className="flex flex-col text-[#6d7175]/40">
                    {isActive ? (
                        currentSortDirection === 'asc' ? (
                            <ChevronUp size={14} className="text-[#6d7175]" strokeWidth={3} />
                        ) : (
                            <ChevronDown size={14} className="text-[#6d7175]" strokeWidth={3} />
                        )
                    ) : (
                        <ChevronsUpDown size={14} className="opacity-50 hover:opacity-100 transition-opacity" strokeWidth={2} />
                    )}
                </span>
            </div>
        </th>
    );
}
