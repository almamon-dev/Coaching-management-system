import React from 'react';
import { Printer } from 'lucide-react';
import TextInput from '@/Components/TextInput';

const ThermalInvoiceView = ({
    searchQuery,
    setSearchQuery,
    foundTickets,
    activeInvoice,
    setActiveInvoice,
    searching,
    error,
    handleSubmit,
    handlePrintInvoice
}) => {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 bg-white border border-[#ebebeb] p-5 sm:p-8 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in duration-150 print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none">
            <div className="text-center space-y-2 print:hidden">
                <h2 className="text-[22px] font-extrabold text-[#202223]">Find & Print Invoice</h2>
                <p className="text-[#6d7175] text-[13px]">Enter your Ticket Number (REP-XXXX-XXXX) to instantly view and print a thermal invoice receipt.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 print:hidden">
                <TextInput
                    type="text"
                    placeholder="REP-XXXX-XXXX..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-10 w-full text-[13px] bg-white border border-[#babfc3] text-[#202223] rounded-[6px] focus:border-[#008060] focus:ring-0 py-2.5 px-3 shadow-none"
                    required
                />
                <button
                    type="submit"
                    className="h-10 sm:h-auto px-5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[6px] font-bold text-[13px] transition-all"
                >
                    {searching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-[6px] text-[13px] text-center font-bold print:hidden">{error}</div>}

            {foundTickets.length > 0 && !activeInvoice && (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar print:hidden">
                    <h4 className="text-[11.5px] font-bold text-[#6d7175] tracking-wider text-left">Tickets Found</h4>
                    <div className="space-y-2">
                        {foundTickets.map(t => (
                            <div 
                                key={t.id}
                                onClick={() => setActiveInvoice(t)}
                                className="bg-white border border-[#ebebeb] p-3.5 rounded-[6px] flex items-center justify-between cursor-pointer hover:border-[#008060] transition-colors text-left"
                            >
                                <div>
                                    <div className="font-extrabold text-[#202223] text-[13.5px]">{t.ticket_number}</div>
                                    <div className="text-[12px] text-[#6d7175]">{t.brand} {t.model_name} • Status: {t.status}</div>
                                </div>
                                <button className="h-[28px] px-3 bg-[#008060] text-white rounded-[6px] text-[11px] font-bold hover:bg-[#006e52]">
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Printer Layout sheet (Visible in print too) */}
            {activeInvoice && (
                <div className="space-y-4 animate-in zoom-in-98 duration-100">
                    <div className="p-6 bg-white text-slate-950 rounded-[6px] text-left border border-slate-200 max-w-md mx-auto relative font-mono text-[12px] leading-relaxed shadow-lg print:border-0 print:shadow-none print:p-0">
                        <div className="text-center space-y-1 border-b border-slate-300 pb-3">
                            <h3 className="text-[16px] font-black tracking-tight text-slate-900">GADGET SERVICE HUB</h3>
                            <p className="text-[10px] text-slate-500">Motijheel Branch, Dhaka</p>
                            <p className="text-[10px] text-slate-500 font-bold tracking-wider mt-1">--- SERVICE INVOICE RECEIPT ---</p>
                        </div>

                        <div className="space-y-1 py-3 border-b border-dashed border-slate-350 text-slate-800">
                            <div>Date: <span className="font-bold">{new Date(activeInvoice.created_at).toLocaleString()}</span></div>
                            <div>Ticket #: <span className="font-bold text-slate-900">{activeInvoice.ticket_number}</span></div>
                            {activeInvoice.token_number && <div>Token: <span className="font-bold">{activeInvoice.token_number}</span></div>}
                            <div>Client: <span className="font-bold">{activeInvoice.customer?.name}</span></div>
                            <div>Phone: <span className="font-bold">{activeInvoice.customer?.phone}</span></div>
                        </div>

                        <div className="space-y-1 py-3 border-b border-dashed border-slate-350 text-slate-800">
                            <div className="font-bold text-[12px] mb-1">REPAIR ITEM:</div>
                            <div>Device: <span className="font-bold">{activeInvoice.brand} {activeInvoice.model_name}</span></div>
                            {activeInvoice.serial_number && <div>S/N: <span className="font-bold">{activeInvoice.serial_number}</span></div>}
                            <div>Servicing Status: <span className="font-bold text-[#008060]">{activeInvoice.status}</span></div>
                        </div>

                        <div className="py-3 border-b border-slate-300 space-y-1 text-slate-800">
                            <div className="flex justify-between font-bold text-[12px] border-b border-slate-200 pb-1">
                                <span>DESCRIPTION</span>
                                <span>AMOUNT</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Hardware Servicing Fee</span>
                                <span>৳ {Number(activeInvoice.service_cost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Spare Parts Used</span>
                                <span>৳ {Number(activeInvoice.parts_cost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-[13px] border-t border-slate-200 pt-1 text-slate-900">
                                <span>GRAND TOTAL</span>
                                <span>৳ {Number(activeInvoice.total_cost || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="text-center pt-3 text-[10px] text-slate-500 space-y-1">
                            <p className="font-bold">Thank you for choosing Gadget Service Hub!</p>
                            <p>All servicing includes 30 days active store warranty.</p>
                            <p>--- Customer Copy ---</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 print:hidden">
                        <button
                            onClick={() => setActiveInvoice(null)}
                            className="h-[34px] px-4 border border-[#babfc3] text-[#202223] bg-white rounded-[6px] font-bold hover:bg-[#f4f6f8] text-[12px] transition-colors"
                        >
                            Clear View
                        </button>
                        <button
                            onClick={handlePrintInvoice}
                            className="h-[34px] px-5 bg-[#008060] hover:bg-[#006e52] text-white rounded-[6px] font-bold flex items-center gap-1.5 text-[12px] transition-colors active:scale-[0.98] shadow-sm"
                        >
                            <Printer size={14} />
                            Print Receipt (thermal)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThermalInvoiceView;
