import React from 'react';
import { Search, X } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';

export default function TableSearch({ value, onChange, placeholder = "Search...", className = "w-[320px]" }) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
            <TextInput
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-[32px] pl-9 pr-8 w-full text-[13px] bg-white"
            />
            {value && (
                <button 
                    onClick={() => onChange({ target: { value: '' } })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#202223] transition-colors"
                    type="button"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
