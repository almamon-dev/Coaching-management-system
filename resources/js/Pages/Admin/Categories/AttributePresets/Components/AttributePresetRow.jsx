import React from 'react';
import { SquarePen, Trash2, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const AttributePresetRow = ({ preset, isSelected, onToggle, onDelete, visibleColumns = [] }) => {
    return (
        <tr className={cn(
            "group hover:bg-[#f6f6f7] transition-colors h-[48px]",
            isSelected ? "bg-[#f4f6f8]" : ""
        )}>
            {/* Selection Checkbox */}
            <td className="pl-4 pr-2 py-1">
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="w-4 h-4 rounded-[3px] border-[#d1d1d1] text-[#008060] focus:ring-[#008060] focus:ring-offset-0 cursor-pointer"
                    />
                </div>
            </td>

            {/* Template Name & Icon */}
            {visibleColumns.includes('name') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#e4f1ef] flex-shrink-0 flex items-center justify-center border border-[#c3e0d9]">
                            <Sparkles size={13} className="text-[#008060]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Link 
                                href={route('admin.categories.attribute-presets.edit', preset.id)}
                                className="text-[12px] font-bold text-[#202223] hover:underline truncate leading-tight"
                            >
                                {preset.name}
                            </Link>
                            <span className="text-[10px] text-[#6d7175] font-medium mt-0.5">
                                {preset.fields?.length || 0} field{preset.fields?.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </td>
            )}

            {/* Slug */}
            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1">
                    <code className="text-[11px] text-[#6d7175] font-bold tracking-tight bg-[#f6f6f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb]">
                        {preset.slug}
                    </code>
                </td>
            )}

            {/* Fields Count */}
            {visibleColumns.includes('fields') && (
                <td className="px-4 py-1 text-center">
                    <span className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-[2px] font-bold text-[11px]",
                        (preset.fields?.length || 0) > 0
                            ? "bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]"
                            : "bg-[#f1f2f3] text-[#bababa]"
                    )}>
                        {preset.fields?.length || 0}
                    </span>
                </td>
            )}

            {/* Created Date */}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 whitespace-nowrap">
                    <span className="text-[12px] text-[#6d7175] font-medium">
                        {new Date(preset.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1.5">
                    <Link 
                        href={route('admin.categories.attribute-presets.edit', preset.id)}
                        className="h-[30px] w-[30px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all shadow-sm"
                        title="Edit Template"
                    >
                        <SquarePen size={14} />
                    </Link>
                    <button 
                        onClick={() => onDelete(preset.id, preset.name)}
                        className="h-[30px] w-[30px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all shadow-sm"
                        title="Delete Template"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AttributePresetRow;
