import React from 'react';
import { User, Phone, ArrowRight } from 'lucide-react';
import TextInput from '@/Components/TextInput';

const QuickTokenView = ({
    name,
    setName,
    phone,
    setPhone,
    error,
    isSubmitting,
    handleSubmit
}) => {
    return (
        <div className="w-full max-w-md mx-auto space-y-6 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150">
            <div className="text-center space-y-2">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Get Queue Token</h2>
                <p className="text-[#6d7175] text-[13px]">Input your phone and name. System automatically assigns an empty technician counter desk.</p>
            </div>

            {error && <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-[6px] text-[12px] font-bold text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-3.5">
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Your Full Name *</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><User size={15} /></span>
                            <TextInput
                                type="text"
                                placeholder="E.g. Al-Mamon"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="pl-9 h-10 w-full text-[13.5px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Phone Number *</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Phone size={15} /></span>
                            <TextInput
                                type="tel"
                                placeholder="E.g. 01712345678"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="pl-9 h-10 w-full text-[13.5px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#008060] hover:bg-[#006e52] text-white py-3 rounded-[6px] font-bold text-[14px] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-1"
                >
                    {isSubmitting ? 'Generating...' : 'Generate Ticket'}
                    <ArrowRight size={15} />
                </button>
            </form>
        </div>
    );
};

export default QuickTokenView;
