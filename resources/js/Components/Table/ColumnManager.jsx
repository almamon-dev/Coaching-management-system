import React, { useState, useRef, useEffect } from "react";
import { Settings2, Check } from "lucide-react";

export default function ColumnManager({
    columns = [],
    visibleColumns = [],
    toggleColumn,
    onResetColumns,
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleableColumns = columns.filter(
        (col) => (col.id || col.accessor) && (col.label || col.header) && (col.id || col.accessor) !== "actions"
    );

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border transition-all outline-none shadow-none cursor-pointer ${
                    isOpen
                        ? "bg-slate-100 border-slate-300 text-slate-900"
                        : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                }`}
                title="Visible columns"
            >
                <Settings2 size={15} className={isOpen ? "text-[#16a34a]" : "text-slate-500"} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-[210px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-[6px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans text-left">
                    <div className="p-3">
                        <div className="text-[11px] font-semibold text-slate-500 mb-1.5 px-0.5">
                            Visible Columns
                        </div>

                        <div className="space-y-0.5 max-h-[240px] overflow-y-auto no-scrollbar">
                            {toggleableColumns.map((col) => {
                                const colKey = col.id || col.accessor;
                                const colLabel = col.label || col.header;
                                const isVisible = visibleColumns.includes(colKey);

                                return (
                                    <div
                                        key={colKey}
                                        onClick={() => toggleColumn && toggleColumn(colKey)}
                                        className="flex items-center gap-2 py-1.5 px-1 rounded-[3px] hover:bg-slate-50 cursor-pointer select-none transition-colors"
                                    >
                                        <div
                                            className={`w-3.5 h-3.5 rounded-[3px] flex items-center justify-center transition-colors shrink-0 ${
                                                isVisible
                                                    ? "bg-[#16a34a] text-white"
                                                    : "border border-slate-300 bg-white"
                                            }`}
                                        >
                                            {isVisible && <Check size={10} strokeWidth={3.5} />}
                                        </div>
                                        <span
                                            className={`text-[12px] truncate flex-1 ${
                                                isVisible ? "text-slate-800 font-medium" : "text-slate-400"
                                            }`}
                                        >
                                            {colLabel}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {onResetColumns && (
                            <div className="pt-2 mt-1.5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onResetColumns}
                                    className="w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-900 py-0.5 transition-colors cursor-pointer"
                                >
                                    Reset to default
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
