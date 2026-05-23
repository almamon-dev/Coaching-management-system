import React from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import Notify from '@/Utils/Notify';

const QuestionModal = ({ isOpen, onClose, product }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        question: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('frontend.product.question.store', product.id), {
            onSuccess: () => {
                Notify.success('Question Submitted', 'Your question has been sent to our experts.');
                reset();
                onClose();
            },
            onError: () => Notify.error('Submission Failed', 'Please provide a valid question.'),
            preserveScroll: true
        });
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300"
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
                    <h2 className="text-[20px] font-bold text-[#081621] mb-1">Ask a Question</h2>
                    <p className="text-[13px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
                        Product: <span className="text-[#4f46e5] font-medium">{product.name}</span>
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[12px] font-bold text-slate-700 uppercase mb-2 tracking-wide">Your Question *</label>
                            <textarea
                                required
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                className={`w-full border ${errors.question ? 'border-red-500' : 'border-slate-200'} rounded-sm p-3.5 text-[14px] min-h-[110px] focus:ring-1 focus:ring-[#3749bb] outline-none transition-all bg-[#f9fafb] placeholder:text-slate-400`}
                                placeholder="Type your question here..."
                            ></textarea>
                            {errors.question && <p className="text-red-500 text-[11px] mt-1 font-bold">{errors.question}</p>}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#3749bb] text-white font-bold rounded-sm hover:bg-[#2e3d9e] transition-all text-[13px] flex items-center gap-2 disabled:opacity-70 shadow-sm"
                            >
                                {processing ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                Submit Question
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

export default QuestionModal;
