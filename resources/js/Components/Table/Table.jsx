import React from 'react';

export const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className={`w-full text-left border-collapse min-w-[800px] ${className}`}>
                {children}
            </table>
        </div>
    );
};

export const TableHeader = ({ children, className = '' }) => {
    return (
        <thead>
            <tr className={`bg-[#f4f6f8] ${className}`}>
                {children}
            </tr>
        </thead>
    );
};

export const TableBody = ({ children, className = '' }) => {
    return (
        <tbody className={`divide-y divide-[#ebebeb] ${className}`}>
            {children}
        </tbody>
    );
};

export const TableRow = ({ children, className = '', isSelected = false, ...props }) => {
    return (
        <tr 
            className={`hover:bg-slate-50/40 transition-colors ${isSelected ? 'bg-[#f0f9f7]/20' : ''} ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
};

export const TableCell = ({ children, className = '', align = 'left', ...props }) => {
    return (
        <td 
            className={`py-2 px-4 text-[13px] text-slate-800 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} ${className}`}
            {...props}
        >
            {children}
        </td>
    );
};

export const TableHeadCell = ({ children, className = '', align = 'left', isFirst = false, isLast = false, ...props }) => {
    return (
        <th 
            className={`px-4 py-3 text-[12px] font-bold text-[#6d7175] bg-[#f4f6f8] uppercase tracking-wider border-b-0 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} ${isFirst ? 'rounded-tl-[6px]' : ''} ${isLast ? 'rounded-tr-[6px]' : ''} ${className}`}
            {...props}
        >
            {children}
        </th>
    );
};
