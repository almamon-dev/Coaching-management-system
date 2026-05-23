import React from 'react';
import { Laptop, AlertCircle, Home, ShieldCheck } from 'lucide-react';

export default function FeatureLinks() {
    const features = [
        { icon: <Laptop size={24} />, title: "Laptop Finder", desc: "Find Your Laptop Easily", color: "bg-[#4f46e5]" },
        { icon: <AlertCircle size={24} />, title: "Raise a Complain", desc: "Share your experience", color: "bg-[#0d6efd]" },
        { icon: <Home size={24} />, title: "Home Service", desc: "Get expert help", color: "bg-[#673ab7]" },
        { icon: <ShieldCheck size={24} />, title: "Servicing Center", desc: "Repair Your Device", color: "bg-[#2e7d32]" },
    ];

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                        <div className={`${f.color} w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                            {f.icon}
                        </div>
                        <div>
                            <h4 className="text-[15px] font-bold text-[#081621]">{f.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
