import React from 'react';
import { cn } from '@/lib/utils';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={cn(
                "inline-flex items-center justify-center rounded-[3px] border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-none transition duration-150 ease-in-out hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-0 disabled:opacity-50 cursor-pointer",
                className
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
