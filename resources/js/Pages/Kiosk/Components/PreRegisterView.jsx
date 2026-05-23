import React from 'react';
import { ArrowRight } from 'lucide-react';
import TextInput from '@/Components/TextInput';

const PreRegisterView = ({
    name,
    setName,
    phone,
    setPhone,
    deviceType,
    setDeviceType,
    brand,
    setBrand,
    modelName,
    setModelName,
    serialNumber,
    setSerialNumber,
    customerNotes,
    setCustomerNotes,
    error,
    isSubmitting,
    handleSubmit
}) => {
    return (
        <div className="w-full max-w-lg mx-auto space-y-5 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150">
            <div className="text-center space-y-1">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Pre-Register Repair Details</h2>
                <p className="text-[#6d7175] text-[13px]">Provide your device info. The assigned counter technician will instantly pull up this data.</p>
            </div>

            {error && <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-[6px] text-[12px] font-bold text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Your Name *</label>
                        <TextInput
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Phone Number *</label>
                        <TextInput
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Device Type *</label>
                        <select
                            value={deviceType}
                            onChange={e => setDeviceType(e.target.value)}
                            className="w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5"
                        >
                            <option value="Smartphone">Smartphone</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Desktop PC">Desktop PC</option>
                            <option value="Smartwatch">Smartwatch</option>
                            <option value="Console/Other">Console/Other</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Device Brand *</label>
                        <TextInput
                            type="text"
                            placeholder="E.g. Apple, Samsung"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Model Name/Number *</label>
                        <TextInput
                            type="text"
                            placeholder="E.g. Galaxy S23 Ultra"
                            value={modelName}
                            onChange={e => setModelName(e.target.value)}
                            className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Serial Number (Optional)</label>
                        <TextInput
                            type="text"
                            placeholder="S/N or IMEI"
                            value={serialNumber}
                            onChange={e => setSerialNumber(e.target.value)}
                            className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 shadow-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10.5px] font-bold text-[#6d7175] tracking-wider">Describe the Problem / Symptoms *</label>
                    <textarea
                        placeholder="E.g. broken screen, battery drain, liquid damage..."
                        value={customerNotes}
                        onChange={e => setCustomerNotes(e.target.value)}
                        rows={2}
                        className="w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2 px-2.5"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#008060] hover:bg-[#006e52] text-white py-3 rounded-[6px] font-bold text-[14px] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-1"
                >
                    {isSubmitting ? 'Submitting details...' : 'Pre-Register & Print Token'}
                    <ArrowRight size={15} />
                </button>
            </form>
        </div>
    );
};

export default PreRegisterView;
