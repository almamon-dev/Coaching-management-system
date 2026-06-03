import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link } from '@inertiajs/react';

export default function Gallery() {
    const images = [
        { src: '/images/campus_sports.png', title: 'Annual Sports Meet', category: 'Sports' },
        { src: '/images/campus_culture.png', title: 'Cultural Festival', category: 'Events' },
        { src: '/images/campus_academics.png', title: 'Outdoor Learning', category: 'Academics' },
        { src: '/images/campus_facilities.png', title: 'Campus View', category: 'Facilities' },
    ];

    return (
        <FrontendLayout>
            <Head title="Photo Gallery - Lohadi High School" />

            {/* Header */}
            <div className="bg-[#16a34a] text-white py-16">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Photo Gallery</h1>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Explore the vibrant campus life, events, and activities of Lohadi High School through our photo gallery.
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 md:px-8 py-16 max-w-8xl">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button className="px-6 py-2 bg-[#16a34a] text-white font-bold rounded-full text-sm">All Photos</button>
                    <button className="px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-full text-sm transition-colors">Sports</button>
                    <button className="px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-full text-sm transition-colors">Events</button>
                    <button className="px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-full text-sm transition-colors">Academics</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, index) => (
                        <div key={index} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/3] w-full bg-slate-100">
                                <img src={img.src} alt={img.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2 inline-block">
                                        {img.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white">{img.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/" className="inline-block px-8 py-3 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </FrontendLayout>
    );
}
