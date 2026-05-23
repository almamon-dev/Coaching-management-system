import { Check, Trash2, SquarePen, Image as ImageIcon } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';
import Notify from '@/Utils/Notify';

const BrandRow = ({
    brand,
    selected,
    onSelect,
    onDelete,
    visibleColumns
}) => {
    return (
        <tr className={cn(
            "group transition-colors h-[48px]",
            selected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]",
        )}>
            <td className="pl-4 pr-2 py-1 w-[45px]">
                <div
                    onClick={() => onSelect(brand.id)}
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

            {/* Brand Name & Logo */}
            {visibleColumns.includes('brand') && (
                <td className="px-4 py-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb]">
                            {brand.logo ? (
                                <img
                                    src={`/storage/${brand.logo}`}
                                    alt={brand.name}
                                    className="w-full h-full object-contain p-1"
                                />
                            ) : (
                                <ImageIcon size={14} className="text-[#bababa]" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-[#202223] hover:text-[#008060] transition-colors leading-tight truncate">
                                {brand.name}
                            </span>
                            {brand.is_featured ? (
                                <span className="text-[10px] font-bold text-[#008060] tracking-tight mt-0.5 uppercase">Featured Brand</span>
                            ) : (
                                <span className="text-[10px] font-bold text-[#6d7175] tracking-tight mt-0.5 uppercase">Standard Brand</span>
                            )}
                        </div>
                    </div>
                </td>
            )}

            {/* Slug */}
            {visibleColumns.includes('slug') && (
                <td className="px-4 py-1 text-center">
                    <code className="text-[11px] text-[#6d7175] font-bold bg-[#f7f7f7] px-1.5 py-0.5 rounded-[2px] border border-[#ebebeb] tracking-tight whitespace-nowrap">/{brand.slug}</code>
                </td>
            )}

            {/* Product Count */}
            {visibleColumns.includes('products') && (
                <td className="px-4 py-1 text-center">
                    <span className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-[2px] font-bold text-[11px]",
                        brand.products_count > 0 ? "bg-[#e4f1ef] text-[#008060] border border-[#d1e9e5]" : "text-[#bababa]"
                    )}>
                        {brand.products_count || 0}
                    </span>
                </td>
            )}

            {/* Status */}
            {visibleColumns.includes('status') && (
                <td className="px-4 py-1 text-center">
                    <StatusDropdown
                        value={brand.status}
                        options={[
                            { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                            { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                        ]}
                        onChange={(newVal) => {
                            router.patch(route('admin.brands.status', brand.id), {
                                status: newVal
                            }, { preserveScroll: true });
                        }}
                    />
                </td>
            )}

            {/* Created At */}
            {visibleColumns.includes('created_at') && (
                <td className="px-4 py-1 text-center whitespace-nowrap">
                    <span className="text-[11px] text-[#6d7175]">
                        {new Date(brand.created_at).toLocaleDateString()}
                    </span>
                </td>
            )}

            {/* Actions */}
            <td className="px-6 py-1 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={route('admin.brands.edit', brand.id)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                        title="Edit Brand"
                    >
                        <SquarePen size={12} />
                    </Link>
                    <button
                        onClick={() => onDelete(brand.id, brand.name)}
                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                        title="Delete Brand"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default BrandRow;
