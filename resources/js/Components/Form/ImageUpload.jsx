import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Check } from 'lucide-react';

export default function ImageUpload({
    value,
    onChange,
    label,
    error,
    placeholder = "PNG, JPG, WebP up to 10MB",
    recommended,
    accept = "image/png,image/jpeg,image/jpg,image/webp",
    aspectRatio = "video", // "video" (16:9), "square" (1:1), "banner" (21:9), "auto"
    className = "",
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');

    useEffect(() => {
        if (!value) {
            setPreviewUrl('');
            setFileName('');
            setFileSize('');
            return;
        }

        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreviewUrl(objectUrl);
            setFileName(value.name);
            const sizeInKb = (value.size / 1024).toFixed(1);
            setFileSize(sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${sizeInKb} KB`);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof value === 'string') {
            setPreviewUrl(value);
            setFileName(value.split('/').pop() || 'Current Image');
            setFileSize('');
        }
    }, [value]);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file (PNG, JPG, WebP).');
            return;
        }

        if (onChange) {
            onChange(file);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onChange) {
            onChange(null);
        }
    };

    const getAspectClass = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square max-h-56';
            case 'banner': return 'aspect-[21/9] max-h-56';
            case 'auto': return 'min-h-[140px] max-h-72';
            case 'video':
            default:
                return 'aspect-[16/9] max-h-60';
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-bold text-[#2f3344] leading-[20px]">
                        {label}
                    </label>
                    {recommended && (
                        <span className="text-[10.5px] text-slate-400 font-normal">
                            {recommended}
                        </span>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
            />

            {previewUrl ? (
                /* PREVIEW STATE WITH CONTROLS */
                <div className="relative rounded-[4px] border border-slate-200 overflow-hidden bg-slate-50 group shadow-2xs">
                    <div className={`w-full overflow-hidden flex items-center justify-center bg-slate-900/5 ${getAspectClass()}`}>
                        <img
                            src={previewUrl}
                            alt="Uploaded Preview"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/banner.png';
                            }}
                        />
                    </div>

                    {/* Gradient Overlay & Info Bar */}
                    <div className="p-3 bg-white border-t border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-[3px] bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0">
                                <ImageIcon size={14} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                                    {fileName}
                                </p>
                                {fileSize ? (
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{fileSize} • Ready to upload</p>
                                ) : (
                                    <p className="text-[10px] text-[#16a34a] font-semibold mt-0.5 flex items-center gap-1">
                                        <Check size={10} /> Active Image
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-[3px] transition-colors flex items-center gap-1 cursor-pointer"
                                title="Change Image"
                            >
                                <RefreshCw size={12} />
                                <span>Change</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[3px] transition-colors cursor-pointer"
                                title="Remove Image"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* EMPTY UPLOAD DROPZONE */
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`w-full border-2 border-dashed rounded-[4px] p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                        isDragging
                            ? 'border-[#16a34a] bg-emerald-50/70 scale-[0.99]'
                            : 'border-slate-300 hover:border-[#16a34a] hover:bg-slate-50/80 bg-white'
                    }`}
                >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center transition-transform group-hover:scale-110">
                        <UploadCloud size={24} />
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800">
                            <span className="text-[#16a34a] hover:underline">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[11px] text-slate-400">
                            {placeholder}
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}

