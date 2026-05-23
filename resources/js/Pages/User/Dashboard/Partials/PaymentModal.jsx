import React from 'react';
import { X, Lock } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const PaymentModal = ({
    show,
    onClose,
    formData,
    handleInputChange,
    handleSubmit,
    errors,
    expiryRef,
    cvvRef
}) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-[2px] shadow-2xl w-full max-w-[500px] overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <div className="p-7">
                    <h2 className="text-[20px] font-bold text-[#081621] mb-1 font-sans">Add Payment Card</h2>
                    <p className="text-[13px] text-slate-500 mb-6 pb-3 border-b border-slate-100 font-sans">
                        Safe and secure SSL encrypted payment processing
                    </p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <InputLabel value="Cardholder Name" className="text-[13px] font-medium text-slate-600 font-sans" />
                            <TextInput
                                type="text"
                                value={formData.holder}
                                onChange={(e) => handleInputChange('holder', e.target.value)}
                                placeholder="Enter name on card"
                                className="w-full h-11 rounded-sm bg-white border-slate-200 focus:border-[#081621] focus:ring-0"
                                required
                                isFocused={true}
                            />
                            <InputError message={errors.holder} />
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel value="Card Number" className="text-[13px] font-medium text-slate-600 font-sans" />
                            <div className="relative">
                                <TextInput
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => handleInputChange('number', e.target.value)}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full h-11 pr-10 font-mono rounded-sm bg-white border-slate-200 focus:border-[#081621] focus:ring-0"
                                    required
                                />
                                <div className="absolute right-3 top-3 text-slate-300">
                                    <Lock size={14} />
                                </div>
                            </div>
                            <InputError message={errors.number} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <InputLabel value="Expiry Date" className="text-[13px] font-medium text-slate-600 font-sans" />
                                <TextInput
                                    type="text"
                                    ref={expiryRef}
                                    value={formData.expiry}
                                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                                    placeholder="MM / YY"
                                    className="w-full h-11 text-center rounded-sm bg-white border-slate-200 focus:border-[#081621] focus:ring-0"
                                    required
                                />
                                <InputError message={errors.expiry} />
                            </div>
                            <div className="space-y-1.5">
                                <InputLabel value="CVC / CVV" className="text-[13px] font-medium text-slate-600 font-sans" />
                                <TextInput
                                    type="password"
                                    ref={cvvRef}
                                    value={formData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                    placeholder="***"
                                    maxLength="3"
                                    className="w-full h-11 text-center rounded-sm bg-white border-slate-200 focus:border-[#081621] focus:ring-0"
                                    required
                                />
                                <InputError message={errors.cvv} />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 flex items-center gap-3">
                            <button
                                type="submit"
                                className="flex-1 h-11 bg-[#081621] text-white text-[14px] font-bold rounded-sm hover:bg-[#081621]/90 transition-all shadow-sm"
                            >
                                Save Card
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-11 border border-slate-200 text-slate-600 text-[14px] font-bold rounded-sm hover:bg-slate-50 transition-all"
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

export default PaymentModal;
