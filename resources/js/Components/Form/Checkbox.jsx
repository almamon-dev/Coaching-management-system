import React from 'react';
import { cn } from '@/lib/utils';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={cn(
                "h-4 w-4 rounded-[3px] border-slate-300 text-[#16a34a] shadow-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0 transition-colors cursor-pointer",
                className
            )}
        />
    );
}
