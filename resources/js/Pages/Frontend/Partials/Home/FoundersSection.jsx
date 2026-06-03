import React from 'react';

export default function FoundersSection() {
    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="bg-white/60 backdrop-blur-md rounded-sm p-6 md:p-8 shadow-sm border border-[#16a34a]/20">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/3 text-center md:text-left">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">Our Heritage</div>
                            <h2 className="text-2xl md:text-[26px] font-black text-slate-900 mb-3 leading-tight">Founders & Land Donors</h2>
                            <p className="text-slate-600 mb-5 text-[13px] leading-relaxed">
                                The foundation of Lohadi High School was made possible by the visionary leaders and generous land donors who believed in the power of education for our village.
                            </p>
                            <button className="text-[#16a34a] font-bold text-[13px] hover:text-[#15803d] flex items-center justify-center md:justify-start gap-1.5 transition-colors">
                                View Full History <span>→</span>
                            </button>
                        </div>

                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                            {/* Founder 1 */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Founder+Name&background=16a34a&color=fff" alt="Founder" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-0.5">Late [Founder Name]</h4>
                                    <p className="text-[9px] text-[#16a34a] font-bold uppercase tracking-wider mb-1">Chief Founder</p>
                                    <p className="text-[11px] text-slate-500 leading-tight">Established the first academic building in 1942.</p>
                                </div>
                            </div>
                            {/* Donor 1 */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Land+Donor&background=009ca6&color=fff" alt="Donor" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-0.5">Late [Donor Name]</h4>
                                    <p className="text-[9px] text-[#009ca6] font-bold uppercase tracking-wider mb-1">Honorable Land Donor</p>
                                    <p className="text-[11px] text-slate-500 leading-tight">Donated land for the main campus and playground.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
