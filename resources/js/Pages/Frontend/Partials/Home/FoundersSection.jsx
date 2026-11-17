import React from 'react';

export default function FoundersSection({ founders = [] }) {
    if (!founders || founders.length === 0) {
        return null; // Don't show the section if there are no founders
    }

    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="bg-white/60 backdrop-blur-md rounded-sm p-6 md:p-8 shadow-sm border border-[#16a34a]/20">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/3 text-center md:text-left">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">Our Heritage</div>
                            <h2 className="text-2xl md:text-[26px] font-black text-slate-900 mb-3 leading-tight">Founders & Land Donors</h2>
                            <p className="text-slate-600 mb-5 text-[13px] leading-relaxed">
                                The foundation of Ullash Coaching Center was made possible by the visionary educationists and dedicated mentors who believed in student excellence and academic progress.
                            </p>
                            <button className="text-[#16a34a] font-bold text-[13px] hover:text-[#15803d] flex items-center justify-center md:justify-start gap-1.5 transition-colors">
                                View Full History <span>→</span>
                            </button>
                        </div>

                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                            {founders.map((founder, index) => (
                                <div key={founder.id || index} className="bg-white p-3.5 rounded shadow-sm border border-slate-100 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                                        <img 
                                            src={founder.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(founder.name)}&background=16a34a&color=fff`} 
                                            alt={founder.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-0.5">{founder.name}</h4>
                                        <p className="text-[9px] text-[#16a34a] font-bold uppercase tracking-wider mb-1">{founder.role}</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">{founder.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
