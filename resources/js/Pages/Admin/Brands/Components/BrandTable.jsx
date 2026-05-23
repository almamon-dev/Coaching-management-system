import React from 'react';
import { Check, Search } from 'lucide-react';
import BrandSkeleton from './BrandSkeleton';
import BrandRow from './BrandRow';

const BrandTable = ({
    brands,
    filters,
    selectedIds,
    selectAllAcrossPages,
    toggleSelectAll,
    toggleSelect,
    handleDelete,
    isProcessing,
    activeTab,
    stats,
    visibleColumns = []
}) => {
    const isAllOnPageSelected = brands.data.length > 0 && brands.data.every(brand => selectedIds.includes(brand.id));
    const shouldShowSkeletons = isProcessing && (stats?.[activeTab] > 0 || stats?.[activeTab] === undefined);

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1200px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={`w-[18px] h-[18px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center ${selectAllAcrossPages || isAllOnPageSelected
                                    ? "bg-[#008060] border-[#008060]"
                                    : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                    }`}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('brand') && <th className="px-4 py-2.5 w-[350px]">Brand</th>}
                        {visibleColumns.includes('slug') && <th className="px-4 py-2.5 text-center w-[120px]">Slug</th>}
                        {visibleColumns.includes('products') && <th className="px-4 py-2.5 text-center w-[100px]">Products</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px]">Status</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 text-center w-[150px]">Date</th>}
                        <th className="px-6 py-2.5 text-right w-[160px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {shouldShowSkeletons ? (
                        Array.from({ length: brands.data?.length > 0 ? brands.data.length : 5 }).map((_, i) => (
                            <BrandSkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : brands.data?.length > 0 ? (
                        brands.data.map((brand) => (
                            <BrandRow
                                key={brand.id}
                                brand={brand}
                                selected={selectAllAcrossPages || selectedIds.includes(brand.id)}
                                onSelect={toggleSelect}
                                onDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[16px] font-bold text-[#202223]">No brands found</p>
                                <p className="text-[13px] text-[#6d7175] mt-1">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BrandTable;
