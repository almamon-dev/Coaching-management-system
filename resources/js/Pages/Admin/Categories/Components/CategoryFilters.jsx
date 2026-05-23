import React from 'react';
import { Search, ChevronDown, Trash2 } from 'lucide-react';

const CategoryFilters = ({ 
    search, 
    handleSearch, 
    status, 
    handleStatusChange, 
    filters, 
    updateFilters, 
    selectedIds, 
    setSelectedIds, 
    stats 
}) => {
    return (
        <div className="bg-white rounded-t-[16px] overflow-visible">
            {/* Tabs */}
            <div className="px-7 pt-4 border-b border-[#f1f2f4]">
                <div className="flex gap-8">
                    {['all', 'active', 'inactive'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`pb-4 text-[14px] font-bold transition-all relative flex items-center gap-2 ${
                                status === s ? 'text-[#008060]' : 'text-[#6d7175] hover:text-[#202223]'
                            }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)} Categories
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                                status === s ? 'bg-[#e4f1ef] text-[#008060]' : 'bg-[#f1f1f1] text-[#6d7175]'
                            }`}>
                                {s === 'all' ? stats.total : s === 'active' ? stats.active : stats.inactive}
                            </span>
                            {status === s && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008060] rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Integrated Action Bar */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white overflow-visible">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search */}
                    <div className="relative w-full max-w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a3af]" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search categories by name or slug..."
                            className="w-full h-[36px] pl-12 pr-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-medium focus:outline-none focus:border-[#008060] focus:ring-0 transition-all placeholder:text-[#6d7175]"
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative group">
                        <button className="h-[40px] px-4 border border-[#e3e4e8] rounded-[8px] text-[13px] font-medium text-[#2f3344] flex items-center gap-3 bg-white hover:bg-slate-50 transition-all">
                            Status
                            {status !== 'all' && (
                                <span className="text-[#008060] capitalize ml-1 border-l pl-2 border-[#ebebeb]">{status}</span>
                            )}
                            <ChevronDown size={14} className="text-[#727586] ml-2" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-[#e3e4e8] rounded-[8px] shadow-lg py-1 z-[200] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            {['all', 'active', 'inactive'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#f6f6f7] transition-all capitalize ${status === s ? 'text-[#008060] font-bold' : 'text-[#6d7175]'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button 
                            onClick={() => setSelectedIds([])}
                            className="text-[13px] font-bold text-[#008060] hover:underline"
                        >
                            Deselect All
                        </button>
                        <button className="h-[40px] px-4 bg-red-50 border border-red-100 text-red-600 rounded-[8px] text-[13px] font-bold flex items-center gap-2 hover:bg-red-100 transition-all">
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryFilters;
