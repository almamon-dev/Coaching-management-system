import React from 'react';
import { Check, Trash2, SquarePen, FileText, Globe } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/Common/StatusDropdown';

const PageRow = ({
    page,
    selected,
    onSelect,
    onDelete,
    visibleColumns
}) => {
    const isSystemPage = ['our-story', 'careers', 'privacy-policy', 'terms-and-conditions'].includes(page.slug);

    return (
        <tr className={cn(
            "group transition-colors h-[48px]",
            selected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]",
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => onSelect(page.id)}
                    className={cn(
                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                        selected
                            ? "bg-[#008060] border-[#008060]"
                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                    )}
                >
                    {selected && <Check size={11} strokeWidth={4} className="text-white" />}
                </div>
            </td>

            {/* Page Title */}
            {visibleColumns.includes('title') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center border border-[#ebebeb]">
                            <FileText size={14} className="text-[#bababa]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-[#202223] leading-tight truncate">
                                {page.title}
                            </span>
                            {isSystemPage ? (
                                <span className="text-[9px] font-bold text-[#008060] tracking-tight mt-0.5 uppercase">System Locked Page</span>
                            ) : (
                                <span className="text-[9px] font-bold text-[#6d7175] tracking-tight mt-0.5 uppercase">Dynamic User Page</span>
                            )}
                        </div>
                    </div>
                </td>
            )}

            {/* Slug / Path */}
            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1 text-center">
                    <code className="text-[11px] text-[#6d7175] font-bold bg-[#f7f7f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb] tracking-tight whitespace-nowrap">/info/{page.slug}</code>
                </td>
            )}

            {/* Search Engine Metadata */}
            {visibleColumns.includes('meta') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2 max-w-[280px]">
                        <Globe size={13} className="text-slate-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11.5px] font-semibold text-slate-700 truncate leading-none">
                                {page.meta_title || 'No Meta Title'}
                            </span>
                            <span className="text-[10.5px] text-slate-400 truncate mt-1 leading-none">
                                {page.meta_description || 'No Meta Description'}
                            </span>
                        </div>
                    </div>
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={page.is_active ? 1 : 0}
                        options={[
                            { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.patch(route('admin.pages.status', page.id), {
                                is_active: newVal === 1
                            }, { preserveScroll: true });
                        }}
                    />
                </td>
            )}

            {/* Last Updated */}
            {visibleColumns.includes('updated_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className="text-[11px] text-[#6d7175]">
                        {new Date(page.updated_at).toLocaleDateString()}
                    </span>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.pages.edit', page.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Edit Page"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => !isSystemPage && onDelete(page)}
                        disabled={isSystemPage}
                        className={cn(
                            "h-[26px] w-[26px] flex items-center justify-center rounded-[2px] transition-all",
                            isSystemPage
                                ? "bg-slate-50 border border-slate-100 text-slate-350 cursor-not-allowed"
                                : "bg-[#ff4d4f] text-white hover:bg-[#cf1322]"
                        )}
                        title={isSystemPage ? "System page cannot be deleted" : "Delete Page"}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default PageRow;
