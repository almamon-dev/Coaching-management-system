import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check, Search, SearchX, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SelectInput({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = "",
    name = "",
    multiple = false,
    disabled = false,
    showSearch = true,
    direction = "auto",
    onCreate: onCreateProp,
    icon: Icon,
    children
}) {
    // Extract options from children if they exist (standard native pattern)
    const childOptions = React.Children.toArray(children)
        .filter(child => React.isValidElement(child))
        .map(child => ({
            id: child.props.value !== undefined ? child.props.value : child.key,
            name: child.props.children,
            image: child.props['data-image'] || child.props.image
        }))
        .filter(opt => opt.id !== undefined);

    const [searchQuery, setSearchQuery] = useState('');
    const [openUp, setOpenUp] = useState(direction === 'up');
    const [maxDropdownHeight, setMaxDropdownHeight] = useState(240);
    const containerRef = useRef(null);

    const finalOptions = options.length > 0 ? options : childOptions;

    // Filter options based on search query
    const filteredOptions = finalOptions.filter(opt =>
        String(opt.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper to get raw value from potential objects
    const getRawValue = (val) => {
        if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? v.value : v);
        if (typeof val === 'object' && val !== null) return val.value || "";
        return val ?? "";
    };

    const rawValue = getRawValue(value);
    const normalizedValue = multiple
        ? (Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []))
        : rawValue;

    // Handle selection display
    const getSelectedDisplay = () => {
        if (multiple) {
            const selectedItems = finalOptions.filter(opt =>
                Array.isArray(normalizedValue) && normalizedValue.map(v => String(v)).includes(String(opt.id))
            );
            return selectedItems.length > 0 ? selectedItems.map(i => i.name).join(', ') : placeholder;
        }
        const selected = finalOptions.find(opt => String(opt.id) === String(normalizedValue));
        return selected ? selected.name : placeholder;
    };

    const isSelected = (id) => {
        if (multiple) {
            return Array.isArray(normalizedValue) && normalizedValue.map(v => String(v)).includes(String(id));
        }
        return String(normalizedValue) === String(id);
    };

    const handleChange = (val) => {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: val
                }
            });
        }
    };

    const checkPosition = () => {
        if (direction === 'up') {
            setOpenUp(true);
            return;
        }
        if (direction === 'down') {
            setOpenUp(false);
            return;
        }
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            let spaceBelow = window.innerHeight - rect.bottom;
            let spaceAbove = rect.top;

            // Check if trapped inside any scrollable container (e.g., modal)
            let parent = containerRef.current.parentElement;
            while (parent && parent !== document.body && parent !== document.documentElement) {
                const style = window.getComputedStyle(parent);
                if (/(auto|scroll|hidden)/.test(style.overflow + style.overflowY)) {
                    const parentRect = parent.getBoundingClientRect();
                    spaceBelow = Math.min(spaceBelow, parentRect.bottom - rect.bottom);
                    spaceAbove = Math.min(spaceAbove, rect.top - parentRect.top);
                    break;
                }
                parent = parent.parentElement;
            }

            const shouldUp = (spaceBelow < 220 && spaceAbove > spaceBelow) || (spaceBelow < 170 && spaceAbove > 170);
            const availableSpace = shouldUp ? spaceAbove : spaceBelow;
            const computedMax = Math.max(140, Math.min(250, availableSpace - 16));

            setOpenUp(shouldUp);
            setMaxDropdownHeight(computedMax);
        }
    };

    return (
        <div ref={containerRef} className={cn("w-full relative", className, disabled && "opacity-60 cursor-not-allowed pointer-events-none")}>
            <Listbox value={normalizedValue} onChange={handleChange} multiple={multiple} disabled={disabled}>
                {({ open }) => {
                    if (open) {
                        setTimeout(checkPosition, 0);
                    }

                    return (
                        <div className={cn("relative h-full", open && "z-40")}>
                            <Listbox.Button 
                                onClick={checkPosition}
                                className={cn(
                                    "relative w-full h-full min-h-[34px] cursor-pointer rounded-[3px] border border-slate-200 bg-white py-1 pr-10 text-left text-[12px] font-medium text-slate-800 focus:outline-none focus:ring-0 focus:border-slate-300 transition-all flex items-center",
                                    Icon ? "pl-9" : "pl-3"
                                )}
                            >
                                {Icon && (
                                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-[#8c9196]">
                                        <Icon size={14} aria-hidden="true" />
                                    </span>
                                )}
                                <span className={cn("block", multiple ? "break-words whitespace-normal pb-0.5" : "truncate")}>
                                    {getSelectedDisplay()}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                                    <ChevronDown size={14} className={cn("transition-transform duration-150", open && "rotate-180")} aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                show={open}
                                as={Fragment}
                                afterLeave={() => setSearchQuery('')}
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Listbox.Options 
                                    style={{ maxHeight: `${maxDropdownHeight}px` }}
                                    className={cn(
                                        "absolute z-[100] w-full overflow-hidden rounded-[3px] bg-white text-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-slate-200 focus:outline-none flex flex-col",
                                        openUp ? "bottom-full mb-1" : "top-full mt-1"
                                    )}
                                >
                                    {/* Search Input Container */}
                                    {showSearch && (
                                        <div className="p-1.5 bg-[#F3F4F7] shrink-0 border-b border-[#EEEEEE]">
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full h-7 px-2.5 text-[12px] bg-[#F3F4F7] border-none focus:ring-0 outline-none placeholder:text-slate-400 font-medium"
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    )}

                                    {/* Options List */}
                                    <div 
                                        style={{ maxHeight: `${Math.max(100, maxDropdownHeight - (showSearch ? 45 : 0))}px` }}
                                        className="overflow-y-auto py-1 flex-1 custom-scrollbar"
                                    >
                                        {filteredOptions.length === 0 && !onCreateProp ? (
                                            <div className="py-10 px-4 flex flex-col items-center justify-center text-slate-400 gap-2">
                                                <SearchX size={32} strokeWidth={1} />
                                                <span className="text-[11px] font-medium uppercase tracking-wider">No results found</span>
                                            </div>
                                        ) : (
                                            <>
                                                {filteredOptions.map((option, idx) => {
                                                    const active = isSelected(option.id);
                                                    return (
                                                        <Listbox.Option
                                                            key={idx}
                                                            className={({ active: isHovered }) =>
                                                                cn(
                                                                    "relative cursor-pointer select-none py-1.5 px-3 border-b border-slate-50/50 last:border-0 flex items-center justify-between",
                                                                    active ? "text-[#16a34a] font-bold bg-emerald-50/40" : "text-[#202223] font-medium",
                                                                    isHovered ? "bg-slate-50 text-[#16a34a]" : ""
                                                                )
                                                            }
                                                            value={option.id}
                                                        >
                                                            {() => (
                                                                <>
                                                                    <span className="truncate">{option.name}</span>
                                                                    {active && <Check size={14} className="text-[#16a34a] shrink-0 ml-2" />}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                </Listbox.Options>
                            </Transition>
                        </div>
                    );
                }}
            </Listbox>
        </div>
    );
}
