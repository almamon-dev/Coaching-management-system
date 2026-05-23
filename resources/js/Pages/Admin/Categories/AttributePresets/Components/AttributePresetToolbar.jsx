import { Search, X, RotateCcw } from 'lucide-react';
import TextInput from "@/Components/TextInput";
import { cn } from '@/lib/utils';
import ColumnManager from './ColumnManager';
import AttributePresetBulkActionBar from './AttributePresetBulkActionBar';

const AttributePresetToolbar = ({
    search = "",
    setSearch,
    onReset,
    selectedIds = [],
    handleBulkDeleteClick,
    allColumns = [],
    visibleColumns = [],
    toggleColumn,
    totalCount = 0,
    perPageCount = 0,
    handleClearSelection,
    selectAllAcrossPages = false,
    onSelectAllAcrossPages,
    showOnlySelected = false,
    setShowOnlySelected,
}) => {

    const activeFilterCount = 0;

    return (
        <div className="border-b border-[#ebebeb] bg-white relative z-30">
            {/* Bulk Action Bar Overlay (Floating style) */}
            {(selectedIds.length > 0 || selectAllAcrossPages) && (
                <AttributePresetBulkActionBar
                    selectedCount={selectedIds.length}
                    totalCount={totalCount}
                    perPageCount={perPageCount}
                    onClear={handleClearSelection}
                    onBulkDelete={handleBulkDeleteClick}
                    selectAllAcrossPages={selectAllAcrossPages}
                    onSelectAllAcrossPages={handleSelectAllAcrossPages}
                    showOnlySelected={showOnlySelected}
                    setShowOnlySelected={setShowOnlySelected}
                />
            )}

            <div className={cn(
                "p-3 flex items-center justify-between gap-4 transition-opacity duration-200",
                selectedIds.length > 0 || selectAllAcrossPages ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                {/* Search Box */}
                <div className="relative w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search presets..."
                        className="h-[32px] pl-9 pr-9 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[3px] placeholder:text-[#6d7175] font-medium text-[12px] shadow-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters & Settings Group */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="flex items-center gap-1.5">
                        {/* Reset Button */}
                        <button
                            onClick={onReset}
                            className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group"
                            title="Reset Filters"
                        >
                            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        </button>

                        <div className="w-[1px] h-4 bg-[#ebebeb] mx-1" />

                        {/* Column Management */}
                        <ColumnManager
                            columns={allColumns}
                            visibleColumns={visibleColumns}
                            toggleColumn={toggleColumn}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttributePresetToolbar;
