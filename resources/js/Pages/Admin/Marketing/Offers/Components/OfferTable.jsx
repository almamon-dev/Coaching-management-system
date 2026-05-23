import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Check, Search, SquarePen, Trash2, Calendar, Globe, MapPin, Eye } from 'lucide-react';
import StatusDropdown from '@/Components/StatusDropdown';
import OfferSkeleton from './OfferSkeleton';
import { cn } from '@/lib/utils';

const OfferTable = ({ 
    offers, 
    selectedIds, 
    toggleSelectAll, 
    toggleSelect, 
    handleDeleteClick, 
    isProcessing, 
    visibleColumns = [], 
    selectAllAcrossPages 
}) => {
    const isAllOnPageSelected = offers.data.length > 0 && offers.data.every(item => selectedIds.includes(item.id));

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
                <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                    <tr>
                        <th className="pl-4 pr-2 py-2.5 w-[45px]">
                            <div
                                onClick={toggleSelectAll}
                                className={cn(
                                    "w-[17px] h-[17px] border-[1.5px] rounded-[3px] cursor-pointer transition-all flex items-center justify-center",
                                    selectAllAcrossPages || isAllOnPageSelected
                                        ? "bg-[#008060] border-[#008060]"
                                        : "bg-white border-[#d1d1d1] hover:border-[#8c8c8c]"
                                )}
                            >
                                {selectAllAcrossPages || isAllOnPageSelected ? (
                                    <Check size={11} strokeWidth={4} className="text-white" />
                                ) : selectedIds.length > 0 ? (
                                    <div className="w-2.5 h-[1.5px] bg-slate-500"></div>
                                ) : null}
                            </div>
                        </th>
                        {visibleColumns.includes('offer') && <th className="px-4 py-2.5 w-[400px]">Offer Banner & Details</th>}
                        {visibleColumns.includes('store_type') && <th className="px-4 py-2.5 text-center w-[150px]">Store / Location</th>}
                        {visibleColumns.includes('duration') && <th className="px-4 py-2.5 text-center w-[240px]">Campaign Period</th>}
                        {visibleColumns.includes('status') && <th className="px-4 py-2.5 text-center w-[130px]">Status</th>}
                        <th className="px-6 py-2.5 text-right w-[160px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                    {isProcessing ? (
                        Array.from({ length: offers.data?.length || 5 }).map((_, i) => <OfferSkeleton key={i} />)
                    ) : offers.data.length > 0 ? (
                        offers.data.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            const isOnlineOnly = item.store_type?.toLowerCase().includes('online');
                            return (
                                <tr 
                                    key={item.id} 
                                    className={cn(
                                        "group transition-colors h-[54px]",
                                        isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#f6f6f7]"
                                    )}
                                >
                                    <td className="pl-4 pr-2 py-1 w-10">
                                        <div
                                            onClick={() => toggleSelect(item.id)}
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
                                    {visibleColumns.includes('offer') && (
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-2.5">
                                                {/* Image Thumbnail */}
                                                <div className="w-12 h-8 rounded-[4px] bg-[#f7f7f7] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#ebebeb] group-hover:border-[#008060]/30 transition-all">
                                                    <img 
                                                        src={item.image || 'https://www.startech.com.bd/image/catalog/logo.png'} 
                                                        alt={item.title} 
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[12px] font-bold text-[#202223] group-hover:text-[#008060] transition-colors leading-tight truncate">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-[10px] text-[#6d7175] font-bold mt-0.5 uppercase tracking-tight flex items-center gap-1.5">
                                                        <span>ID: #OFF-{item.id.toString().padStart(4, '0')}</span>
                                                        <span className="text-[#ebebeb]">|</span>
                                                        <span className="font-mono text-slate-400 lowercase">/{item.slug}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('store_type') && (
                                        <td className="px-4 py-1">
                                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#202223]">
                                                {isOnlineOnly ? (
                                                    <Globe size={13} className="text-[#3749bb]" />
                                                ) : (
                                                    <MapPin size={13} className="text-[#ef4a23]" />
                                                )}
                                                <span>{item.store_type || 'Online'}</span>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('duration') && (
                                        <td className="px-4 py-1">
                                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#6d7175]">
                                                <Calendar size={13} className="text-slate-400" />
                                                <span>
                                                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.includes('status') && (
                                        <td className="px-4 py-1 text-center">
                                            <StatusDropdown
                                                value={item.status ? 1 : 0}
                                                options={[
                                                    { label: 'Active', value: 1, color: 'text-[#008060]', dot: 'bg-[#008060]', bg: 'bg-[#e4f1ef]' },
                                                    { label: 'Inactive', value: 0, color: 'text-[#6d7175]', dot: 'bg-[#6d7175]', bg: 'bg-[#f6f6f7]' }
                                                ]}
                                                onChange={(newVal) => {
                                                    router.patch(route('admin.marketing.offers.status', item.id), { status: newVal }, { preserveScroll: true });
                                                }}
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-1 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <a 
                                                href={route('offers.show', item.slug)} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-slate-100 text-slate-500 rounded-[2px] hover:bg-slate-200 transition-all"
                                                title="Preview details"
                                            >
                                                <Eye size={12} />
                                            </a>
                                            <Link
                                                href={route("admin.marketing.offers.edit", item.id)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#3151fe] text-white rounded-[2px] hover:bg-[#1a39d1] transition-all"
                                                title="Edit Offer"
                                            >
                                                <SquarePen size={12} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(item.id, item.title)}
                                                className="h-[26px] w-[26px] flex items-center justify-center bg-[#ff4d4f] text-white rounded-[2px] hover:bg-[#cf1322] transition-all"
                                                title="Delete Offer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 2} className="px-7 py-24 text-center text-[#727586]">
                                <Search size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                <p className="text-lg font-bold">No offers found</p>
                                <p className="text-sm">Try refining your search or filters.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OfferTable;
