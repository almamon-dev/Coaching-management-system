import React from 'react';
import { Check, Search } from 'lucide-react';
import CategorySkeleton from './CategorySkeleton';
import CategoryRow from './CategoryRow';

const CategoryTable = ({ categories, filters, selectedIds, selectAllAcrossPages, toggleSelectAll, toggleSelect, handleDelete, isProcessing, activeTab, stats, visibleColumns = [] }) => {
    const isAllOnPageSelected = categories.data.length > 0 && categories.data.every(cat => selectedIds.includes(cat.id));
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
                        {visibleColumns.includes('category') && <th className="px-4 py-2.5 w-[350px]">Category</th>}
                        {visibleColumns.includes('parent') && <th className="px-4 py-2.5 text-left w-[180px]">Parent</th>}
                        {visibleColumns.includes('slug') && <th className="px-4 py-2.5 text-center w-[120px]">Slug</th>}
                        {visibleColumns.includes('attributes') && <th className="px-4 py-2.5 text-center w-[100px]">Specs</th>}
                        {visibleColumns.includes('products') && <th className="px-4 py-2.5 text-center w-[100px]">Products</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px]">Status</th>}
                        {visibleColumns.includes('created_at') && <th className="px-4 py-2.5 text-center w-[150px]">Date</th>}
                        <th className="px-6 py-2.5 text-right w-[160px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb] bg-white">
                    {shouldShowSkeletons ? (
                        Array.from({ length: categories.data?.length > 0 ? categories.data.length : 5 }).map((_, i) => (
                            <CategorySkeleton key={`skeleton-${i}`} visibleColumns={visibleColumns} />
                        ))
                    ) : categories.data?.length > 0 ? (
                        categories.data.map((category) => (
                            <CategoryRow
                                key={category.id}
                                category={category}
                                isSelected={selectAllAcrossPages || selectedIds.includes(category.id)}
                                toggleSelect={toggleSelect}
                                handleDelete={handleDelete}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-[16px] font-bold text-[#202223]">No categories found</p>
                                <p className="text-[13px] text-[#6d7175] mt-1">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
