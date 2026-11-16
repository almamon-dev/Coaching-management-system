import React from 'react';

export const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className={`w-full text-left border-collapse ${className}`}>
                {children}
            </table>
        </div>
    );
};

export const TableHeader = ({ children, className = '' }) => {
    return (
        <thead>
            <tr className={`bg-slate-50/80 border-b border-slate-200/90 text-[11.5px] font-semibold text-slate-500 whitespace-nowrap select-none ${className}`}>
                {children}
            </tr>
        </thead>
    );
};

export const TableBody = ({ children, className = '' }) => {
    return (
        <tbody className={`divide-y divide-slate-200/90 bg-white ${className}`}>
            {children}
        </tbody>
    );
};

export const TableRow = ({ children, className = '', isSelected = false, ...props }) => {
    return (
        <tr
            className={`transition-colors min-h-[50px] ${isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50/70'} ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
};

export const TableCell = ({ children, className = '', align = 'left', ...props }) => {
    return (
        <td
            className={`px-3 py-1.5 text-xs font-medium text-slate-800 whitespace-nowrap ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} ${className}`}
            {...props}
        >
            {children}
        </td>
    );
};

export const TableHeadCell = ({ children, className = '', align = 'left', ...props }) => {
    return (
        <th
            className={`px-3 py-1.5 text-[11px] font-semibold text-slate-600 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} ${className}`}
            {...props}
        >
            {children}
        </th>
    );
};
