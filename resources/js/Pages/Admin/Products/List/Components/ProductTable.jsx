import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Check, Trash2, Search, ExternalLink, Image as ImageIcon, Tag, FileText, Eye, SquarePen, MoreHorizontal, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusDropdown from '@/Components/StatusDropdown';
import ProductSkeleton from './ProductSkeleton';

const ProductTable = ({
    products,
    filters,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    handleDelete,
    isProcessing,
    visibleColumns = ['product', 'status', 'stock', 'category', 'brand', 'price']
}) => {
    const isAllOnPageSelected = products.data.length > 0 && products.data.every(p => selectedIds.includes(p.id));
    const activeColCount = visibleColumns.length + 2; // +2 for checkbox and actions

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    selectAllAcrossPages || isAllOnPageSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                )}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>

                        {visibleColumns.includes('product') && <th className="px-4 py-2.5 w-[240px]">Product</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 w-[90px]">Status</th>}
                        {visibleColumns.includes('stock') && <th className="px-4 py-2.5 w-[80px]">Stock</th>}
                        {visibleColumns.includes('category') && <th className="px-4 py-2.5 w-[120px]">Category</th>}
                        {visibleColumns.includes('brand') && <th className="px-4 py-2.5 w-[90px]">Brand</th>}
                        {visibleColumns.includes('price') && <th className="px-4 py-2.5 w-[90px] text-right">Price</th>}
                        {visibleColumns.includes('discount_price') && <th className="px-4 py-2.5 w-[90px] text-right">Discount</th>}
                        {visibleColumns.includes('is_featured') && <th className="px-4 py-2.5 w-[60px] text-center">Featured</th>}
                        {visibleColumns.includes('view_count') && <th className="px-4 py-2.5 w-[60px] text-right">Views</th>}
                        {visibleColumns.includes('has_emi') && <th className="px-4 py-2.5 w-[60px] text-center">EMI</th>}
                        {visibleColumns.includes('warranty') && <th className="px-4 py-2.5 w-[90px]">Warranty</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 w-[90px]">Created</th>}
                        {visibleColumns.includes('updated_at') && <th className="px-4 py-2.5 w-[90px]">Updated</th>}

                        <th className="px-6 py-2.5 text-right w-[130px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {isProcessing && (products.data?.length || 0) > 0 ? (
                        Array.from({ length: products.data.length }).map((_, i) => (
                            <ProductSkeleton key={i} visibleColumns={visibleColumns} />
                        ))
                    ) : (products.data?.length || 0) > 0 ? products.data.map((product) => (
                        <tr
                            key={product.id}
                            className={cn(
                                "group transition-colors h-[48px]",
                                selectAllAcrossPages || selectedIds.includes(product.id)
                                    ? "bg-[#f4f6f8]"
                                    : "hover:bg-[#f6f6f7]"
                            )}
                        >
                            <td className="pl-4 pr-2 py-1 w-[45px]">
                                <div
                                    onClick={() => toggleSelect(product.id)}
                                    className={cn(
                                        "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                        selectAllAcrossPages || selectedIds.includes(product.id)
                                            ? "bg-[#008060] border-[#008060]"
                                            : "bg-white border-[#d1d1d1] group-hover:border-[#8c8c8c]"
                                    )}
                                >
                                    {(selectAllAcrossPages || selectedIds.includes(product.id)) && (
                                        <Check size={11} strokeWidth={4} className="text-white" />
                                    )}
                                </div>
                            </td>

                            {visibleColumns.includes('product') && (
                                <td className="px-4 py-1">
                                    <div className="flex items-center gap-2.5">
                                        <Link
                                            href={route("admin.products.show", product.id)}
                                            className="w-8 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb]"
                                        >
                                            {product.primary_image ? (
                                                <img src={product.primary_image.full_url} className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon size={14} className="text-[#bababa]" />
                                            )}
                                        </Link>
                                        <div className="flex flex-col min-w-0">
                                            <Link
                                                href={route("admin.products.show", product.id)}
                                                className="text-[12px] text-[#202223] font-bold hover:underline truncate transition-colors leading-tight"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] font-medium text-[#6d7175]">#{product.sku}</span>
                                                {product.coupons_count > 0 && (
                                                    <div className="flex items-center gap-1 bg-[#e4f1ef] text-[#008060] px-1 py-0.5 rounded-[10px]">
                                                        <Tag size={8} />
                                                        <span className="text-[9px] font-bold">{product.coupons_count}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            )}

                            {visibleColumns.includes('status') && (
                                <td className="px-4 py-1">
                                    <StatusDropdown
                                        value={product.status}
                                        options={[
                                            { label: 'In Stock', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                                            { label: 'Out of Stock', value: 2, color: 'text-[#bf0711]', dot: 'bg-[#bf0711]', bg: 'bg-[#fbeae5]' },
                                            { label: 'Pre Order', value: 3, color: 'text-[#916a00]', dot: 'bg-[#916a00]', bg: 'bg-[#fff5ea]' },
                                            { label: 'Up Coming', value: 4, color: 'text-[#005bd3]', dot: 'bg-[#005bd3]', bg: 'bg-[#f0f5ff]' }
                                        ]}
                                        onChange={(newVal) => {
                                            router.patch(route('admin.products.status', product.id), {
                                                status: newVal
                                            }, { preserveScroll: true });
                                        }}
                                        className="!w-fit"
                                    />
                                </td>
                            )}

                            {visibleColumns.includes('stock') && (
                                <td className="px-4 py-1">
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-[12px] font-bold",
                                            product.stock > 0 ? "text-[#202223]" : "text-[#bf0711]"
                                        )}>
                                            {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                                        </span>
                                    </div>
                                </td>
                            )}

                            {visibleColumns.includes('category') && (
                                <td className="px-4 py-1">
                                    <div className="flex flex-col truncate leading-tight">
                                        <span className="text-[12px] text-[#202223] font-semibold truncate">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                        {(product.sub_category || product.sub_sub_category) && (
                                            <div className="flex items-center gap-1 mt-0.5 text-[#6d7175]">
                                                {product.sub_category && (
                                                    <span className="text-[10px] font-semibold truncate">
                                                        {product.sub_category.name}
                                                    </span>
                                                )}
                                                {product.sub_sub_category && (
                                                    <>
                                                        {product.sub_category && <ChevronRight size={10} strokeWidth={3} className="flex-shrink-0 text-[#008060]" />}
                                                        <span className="text-[10px] font-semibold truncate">
                                                            {product.sub_sub_category.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            )}

                            {visibleColumns.includes('brand') && (
                                <td className="px-4 py-1">
                                    <span className="text-[10px] bg-[#f1f1f1] text-[#6d7175] px-1.5 py-0.5 rounded-[3px] font-bold uppercase tracking-tight inline-block">
                                        {product.brand?.name || 'Local'}
                                    </span>
                                </td>
                            )}

                            {visibleColumns.includes('price') && (
                                <td className="px-4 py-1 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[12px] text-[#202223] font-bold">
                                            ৳{(parseFloat(product.price) || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                            )}

                            {visibleColumns.includes('discount_price') && (
                                <td className="px-4 py-1 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={cn(
                                            "text-[12px] font-bold",
                                            product.discount_price > 0 ? "text-[#008060]" : "text-[#bababa]"
                                        )}>
                                            {product.discount_price > 0 ? `৳${(parseFloat(product.discount_price) || 0).toLocaleString()}` : '—'}
                                        </span>
                                    </div>
                                </td>
                            )}

                            {visibleColumns.includes('is_featured') && (
                                <td className="px-4 py-1 text-center">
                                    {product.is_featured ? (
                                        <div className="flex justify-center">
                                            <Check size={14} className="text-[#008060]" />
                                        </div>
                                    ) : (
                                        <span className="text-[#bababa]">—</span>
                                    )}
                                </td>
                            )}

                            {visibleColumns.includes('view_count') && (
                                <td className="px-4 py-1 text-right">
                                    <span className="text-[12px] text-[#202223] font-medium">
                                        {(product.view_count || 0).toLocaleString()}
                                    </span>
                                </td>
                            )}

                            {visibleColumns.includes('has_emi') && (
                                <td className="px-4 py-1 text-center">
                                    {product.has_emi ? (
                                        <span className="text-[10px] bg-[#e4f1ef] text-[#008060] px-1.5 py-0.5 rounded-[4px] font-bold">
                                            EMI
                                        </span>
                                    ) : (
                                        <span className="text-[#bababa]">—</span>
                                    )}
                                </td>
                            )}

                            {visibleColumns.includes('warranty') && (
                                <td className="px-4 py-1">
                                    <span className="text-[11px] text-[#202223] font-medium truncate inline-block max-w-[120px]">
                                        {product.warranty || 'No Warranty'}
                                    </span>
                                </td>
                            )}

                            {visibleColumns.includes('created_at') && (
                                <td className="px-4 py-1">
                                    <span className="text-[11px] text-[#6d7175]">
                                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : '—'}
                                    </span>
                                </td>
                            )}

                            {visibleColumns.includes('updated_at') && (
                                <td className="px-4 py-1">
                                    <span className="text-[11px] text-[#6d7175]">
                                        {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : '—'}
                                    </span>
                                </td>
                            )}

                            <td className="px-6 py-1 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Link
                                        href={route("admin.products.show", product.id)}
                                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#8c8c8c] text-white rounded-[2px] hover:bg-[#595959] active:scale-90 transition-all"
                                        title="View Details"
                                    >
                                        <Eye size={12} />
                                    </Link>
                                    <a
                                        href={`/product/${product.slug}`}
                                        target="_blank"
                                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#1677ff] text-white rounded-[2px] hover:bg-[#0958d9] active:scale-90 transition-all"
                                        title="View on Website"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                    <Link
                                        href={route("admin.products.edit", product.id)}
                                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] active:scale-90 transition-all"
                                        title="Edit Product"
                                    >
                                        <SquarePen size={12} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] active:scale-90 transition-all"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={activeColCount} className="px-4 py-20 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-[#f7f7f7] rounded-full flex items-center justify-center mb-4">
                                        <Search size={32} className="text-[#bababa]" />
                                    </div>
                                    <p className="text-[16px] font-bold text-[#202223]">No products found</p>
                                    <p className="text-[13px] text-[#6d7175] mt-1">Try changing the filters or search term.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
