import React from 'react';

/**
 * SummaryCard - Standardized, clean summary card component with 4px rounded corners
 */
export default function SummaryCard({
    title,
    icon: Icon,
    badge,
    action,
    children,
    footer,
    className = "",
    bodyClassName = "p-4 sm:p-5 space-y-4",
}) {
    return (
        <div className={`bg-white rounded-[4px] border border-slate-200/90 shadow-2xs overflow-hidden ${className}`}>
            {(title || Icon || badge || action) && (
                <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        {Icon && <Icon className="text-emerald-600 shrink-0" size={17} />}
                        {title && (
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                                {title}
                            </h3>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {badge}
                        {action}
                    </div>
                </div>
            )}
            <div className={bodyClassName}>
                {children}
            </div>
            {footer && (
                <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100">
                    {footer}
                </div>
            )}
        </div>
    );
}

/**
 * Key-value row inside a summary card
 */
SummaryCard.Row = function SummaryCardRow({
    label,
    value,
    subtitle,
    isTotal = false,
    isDue = false,
    isPaid = false,
    className = ""
}) {
    return (
        <div
            className={`flex items-center justify-between text-xs py-1 transition-colors ${
                isTotal ? 'pt-2 mt-1.5 border-t border-slate-200 font-bold text-slate-900 text-[12.5px]' :
                isDue ? 'pt-1.5 border-t border-rose-100 font-bold text-rose-600' :
                isPaid ? 'font-bold text-emerald-700' :
                'text-slate-600 font-medium'
            } ${className}`}
        >
            <div className="min-w-0 flex-1 pr-2">
                <span className="block truncate">{label}</span>
                {subtitle && <span className="block text-[10px] text-slate-400 font-normal truncate">{subtitle}</span>}
            </div>
            <span className={`shrink-0 tabular-nums ${isTotal ? 'text-slate-900 font-extrabold' : ''}`}>
                {value}
            </span>
        </div>
    );
};

/**
 * Calculation / highlighted breakdown box
 */
SummaryCard.Box = function SummaryCardBox({
    children,
    variant = "slate", // "slate" | "emerald" | "amber" | "rose"
    className = ""
}) {
    const variantStyles = {
        slate: "bg-slate-50/80 border-slate-200/70 text-slate-700",
        emerald: "bg-emerald-50/50 border-emerald-200/80 text-emerald-900",
        amber: "bg-amber-50/60 border-amber-200/80 text-amber-900",
        rose: "bg-rose-50/60 border-rose-200/80 text-rose-900",
    };

    return (
        <div className={`p-3.5 rounded-[4px] border space-y-1.5 ${variantStyles[variant] || variantStyles.slate} ${className}`}>
            {children}
        </div>
    );
};

