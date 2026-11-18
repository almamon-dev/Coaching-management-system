import React, { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Image as ImageIcon, X, ZoomIn } from 'lucide-react';

export default function Gallery({ dbGalleries = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [previewImage, setPreviewImage] = useState(null);

    const defaultImages = [
        { id: 'g1', src: '/images/ullash_classroom_model_test_01.jpg', title: 'Model Test Examination Session in AC Classroom', category: 'Academics' },
        { id: 'g2', src: '/images/ullash_farewell_gift_ceremony.jpg', title: 'HSC-2026 Batch Grand Farewell & Gift Pack Presentation', category: 'Events' },
        { id: 'g3', src: '/images/ullash_award_crest_01.jpg', title: 'Merit Crest Award Presentation to Top Achievers', category: 'Events' },
        { id: 'g4', src: '/images/ullash_campus_mentorship.jpg', title: 'Faculty Mentorship & Guidance in Front of Campus', category: 'Campus' },
        { id: 'g5', src: '/images/ullash_campus_female_batch.jpg', title: 'Female Students Academic Group Study on Campus', category: 'Campus' },
        { id: 'g6', src: '/images/ullash_farewell_classroom_celebration.jpg', title: 'Interactive Farewell Celebration & Student Gathering', category: 'Events' },
        { id: 'g7', src: '/images/ullash_classroom_model_test_02.jpg', title: 'Model Test Hall Examination with Attentive Students', category: 'Academics' },
        { id: 'g8', src: '/images/ullash_award_crest_06.jpg', title: 'Merit Crest Presentation to Female Achiever', category: 'Events' },
        { id: 'g9', src: '/images/ullash_roof_garden_batch.jpg', title: 'Campus Roof Garden Student Study Group', category: 'Campus' },
        { id: 'g10', src: '/images/ullash_guideline_seminar_session.jpg', title: 'Academic Guidance & Concept Discussion Session', category: 'Academics' },
        { id: 'g11', src: '/images/ullash_farewell_cake_hsc26.jpg', title: 'HSC-2026 Batch Celebration Cake Cutting', category: 'Events' },
        { id: 'g12', src: '/images/ullash_award_crest_02.jpg', title: 'Merit Award Presentation to Board Examinee', category: 'Events' },
        { id: 'g13', src: '/images/ullash_classroom_model_test_03.jpg', title: 'Focused Model Test Practice Session', category: 'Academics' },
        { id: 'g14', src: '/images/ullash_ict_batch_poster.jpg', title: 'New HSC ICT Batch Academic Launch', category: 'Academics' },
        { id: 'g15', src: '/images/ullash_award_crest_03.jpg', title: 'Merit Crest Presentation to Outstanding Student', category: 'Events' },
        { id: 'g16', src: '/images/ullash_center_banner.jpg', title: 'Official Ullash Coaching Center Banner', category: 'Campus' },
    ];

    const galleryList = (dbGalleries && dbGalleries.length > 0)
        ? [...dbGalleries, ...defaultImages.filter(d => !dbGalleries.some(g => g.title.toLowerCase() === d.title.toLowerCase()))]
        : defaultImages;

    const categories = ['All', 'Academics', 'Events', 'Facilities', 'Seminars', 'Campus'];

    const filteredImages = galleryList.filter(item => {
        if (selectedCategory === 'All') return true;
        return item.category?.toLowerCase() === selectedCategory.toLowerCase();
    });

    return (
        <FrontendLayout>
            <Head title={`Photo Gallery - ${centerName}`} />

            {/* Header Banner - Same Style Like Events */}
            <div className="bg-[#009ca6] text-white py-14 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Gallery</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        Photo Gallery
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Explore the vibrant campus life, academic milestones, and student activities of {centerName} through our photo collection.
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl font-inter">
                {/* Filter Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === cat
                                    ? 'bg-[#009ca6] text-white shadow-xs'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {cat} {cat === 'All' ? 'Photos' : ''}
                        </button>
                    ))}
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((img, index) => (
                        <div 
                            key={img.id || index} 
                            onClick={() => setPreviewImage(img)}
                            className="group relative rounded-[4px] overflow-hidden shadow-2xs border border-slate-200/90 bg-white cursor-pointer hover:shadow-md transition-all duration-300"
                        >
                            <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                                <img 
                                    src={img.image || img.src || '/images/ullash_classroom_model_test_01.jpg'} 
                                    alt={img.title} 
                                    loading="lazy" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                <span className="px-2.5 py-0.5 bg-[#009ca6] text-white text-[9.5px] font-bold uppercase tracking-wider rounded-[2px] mb-1.5 inline-block self-start">
                                    {img.category || 'CAMPUS'}
                                </span>
                                <h3 className="text-sm md:text-base font-bold text-white leading-snug flex items-center justify-between">
                                    <span>{img.title}</span>
                                    <ZoomIn size={16} className="text-emerald-300 shrink-0 ml-2" />
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredImages.length === 0 && (
                    <div className="p-12 text-center text-slate-400 bg-white rounded-[4px] border border-slate-200">
                        <ImageIcon size={36} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-semibold">No photos found in this category.</p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                    >
                        <span>← Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Lightbox Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-slate-900 rounded-[4px] overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <img 
                            src={previewImage.image || previewImage.src} 
                            alt={previewImage.title} 
                            className="w-full max-h-[80vh] object-contain bg-black"
                        />
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                                    {previewImage.category}
                                </span>
                                <h3 className="text-base font-bold text-white mt-0.5">
                                    {previewImage.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
