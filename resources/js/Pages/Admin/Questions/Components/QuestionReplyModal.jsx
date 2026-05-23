import React from 'react';
import Modal from '@/Components/Modal';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { X } from 'lucide-react';

const QuestionReplyModal = ({ replyingTo, onClose, data, setData, post, processing, errors }) => {
    if (!replyingTo) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post();
    };

    return (
        <Modal show={!!replyingTo} onClose={onClose} maxWidth="xl">
            <div className="bg-white">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-[#081621] text-[15px] uppercase tracking-tight">
                        {replyingTo.answer ? 'Edit Reply' : 'Answer Question'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* User Question Context */}
                    <div className="mb-6 p-4 bg-[#f8fafc] border border-[#ebebeb] rounded-[4px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 tracking-wider">Customer Question</span>
                        <p className="text-[13px] text-[#081621] font-bold italic leading-relaxed">
                            "{replyingTo.question}"
                        </p>
                        <div className="mt-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                            — Asked by <span className="text-[#ef4a23]">{replyingTo.user?.name || 'Guest'}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="answer" value="Your Answer *" className="mb-2 text-[12px] font-bold uppercase text-slate-600 tracking-wide" />
                            <TextArea
                                id="answer"
                                autoFocus
                                required
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                className={`min-h-[160px] ${errors.answer ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#ef4a23]'}`}
                                placeholder="Type your professional reply here..."
                            />
                            <InputError message={errors.answer} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <SecondaryButton 
                                type="button" 
                                onClick={onClose} 
                                className="h-[36px] px-6 rounded-[4px] font-bold text-[11px] uppercase tracking-wider border-[#d1d1d1]"
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton 
                                disabled={processing} 
                                className="h-[36px] px-8 bg-[#ef4a23] hover:bg-[#d83a1a] rounded-[4px] font-bold text-[11px] uppercase tracking-wider border-none shadow-sm transition-all"
                            >
                                {processing ? 'Saving...' : 'Post Answer'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default QuestionReplyModal;
