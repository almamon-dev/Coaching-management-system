import React from 'react';
import { cn } from '@/lib/utils';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center rounded-[3px] border border-transparent bg-[#16a34a] px-4 py-2 text-xs font-semibold text-white transition duration-150 ease-in-out hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:ring-offset-0 active:bg-[#166534] disabled:opacity-50 cursor-pointer shadow-none",
                className
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
