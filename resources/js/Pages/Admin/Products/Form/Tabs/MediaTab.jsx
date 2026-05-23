import React from 'react';
import { Upload, X, Trash2, Plus, Image as ImageIcon, Info } from 'lucide-react';

const MediaTab = ({
    data, setData, previews,
    handleThumbnailChange, removeThumbnail, handleGalleryChange, removeGalleryImage
}) => {
    return (
        <div className="space-y-4 ">
            {/* Standard Header */}
            <div className="border-b border-[#f6f6f7] pb-3 mb-2">
                <h3 className="text-[14px] font-bold text-[#202223] mb-1">Media Assets</h3>
                <p className="text-[12px] text-[#6d7175]">Upload a primary thumbnail and gallery images. Recommended size: 800x800px.</p>
            </div>

            {/* High-Density Integrated Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">

                {/* Primary Thumbnail (Takes 2x2 space but more compact ratio) */}
                <div className="col-span-2 row-span-2 relative aspect-[4/3] md:aspect-square bg-white border border-[#ebebeb] rounded-[4px] group overflow-hidden shadow-sm">
                    <div className="absolute top-1.5 left-1.5 z-10">
                        <span className="px-1.5 py-0.5 bg-[#e4f1ef] text-[#008060] text-[8px] font-bold uppercase tracking-tight rounded-[2px] border border-[#008060]/10 shadow-sm">Primary Image</span>
                    </div>

                    {previews.thumbnail ? (
                        <div className="w-full h-full p-1.5 flex items-center justify-center bg-white">
                            <img src={previews.thumbnail} className="max-w-full max-h-full object-contain" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                type="button"
                                onClick={removeThumbnail}
                                className="absolute top-1.5 right-1.5 h-6 w-6 bg-white border border-[#ebebeb] flex items-center justify-center text-[#ff4d4f] hover:bg-[#fbeae5] rounded-[2px] shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-3 text-center hover:bg-[#f9fafb] transition-colors">
                            <div className="w-8 h-8 bg-[#f4f6f8] rounded-full flex items-center justify-center mb-1.5 group-hover:bg-[#e4f1ef] transition-all">
                                <Upload size={16} className="text-[#6d7175] group-hover:text-[#008060] transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold text-[#6d7175]">Add main image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                        </label>
                    )}
                </div>

                {/* Gallery Items */}
                {previews.gallery.map((src, idx) => (
                    <div key={idx} className="relative aspect-square bg-white border border-[#ebebeb] rounded-[4px] group overflow-hidden shadow-sm">
                        <img src={src} className="w-full h-full object-contain p-1.5" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="h-6 w-6 bg-white border border-[#ebebeb] flex items-center justify-center text-[#ff4d4f] hover:bg-[#fbeae5] rounded-[2px]"
                            >
                                <Trash2 size={11} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add More Slot (Matches gallery size) */}
                <label className="aspect-square bg-[#f9fafb] border border-dashed border-[#d1d1d1] rounded-[4px] flex flex-col items-center justify-center cursor-pointer hover:border-[#008060] hover:bg-[#e4f1ef]/10 transition-all text-[#6d7175] group">
                    <Plus size={16} className="group-hover:scale-110 transition-transform group-hover:text-[#008060]" />
                    <span className="text-[9px] font-bold uppercase mt-0.5 group-hover:text-[#008060]">Add Media</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleGalleryChange} />
                </label>
            </div>

            {/* Hint Section */}
            <div className="flex items-start gap-3 bg-[#f9fafb] p-3 border border-[#ebebeb] rounded-[4px]">
                <div className="w-5 h-5 bg-[#008060]/10 flex items-center justify-center rounded-[2px] flex-shrink-0">
                    <Info size={12} className="text-[#008060]" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-[#202223]">Pro Tip: Optimization</p>
                    <p className="text-[11px] text-[#6d7175] leading-relaxed">
                        Use a <span className="text-[#202223] font-bold underline decoration-[#008060]/30 underline-offset-2">clear, high-resolution photo</span> on a white background for best results.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MediaTab;
