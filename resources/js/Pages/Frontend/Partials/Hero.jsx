import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import {
    ChevronRight, List, Apple, Baby, Heart, Dog,
    BookOpen, Smartphone, Home, Gamepad2, Grid, Sparkles,
    CreditCard, Tag, ShieldCheck, Truck
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const ICON_MAP = [
    { key: 'food', icon: <Apple size={18} strokeWidth={1.5} />, skipIf: 'baby' },
    { key: 'baby', icon: <Baby size={18} strokeWidth={1.5} /> },
    { key: 'diaper', icon: <Baby size={18} strokeWidth={1.5} /> },
    { key: 'beauty', icon: <Heart size={18} strokeWidth={1.5} /> },
    { key: 'health', icon: <Heart size={18} strokeWidth={1.5} /> },
    { key: 'pet', icon: <Dog size={18} strokeWidth={1.5} /> },
    { key: 'stationer', icon: <BookOpen size={18} strokeWidth={1.5} /> },
    { key: 'gadget', icon: <Smartphone size={18} strokeWidth={1.5} /> },
    { key: 'electronic', icon: <Smartphone size={18} strokeWidth={1.5} /> },
    { key: 'home', icon: <Home size={18} strokeWidth={1.5} /> },
    { key: 'kitchen', icon: <Home size={18} strokeWidth={1.5} /> },
    { key: 'toy', icon: <Gamepad2 size={18} strokeWidth={1.5} /> },
    { key: 'sport', icon: <Gamepad2 size={18} strokeWidth={1.5} /> },
    { key: 'fashion', icon: <Sparkles size={18} strokeWidth={1.5} /> },
    { key: 'lifestyle', icon: <Sparkles size={18} strokeWidth={1.5} /> },
];

const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    const match = ICON_MAP.find(item =>
        name.includes(item.key) && (!item.skipIf || !name.includes(item.skipIf))
    );
    return match ? match.icon : <Grid size={18} strokeWidth={1.5} />;
};


const getFlyoutLayout = (count) => {
    if (count >= 20) return { container: 'w-[600px]', inner: 'grid grid-cols-3', itemClass: '[&:not(:nth-child(3n))]:border-r border-slate-100' };
    if (count >= 10) return { container: 'w-[420px]', inner: 'grid grid-cols-2', itemClass: '[&:nth-child(odd)]:border-r border-slate-100' };
    return { container: 'w-[220px]', inner: 'flex flex-col', itemClass: '' };
};


const SLIDES = [
    { id: 1, image: '/images/banners/main-banner.webp?v=3', alt: 'Beko 1.5 Ton AC Special Promotion', link: '#' },
    { id: 2, image: '/images/banners/main-banner-second.webp?v=3', alt: 'Exclusive Tech Deals', link: '#' },
    { id: 3, image: '/images/banners/main-banner-third.webp?v=3', alt: 'Custom Gaming PC Builder Offer', link: '#' }
];

