import React, { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Clock, Users, ArrowRight, Search, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';

export default function BatchesIndex({ dbBatches = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";

    const defaultBatches = [
        {
            id: 1,
            display_title: 'HSC Physics Batch',
            category: 'HSC / Intermediate',
            code: 'HSC-PHY-101',
            image: '/images/batches/batch_physics.jpg',
            description: 'Complete HSC Physics (1st & 2nd Paper) with a clear concept, problem solving, and exam preparation.',
            duration: '12 Months',
            total_classes: 48,
            seats_left: 28,
            fee: 1500,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '07:00 AM - 08:00 AM',
            details_url: '/batches/1',
            link: '/admissions',
        },
        {
            id: 2,
            display_title: 'HSC Higher Math Batch',
            category: 'HSC / Intermediate',
            code: 'HSC-MATH-102',
            image: '/images/batches/batch_higher_math.jpg',
            description: 'Complete Higher Mathematics (1st & 2nd Paper) with in-depth concepts, practice, and exam preparation.',
            duration: '12 Months',
            total_classes: 52,
            seats_left: 24,
            fee: 1600,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '08:00 AM - 09:00 AM',
            details_url: '/batches/2',
            link: '/admissions',
        },
        {
            id: 5,
            display_title: 'HSC Chemistry Batch',
            category: 'HSC / Intermediate',
            code: 'HSC-CHE-103',
            image: '/images/batches/batch_chemistry.jpg',
            description: 'In-depth HSC Chemistry (1st & 2nd Paper) covering Qualitative, Kinetics, Organic & Electrochemistry.',
            duration: '12 Months',
            total_classes: 46,
            seats_left: 30,
            fee: 1500,
            admission_fee: 500,
            class_days: 'Sat, Mon, Wed',
            class_time: '04:00 PM - 05:00 PM',
            details_url: '/batches/5',
            link: '/admissions',
        },
        {
            id: 3,
            display_title: 'Class 9 Science Batch',
            category: 'Class 9',
            code: 'CLS9-SCI-201',
            image: '/images/batches/batch_class9.jpg',
            description: 'Foundation building for Class 9 Science students with intensive focus on Math, Physics, Chem & ICT.',
            duration: '12 Months',
            total_classes: 64,
            seats_left: 18,
            fee: 1800,
            admission_fee: 500,
            class_days: 'Sat, Mon, Wed',
            class_time: '09:00 AM - 10:00 AM',
            details_url: '/batches/3',
            link: '/admissions',
        },
        {
            id: 4,
            display_title: 'Class 10 / SSC Batch',
            category: 'Class 10',
            code: 'CLS10-SCI-301',
            image: '/images/batches/batch_class10.jpg',
            description: 'Complete SSC board preparation for Science students focusing on test papers, model tests, and CQ mastery.',
            duration: '10 Months',
            total_classes: 68,
            seats_left: 15,
            fee: 2000,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '03:00 PM - 04:00 PM',
            details_url: '/batches/4',
            link: '/admissions',
        },
        {
            id: 6,
            display_title: 'HSC ICT Batch',
            category: 'HSC / Intermediate',
            code: 'HSC-ICT-104',
            image: '/images/batches/batch_ict.jpg',
            description: 'Comprehensive HSC ICT syllabus coverage with C Programming, HTML/Web, Database and Networking.',
            duration: '8 Months',
            total_classes: 40,
            seats_left: 22,
            fee: 1200,
            admission_fee: 500,
            class_days: 'Sun, Tue, Thu',
            class_time: '05:00 PM - 06:00 PM',
            details_url: '/batches/6',
            link: '/admissions',
        },
    ];

    const allBatches = (dbBatches && dbBatches.length > 0) ? dbBatches : defaultBatches;

    const [selectedCategory, setSelectedCategory] = useState('All Batches');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All Batches', ...new Set(allBatches.map(b => b.category).filter(Boolean))];

    const filteredBatches = allBatches.filter(batch => {
        const matchesCategory = selectedCategory === 'All Batches' || batch.category === selectedCategory;
        const matchesSearch = (batch.display_title || batch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (batch.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (batch.code || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <FrontendLayout>
            <Head title={`Academic Batches - ${centerName}`} />

            {/* Header Banner */}
            <div className="bg-[#009ca6] text-white py-12 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Batches</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        Academic Batches & Programs
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Explore our comprehensive academic coaching batches designed for SSC, HSC, and foundational academic excellence.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl font-inter space-y-8">
                
                {/* Filters and Search Bar */}
                <div className="bg-white p-4 md:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => {
                            const count = cat === 'All Batches'
                                ? allBatches.length
                                : allBatches.filter(b => b.category === cat).length;
                            const isActive = selectedCategory === cat;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-[#047857] text-white'
                                            : 'bg-white hover:bg-emerald-50 hover:text-[#047857] text-slate-600 border border-slate-200'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-bold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search by title, subject or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-[4px] text-xs focus:ring-1 focus:ring-[#047857] focus:border-[#047857] outline-hidden transition-colors"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                </div>

                {/* Batches Grid (Upcoming Events Style Horizontal Cards) */}
                {filteredBatches.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredBatches.map(batch => (
                            <div 
                                key={batch.id}
                                className="bg-white rounded-[4px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md flex flex-col sm:flex-row group transition-all"
                            >
                                {/* Left Image with Category Badge */}
                                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0 bg-slate-100">
                                    <img 
                                        src={batch.image || '/images/fb_photo_01.jpg'} 
                                        alt={batch.display_title || batch.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = '/images/coaching/coaching_01.jpg'; }}
                                    />
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-[4px] px-2.5 py-1 text-center shadow-xs border border-slate-200/90">
                                        <span className="block text-[10px] font-bold text-[#047857] uppercase tracking-wider leading-none">
                                            {batch.category || 'Batch'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-[#047857]/90 backdrop-blur-xs rounded-[4px] px-2 py-0.5 text-center">
                                        <span className="block font-mono text-[10px] text-white tracking-wider font-semibold">
                                            {batch.code || `BATCH-${batch.id}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Content Column */}
                                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                                    <div>
                                        {/* Routine Row */}
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 mb-2">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-[#047857]" />
                                                <span>{batch.class_days || 'Regular Days'}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-[#047857]" />
                                                <span>{batch.class_time || 'Schedule'}</span>
                                            </span>
                                        </div>

                                        {/* Batch Title */}
                                        <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#047857] transition-colors">
                                            {batch.display_title || batch.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
                                            {batch.description}
                                        </p>

                                        {/* Key Stats */}
                                        <div className="py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span>
                                                Duration: <strong className="text-slate-700 font-semibold">{batch.duration || '12 Months'}</strong>
                                            </span>
                                            <span>
                                                Seats: <strong className="text-slate-700 font-semibold">{batch.seats_left ?? 25} Remaining</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-2">
                                        <Link
                                            href={batch.details_url || `/batches/${batch.id}`}
                                            className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-[#047857] border border-slate-300 hover:border-emerald-300 rounded-[4px] transition-colors block"
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            href={batch.link || '/admissions'}
                                            className="w-full py-2 px-3 text-center text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] rounded-[4px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                        >
                                            <span>Join</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white rounded-[4px] border border-slate-200">
                        <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                        <h4 className="text-base font-bold text-slate-800">No batches match your query</h4>
                        <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
                        <button
                            type="button"
                            onClick={() => { setSelectedCategory('All Batches'); setSearchTerm(''); }}
                            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[4px]"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Bottom Guidance Banner */}
                <div className="p-5 sm:p-6 bg-slate-900 rounded-[4px] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight">
                            Need guidance choosing the right batch?
                        </h4>
                        <p className="text-xs text-slate-300">
                            Our teachers and academic counseling team can assist you with your schedule and subject choices.
                        </p>
                    </div>
                    <Link
                        href="/admissions"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-[4px] transition-colors shrink-0 cursor-pointer"
                    >
                        <span>Admission Instructions</span>
                        <ChevronRight size={14} />
                    </Link>
                </div>

            </div>
        </FrontendLayout>
    );
}

