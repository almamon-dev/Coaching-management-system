import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

const TagInput = ({ value = '', onChange, placeholder = 'Add tags...', className }) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null);

    // Sync internal tags with the external comma-separated string value
    useEffect(() => {
        if (value && typeof value === 'string') {
            const parsedTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            // Only update if the tags are actually different to avoid infinite loops
            if (JSON.stringify(parsedTags) !== JSON.stringify(tags)) {
                setTags(parsedTags);
            }
        } else {
            setTags([]);
        }
    }, [value]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addTag = (tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag];
            setTags(newTags);
            onChange(newTags.join(', '));
        }
        setInputValue('');
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        onChange(newTags.join(', '));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const handleBlur = () => {
        if (inputValue) {
            addTag(inputValue);
        }
    };

    return (
        <div 
            className={cn(
                "flex flex-wrap gap-1.5 p-1 w-full rounded-[4px] border border-[#d1d1d1] bg-white min-h-[32px] focus-within:border-[#008060] focus-within:ring-1 focus-within:ring-[#008060] transition-all cursor-text shadow-sm",
                className
            )}
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag, index) => (
                <span 
                    key={index} 
                    className="flex items-center gap-1 bg-[#f1f1f1] text-[#202223] px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold border border-[#d1d1d1]"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(index);
                        }}
                        className="text-[#6d7175] hover:text-[#bf0711] transition-colors"
                    >
                        <X size={10} />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none focus:ring-0 p-0.5 text-[12px] text-[#202223] placeholder:text-[#bababa]"
            />
        </div>
    );
};

export default TagInput;
