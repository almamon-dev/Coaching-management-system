import React from 'react';
import { Search, X } from 'lucide-react';

export default function TableSearch({ value, onChange, placeholder = 'Search...', className = 'w-full sm:w-[320px]' }) {
    return (
        <div className={`relative max-w-full ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] pointer-events-none z-10" size={14} />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-[32px] pl-9 pr-8 border border-slate-200/80 rounded-[3px] text-[12px] font-medium bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#16a34a] focus:ring-0 transition-colors shadow-none"
            />
            {value && (
                <button
                    onClick={() => onChange({ target: { value: '' } })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    type="button"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    );
}
