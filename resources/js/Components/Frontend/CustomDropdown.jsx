import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CustomDropdown Component
 * A stylized dropdown for sorting and filtering.
 */
const CustomDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value.toString()) || options[0];

    return (
        <div className="flex items-center gap-2" ref={dropdownRef}>
            <span className="text-[12px] font-bold text-slate-500">{label}:</span>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 min-w-[80px] bg-white border border-slate-200 rounded text-[12px] font-medium text-[#081621] hover:border-[#4f46e5] transition-all whitespace-nowrap"
                >
                    {selectedOption.label}
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-1 w-full min-w-[160px] bg-white border border-slate-200 rounded shadow-lg z-[100] py-1 overflow-hidden animate-in fade-in slide-in-from-top-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[12px] transition-colors whitespace-nowrap ${
                                    value.toString() === option.value 
                                    ? 'bg-[#3749bb] text-white' 
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
