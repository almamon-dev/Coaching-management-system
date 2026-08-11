import React from 'react';
import { Link } from '@inertiajs/react';

export default function CampusLifeSection({ galleries = [] }) {
    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full mb-2">Coaching Environment & Activities</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Coaching Life & Academic Activities</h2>
                        <p className="text-slate-600 text-[13px] leading-relaxed">আমাদের কোচিং সেন্টারের আধুনিক ক্লাসরুম, মডেল টেস্ট সেশন, বিশেষ কুইজ প্রতিযোগিতা এবং আনন্দঘন শিখন পরিবেশের কিছু মুহূর্ত:</p>
                    </div>
                    <Link href="/gallery" className="shrink-0 px-5 py-2 border-2 border-[#009ca6] text-[#009ca6] hover:bg-[#009ca6] hover:text-white rounded-[3px] font-bold transition-all text-xs">
                        View Photo Gallery
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[450px]">
                    {galleries.length > 0 ? galleries.map((gallery, index) => {
                        let spanClass = "";
                        if (index === 0) spanClass = "md:col-span-2 md:row-span-2";
                        else if (index === 1) spanClass = "md:col-span-2";

                        return (
                            <div key={gallery.id || index} className={`${spanClass} rounded overflow-hidden relative group`}>
                                <img src={gallery.image} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 right-5">
                                    {gallery.category && (
                                        <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[10px] font-bold rounded mb-2 inline-block">
                                            {gallery.category}
                                        </span>
                                    )}
                                    <h3 className={`${index === 0 ? 'text-xl' : 'text-lg'} font-bold text-white leading-tight`}>
                                        {gallery.title}
                                    </h3>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="md:col-span-4 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg p-8">
                            <p className="text-slate-500 font-medium text-xs">No activity photos added yet. Manage gallery from admin panel.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
