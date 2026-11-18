import React, { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Award, Star, Quote, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessStories({ dbTestimonials = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";

    const [selectedCategory, setSelectedCategory] = useState('All');

    const defaultStories = [
        {
            id: 1,
            name: "Ariful Islam",
            batch: "HSC Science Batch",
            institution: "Now at BUET (CSE)",
            badge: "GPA 5.00 (Golden A+)",
            quote: "The complex topics in Physics and Higher Mathematics were explained with such clarity and patience. Regular weekly model tests built my confidence to excel in the board examinations.",
            initials: "AI",
            color: "bg-emerald-100 text-emerald-800 border-emerald-300",
            category: "HSC",
            rating: 5,
        },
        {
            id: 2,
            name: "Nusrat Jahan",
            batch: "SSC Science Batch",
            institution: "Viqarunnisa Noon College",
            badge: "Board Top 20 & Golden A+",
            quote: "The personalized mentorship from teachers and intensive test-paper solving sessions made my SSC preparation seamless, helping me achieve a top board ranking and Golden A+.",
            initials: "NJ",
            color: "bg-cyan-100 text-cyan-800 border-cyan-300",
            category: "SSC",
            rating: 5,
        },
        {
            id: 3,
            name: "Tanvir Ahmed",
            batch: "HSC Science Batch",
            institution: "Dhaka Medical College",
            badge: "GPA 5.00",
            quote: "Rather than rote memorization, I truly understood the core principles of Chemistry and Biology. The faculty's structured guidance played a decisive role in my medical admission.",
            initials: "TA",
            color: "bg-amber-100 text-amber-800 border-amber-300",
            category: "HSC",
            rating: 5,
        },
        {
            id: 4,
            name: "Sadia Rahman",
            batch: "Class 10 SSC Candidate",
            institution: "Rajuk Uttara Model College",
            badge: "GPA 5.00",
            quote: "Every concept was thoroughly clarified right inside the classroom. Regular weekly tests and organized revision lecture sheets eliminated all exam anxiety before the board finals.",
            initials: "SR",
            color: "bg-purple-100 text-purple-800 border-purple-300",
            category: "SSC",
            rating: 5,
        },
        {
            id: 5,
            name: "Mahmudul Hasan",
            batch: "Junior Academic Batch (Class 8)",
            institution: "Ideal School & College",
            badge: "Scholarship Achiever",
            quote: "The teachers built a solid academic foundation in Mathematics and Science from the ground up. That early conceptual clarity continues to benefit me in advanced studies.",
            initials: "MH",
            color: "bg-blue-100 text-blue-800 border-blue-300",
            category: "Junior",
            rating: 5,
        },
        {
            id: 6,
            name: "Fatima Akter",
            batch: "HSC Science Batch",
            institution: "Dhaka University (Applied Chemistry)",
            badge: "GPA 5.00 (Golden A+)",
            quote: "The disciplined study routine and genuine dedication of the faculty stood out the most. Developing consistent daily study habits here helped me achieve my dream academic goals.",
            initials: "FA",
            color: "bg-rose-100 text-rose-800 border-rose-300",
            category: "HSC",
            rating: 5,
        },
    ];

    const testimonialsList = (dbTestimonials && dbTestimonials.length > 0)
        ? [...dbTestimonials, ...defaultStories.filter(d => !dbTestimonials.some(t => t.name.toLowerCase() === d.name.toLowerCase()))]
        : defaultStories;

    const categories = ['All', 'HSC', 'SSC', 'Junior'];

    const filteredList = testimonialsList.filter(item => {
        if (selectedCategory === 'All') return true;
        return (item.category || item.batch)?.toLowerCase().includes(selectedCategory.toLowerCase());
    });

    return (
        <FrontendLayout>
            <Head title={`Student Success Stories - ${centerName}`} />

            {/* Header Banner - Same Style Like Events */}
            <div className="bg-[#009ca6] text-white py-14 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Success Stories</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        Student Success Stories
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Inspiring academic journeys, board exam achievements, and heartfelt experiences shared by students of {centerName}.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-12 bg-slate-50 min-h-[60vh] font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">
                    
                    {/* Stats Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs text-center">
                            <span className="block text-3xl md:text-4xl font-black text-[#009ca6]">
                                {settings?.success_stat_pass_rate || '98.4%'}
                            </span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">
                                {settings?.success_stat_pass_label || 'Board Exam Pass Rate'}
                            </span>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs text-center">
                            <span className="block text-3xl md:text-4xl font-black text-emerald-600">
                                {settings?.success_stat_gpa5 || '1,250+'}
                            </span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">
                                {settings?.success_stat_gpa5_label || 'GPA 5.00 Achievers'}
                            </span>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs text-center">
                            <span className="block text-3xl md:text-4xl font-black text-blue-600">
                                {settings?.success_stat_admissions || '500+'}
                            </span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">
                                {settings?.success_stat_admissions_label || 'University Admissions'}
                            </span>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs text-center">
                            <span className="block text-3xl md:text-4xl font-black text-amber-600">
                                {settings?.success_stat_experience || '15+'}
                            </span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">
                                {settings?.success_stat_experience_label || 'Years of Excellence'}
                            </span>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-2">
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
                                {cat === 'All' ? 'All Stories' : `${cat} Batch`}
                            </button>
                        ))}
                    </div>

                    {/* Stories Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map((story) => (
                            <div 
                                key={story.id} 
                                className="bg-white rounded-[4px] p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                            >
                                <div className="space-y-4">
                                    {/* Star Rating & Quote Icon */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-amber-400" />
                                            ))}
                                        </div>
                                        <Quote size={22} className="text-slate-200" />
                                    </div>

                                    {/* Quote Body */}
                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed italic">
                                        "{story.quote}"
                                    </p>
                                </div>

                                {/* Student Profile */}
                                <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm border ${story.color || 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                                        {story.initials || story.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">
                                                {story.name}
                                            </h4>
                                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">
                                            {story.batch}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                            {story.badge && (
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200/60">
                                                    {story.badge}
                                                </span>
                                            )}
                                            {story.institution && (
                                                <span className="text-[10.5px] font-semibold text-slate-400 truncate">
                                                    {story.institution}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Join CTA Box */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[4px] p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
                                Admission Ongoing
                            </span>
                            <h3 className="text-2xl md:text-3xl font-black">
                                Ready to Write Your Own Success Story?
                            </h3>
                            <p className="text-slate-300 text-xs md:text-sm max-w-xl">
                                Enroll in our upcoming academic batches and prepare with Bangladesh's most committed faculty members.
                            </p>
                        </div>
                        <Link
                            href={route('admissions')}
                            className="px-6 py-3 bg-[#16a34a] hover:bg-emerald-600 text-white text-xs font-bold rounded-[3px] shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                            <span>Enroll Now</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center pt-2">
                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                        >
                            <span>← Back to Home</span>
                        </Link>
                    </div>

                </div>
            </section>
        </FrontendLayout>
    );
}

