import React, { useState } from 'react';
import { X, Star, Loader2, Send, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import Notify from '@/Utils/Notify';

const ReviewModal = ({ isOpen, onClose, product }) => {
    const [hover, setHover] = useState(0);
    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 0,
        comment: '',
        images: null,
        videos: null,
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.rating === 0) {
            Notify.error('Rating Required', 'Please select a star rating.');
            return;
        }

        post(route('frontend.product.review.store', product.id), {
            forceFormData: true,
            onSuccess: () => {
                Notify.success('Review Submitted', 'Thank you for sharing your experience!');
                reset();
                onClose();
            },
            onError: () => Notify.error('Submission Failed', 'Please check your review content.'),
            preserveScroll: true
        });
    };


    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-[700px] overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <div className="p-7">
                    <h2 className="text-[20px] font-bold text-[#081621] mb-1">Write a Review</h2>
                    <p className="text-[13px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
                        Product: <span className="text-[#4f46e5] font-medium">{product.name}</span>
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Star Rating */}
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 uppercase mb-2 tracking-wide">Your Rating *</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="transition-all hover:scale-110 active:scale-95"
                                        onClick={() => setData('rating', star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        <Star
                                            size={28}
                                            className={star <= (hover || data.rating) ? "fill-[#4f46e5] text-[#4f46e5]" : "text-slate-200"}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.rating}</p>}
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 uppercase mb-2 tracking-wide">Your Review *</label>
                            <textarea
                                required
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                className={`w-full border ${errors.comment ? 'border-red-500' : 'border-slate-200'} rounded-sm p-3.5 text-[14px] min-h-[110px] focus:ring-1 focus:ring-[#3749bb] outline-none transition-all bg-[#f9fafb] placeholder:text-slate-400`}
                                placeholder="Share your experience with this product..."
                            ></textarea>
                            {errors.comment && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.comment}</p>}
                        </div>

                        <div className="flex gap-3 pb-2">
                            <div>
                                <input
                                    type="file"
                                    id="review-images"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('images', Array.from(e.target.files))}
                                />
                                <label
                                    htmlFor="review-images"
                                    className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-sm hover:border-[#3749bb] hover:text-[#3749bb] transition-all group"
                                >
                                    <ImageIcon size={18} className="text-slate-400 group-hover:text-[#3749bb]" />
                                    <span className="text-[12px] font-bold text-slate-500 group-hover:text-[#3749bb]">
                                        {data.images ? `${data.images.length} photos` : 'Add Photos'}
                                    </span>
                                </label>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    id="review-videos"
                                    multiple
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => setData('videos', Array.from(e.target.files))}
                                />
                                <label
                                    htmlFor="review-videos"
                                    className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-sm hover:border-[#3749bb] hover:text-[#3749bb] transition-all group"
                                >
                                    <VideoIcon size={18} className="text-slate-400 group-hover:text-[#3749bb]" />
                                    <span className="text-[12px] font-bold text-slate-500 group-hover:text-[#3749bb]">
                                        {data.videos ? `${data.videos.length} videos` : 'Add Video'}
                                    </span>
                                </label>
                            </div>
                        </div>
                        {errors.images && <p className="text-red-500 text-[11px] mt-0 font-bold">{errors.images}</p>}
                        {errors.videos && <p className="text-red-500 text-[11px] mt-0 font-bold">{errors.videos}</p>}

                        <div className="flex flex-wrap gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#3749bb] text-white font-bold rounded-sm hover:bg-[#2e3d9e] transition-all text-[13px] flex items-center gap-2 disabled:opacity-70 shadow-sm"
                            >
                                {processing ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                Submit Review
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-sm hover:bg-slate-50 transition-all text-[13px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
