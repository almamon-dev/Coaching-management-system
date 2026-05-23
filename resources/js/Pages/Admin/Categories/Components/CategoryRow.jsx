import { Check, Trash2, Settings2, SquarePen, Eye, X, ChevronDown, ChevronUp, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';
import { useState } from 'react';
import Notify from '@/Utils/Notify';

const CategoryRow = ({ category, isSelected, toggleSelect, handleDelete, visibleColumns }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
        <tr className={cn(
            "group transition-colors h-[48px]",
            isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]",
            isExpanded ? "bg-[#f4f6f8] border-b-0" : ""
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => toggleSelect(category.id)}
                    className={cn(
                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                        isSelected
                            ? "bg-[#008060] border-[#008060]"
                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                    )}
                >
                    {isSelected && <Check size={11} strokeWidth={4} className="text-white" />}
                </div>
            </td>
            {visibleColumns.includes('category') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb]">
                            {category.image ? (
                                <img
                                    src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-contain p-1"
                                />
                            ) : (
                                <ImageIcon size={14} className="text-[#bababa]" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Link
                                href={category.parent_id ? '#' : route('admin.categories.index', { root_id: category.id })}
                                className="text-[12px] font-bold text-[#202223] hover:text-[#008060] hover:underline transition-colors leading-tight truncate"
                            >
                                {category.name}
                            </Link>
                            {category.parent_id ? (
                                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                                    <div className="flex items-center gap-1 text-[10px] text-[#6d7175] font-medium truncate">
                                        <Link 
                                            href={route('admin.categories.index', { root_id: category.parent_id })}
                                            className="truncate max-w-[100px] text-[#005bd3] hover:underline transition-colors"
                                        >
                                            {category.parent_name}
                                        </Link>
                                        <ChevronRight size={10} strokeWidth={3} className="flex-shrink-0 text-[#008060]" />
                                        <span className="text-[#202223] font-bold truncate">{category.name}</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-[#6d7175] tracking-tight mt-0.5 uppercase">Root Category</span>
                            )}
                        </div>
                    </div>
                </td>
            )}
            {visibleColumns.includes('parent') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#202223] font-bold uppercase tracking-tight truncate">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {category.parent_name || 'Main Catalog'}
                    </div>
                </td>
            )}
            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1 text-center">
                    <code className="text-[11px] text-[#6d7175] font-bold bg-[#f7f7f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb] tracking-tight whitespace-nowrap">/{category.slug}</code>
                </td>
            )}

            {visibleColumns.includes('products') && (
                <td className="px-4 py-1 text-center">
                    <span className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-[2px] font-bold text-[11px]",
                        category.products_count > 0 ? "bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]" : "text-[#bababa]"
                    )}>
                        {category.products_count}
                    </span>
                </td>
            )}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={category.is_active ? 1 : 0}
                        options={[
                            { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.patch(route('admin.categories.status', category.id), {
                                is_active: newVal === 1
                            }, { preserveScroll: true });
                        }}
                    />
                </td>
            )}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className="text-[11px] text-[#6d7175]">
                        {new Date(category.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">

                    <Link
                        href={route("admin.categories.edit", category.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Edit Category"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Category"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>

        </>
    );
};

export default CategoryRow;