export default function Hero({ categories = [] }) {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCatId, setHoveredCatId] = useState(null);
    const [hoveredSubCatId, setHoveredSubCatId] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const categoryTree = useMemo(() => {
        if (!categories || categories.length === 0) return [];

        const looksLikeTree = categories.every(cat => cat.parent_id === null);
        if (looksLikeTree) return categories.filter(cat => cat.status === 1).slice(0, 15);

        const map = {};
        const roots = [];

        categories.forEach(cat => {
            if (cat.status === 1) {
                map[cat.id] = { ...cat, children: [] };
            }
        });

        categories.forEach(cat => {
            if (cat.status === 1) {
                const mappedEl = map[cat.id];
                if (cat.parent_id === null) {
                    roots.push(mappedEl);
                } else if (map[cat.parent_id]) {
                    map[cat.parent_id].children.push(mappedEl);
                }
            }
        });

        return roots.slice(0, 15);
    }, [categories]);

    return (
        <section className="container mx-auto px-4 pb-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* Categories Sidebar */}
                <div className="hidden lg:flex flex-col lg:col-span-3 bg-white rounded-b-xl shadow-sm border border-slate-200 border-t-0 relative z-30">
                    <ul className="flex flex-col relative flex-1" onMouseLeave={() => setHoveredCatId(null)}>
                        {categoryTree.map((category) => (
                            <li 
                                key={category.id} 
                                className="relative border-b border-slate-100 last:border-0"
                                onMouseEnter={() => setHoveredCatId(category.id)}
                            >
                                <Link
                                    href={route('frontend.url', category.path)}
                                    className={`flex items-center justify-between px-5 py-3 text-[14px] font-medium transition-colors ${hoveredCatId === category.id ? 'text-[#16a34a] bg-[#f3f4f7]' : 'text-slate-700 hover:text-[#16a34a] hover:bg-[#f3f4f7]'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-colors ${hoveredCatId === category.id ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                                            {getCategoryIcon(category.name)}
                                        </span>
                                        <span className="truncate max-w-[140px]">{category.name}</span>
                                    </div>
                                    {category.children && category.children.length > 0 && (
                                        <ChevronRight size={15} className={`transition-colors ${hoveredCatId === category.id ? 'text-[#16a34a]' : 'text-slate-400'}`} />
                                    )}
                                </Link>

                                {/* Level 2: Sub Categories Flyout */}
                                {category.children && category.children.length > 0 && hoveredCatId === category.id && (() => {
                                    const layout2 = getFlyoutLayout(category.children.length);
                                    return (
                                        <div className={`absolute left-full -top-2 ${layout2.container} bg-white border border-slate-100 border-t-[3px] border-t-[#16a34a] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 rounded-b-md rounded-tr-md`} onMouseLeave={() => setHoveredSubCatId(null)}>
                                            <div className={`${layout2.inner} py-2`}>
                                                {category.children.map((sub) => (
                                                    <div 
                                                        key={sub.id} 
                                                        className={`static ${layout2.itemClass}`}
                                                        onMouseEnter={() => setHoveredSubCatId(sub.id)}
                                                    >
                                                        <Link
                                                            href={route('frontend.url', sub.path)}
                                                            className={`flex items-center justify-between px-4 py-1.5 text-[13px] font-medium transition-colors ${hoveredSubCatId === sub.id ? 'text-[#16a34a] bg-[#f3f4f7]' : 'text-slate-600 hover:text-[#16a34a] hover:bg-[#f3f4f7]'}`}
                                                        >
                                                            <span className="truncate">{sub.name}</span>
                                                            {sub.children && sub.children.length > 0 && (
                                                                <ChevronRight size={14} className={`transition-colors ${hoveredSubCatId === sub.id ? 'text-[#16a34a]' : 'text-slate-400'}`} />
                                                            )}
                                                        </Link>

                                                        {/* Level 3: Sub-Sub Categories Flyout */}
                                                        {sub.children && sub.children.length > 0 && hoveredSubCatId === sub.id && (() => {
                                                            const layout3 = getFlyoutLayout(sub.children.length);
                                                            return (
                                                                <div className={`absolute left-full -top-[3px] ${layout3.container} bg-white border border-slate-100 border-t-[3px] border-t-[#16a34a] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 rounded-b-md rounded-tr-md ml-[1px]`}>
                                                                    <div className={`${layout3.inner} py-2`}>
                                                                        {sub.children.map((subSub) => (
                                                                            <div key={subSub.id} className={`${layout3.itemClass}`}>
                                                                                <Link
                                                                                    href={route('frontend.url', subSub.path)}
                                                                                    className="block px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:text-[#16a34a] hover:bg-[#f3f4f7] transition-colors truncate"
                                                                                >
                                                                                    {subSub.name}
                                                                                </Link>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="border-t border-slate-100">
                                                                        <Link
                                                                            href={route('frontend.url', sub.path)}
                                                                            className="block px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:text-[#16a34a] hover:bg-slate-50 transition-colors truncate"
                                                                        >
                                                                            Show All {sub.name}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t border-slate-100">
                                                <Link
                                                    href={route('frontend.url', category.path)}
                                                    className="block px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:text-[#16a34a] hover:bg-slate-50 transition-colors"
                                                >
                                                    Show All {category.name}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </li>
                        ))}
                        {categories.length > 15 && (
                            <li className="mt-auto border-t border-slate-100">
                                <Link href={route('frontend.url', 'categories')} className="block px-4 py-3 text-[13px] font-bold text-[#16a34a] hover:underline text-center">
                                    View All Categories
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Main Slider */}
                <div className="lg:col-span-9 rounded-xl overflow-hidden shadow-sm relative group h-[250px] sm:h-[350px] lg:h-[480px] w-full bg-white flex items-center justify-center lg:mt-6">
                    <div className="w-full h-full relative">
                        {SLIDES.map((slide, index) => (
                            <a
                                key={slide.id}
                                href={slide.link}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover object-center"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    >
                        ❯
                    </button>

                    {/* Indicator Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                        {SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-[#16a34a]' : 'w-2.5 bg-black/20 hover:bg-black/40'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Grogin Feature Bar */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#f3f4f7] rounded-full text-[#16a34a]">
                        <CreditCard size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-[14px]">{t('Payment only online')}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{t('payment_desc')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#f3f4f7] rounded-full text-[#16a34a]">
                        <Tag size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-[14px]">{t('New stocks and sales')}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{t('stocks_desc')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#f3f4f7] rounded-full text-[#16a34a]">
                        <ShieldCheck size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-[14px]">{t('Quality assurance')}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{t('quality_desc')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#f3f4f7] rounded-full text-[#16a34a]">
                        <Truck size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-[14px]">{t('Delivery from 1 hour')}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{t('delivery_desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}   