import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StatusDropdown Component
 * A Shopify-inspired custom dropdown for inline status management.
 */
const StatusDropdown = ({ value, options, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate position when opening
    const handleToggle = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
        setIsOpen(!isOpen);
    };

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className={cn("inline-block text-left", className)}>
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                className={cn(
                    "inline-flex items-center justify-between w-full px-2.5 py-1 rounded-[3px] text-[10px] font-bold transition-all gap-1.5 focus:outline-none min-w-[90px] whitespace-nowrap border border-transparent shadow-none",
                    selectedOption.bg,
                    selectedOption.color,
                    isOpen && "ring-1 ring-[#008060] border-[#008060]"
                )}
            >
                <div className="flex items-center gap-1.5">
                    <div className={cn("w-1 h-1 rounded-full", selectedOption.dot)}></div>
                    {selectedOption.label}
                </div>
                <ChevronDown size={12} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu using Portal */}
            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    style={{ 
                        position: 'absolute', 
                        top: coords.top + 4, 
                        left: coords.left,
                        minWidth: '130px',
                        zIndex: 99999
                    }}
                    className="origin-top-left bg-white border border-[#ebebeb] rounded-[4px] shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 ease-out"
                >
                    {options.map((option) => {
                        const isCurrent = option.value === value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-medium transition-colors",
                                    isCurrent ? "text-[#008060] bg-[#f0f9f7]" : "text-[#202223] hover:bg-[#f6f6f7]"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", option.dot)}></div>
                                    {option.label}
                                </div>
                                {isCurrent && <Check size={10} strokeWidth={3} className="text-[#008060]" />}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
};

export default StatusDropdown;
