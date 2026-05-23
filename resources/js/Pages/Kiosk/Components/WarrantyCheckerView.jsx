import React from 'react';
import TextInput from '@/Components/TextInput';

const WarrantyCheckerView = ({
    searchQuery,
    setSearchQuery,
    warrantyDetails,
    searching,
    error,
    handleSubmit
}) => {
    return (
        <div className="w-full max-w-md mx-auto space-y-6 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150">
            <div className="text-center space-y-2">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Check Device Warranty</h2>
                <p className="text-[#6d7175] text-[13px]">Look up active store warranty logs using your device Serial Number (S/N) or Ticket Number.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <TextInput
                    type="text"
                    placeholder="Serial S/N, IMEI, or Ticket..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 px-3 shadow-none"
                    required
                />
                <button
                    type="submit"
                    className="h-10 sm:h-auto px-5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[6px] font-bold text-[13px] transition-all whitespace-nowrap"
                >
                    {searching ? 'Checking...' : 'Check'}
                </button>
            </form>

            {error && <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-[6px] text-[12.5px] text-center font-bold">{error}</div>}

            {warrantyDetails && (
                <div className="bg-[#f4f6f8] border border-[#ebebeb] p-5 rounded-[6px] space-y-4 text-left animate-in zoom-in-98 duration-100">
                    <div className="border-b border-[#ebebeb] pb-3">
                        <h4 className="text-[11px] font-bold text-[#6d7175] tracking-wider">Device Specifications</h4>
                        <div className="font-extrabold text-[15px] text-[#202223] mt-1">{warrantyDetails.brand} {warrantyDetails.model_name}</div>
                        {warrantyDetails.serial_number && <div className="text-[11.5px] text-[#6d7175] mt-0.5">S/N: {warrantyDetails.serial_number}</div>}
                    </div>

                    <div className="space-y-2.5 text-[12.5px]">
                        <div className="flex justify-between">
                            <span className="text-[#6d7175]">Registered Owner</span>
                            <span className="font-bold text-[#202223]">{warrantyDetails.customer_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6d7175]">Linked Ticket</span>
                            <span className="font-bold text-[#202223]">{warrantyDetails.ticket_number}</span>
                        </div>
                    </div>

                    {warrantyDetails.has_warranty_info ? (
                        warrantyDetails.is_active ? (
                            <div className="p-3 bg-[#e4f1ef] border border-[#b3e0d5] text-[#008060] rounded-[6px] text-center font-bold text-[13px]">
                                ACTIVE WARRANTY <br />
                                <span className="text-[11px] font-medium text-[#6d7175]">Coverage ends: {warrantyDetails.warranty_ends_at}</span>
                            </div>
                        ) : (
                            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-[6px] text-center font-bold text-[13px]">
                                WARRANTY EXPIRED <br />
                                <span className="text-[11px] font-medium text-[#6d7175]">Ended on: {warrantyDetails.warranty_ends_at}</span>
                            </div>
                        )
                    ) : (
                        <div className="p-3 bg-amber-50 border border-amber-100 text-amber-750 rounded-[6px] text-center font-bold text-[13px]">
                            NO WARRANTY LOGGED <br />
                            <span className="text-[11px] font-medium text-[#6d7175]">Warranty details are not active or registered for this ticket.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WarrantyCheckerView;
