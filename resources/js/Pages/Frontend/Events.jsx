import React, { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, ChevronRight, Search, X, CheckCircle2 } from 'lucide-react';

export default function Events({ dbEvents = [], settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeModalEvent, setActiveModalEvent] = useState(null);

    const defaultEvents = [
        {
            id: 1,
            title: 'Annual Merit Award & Achievers Crest Ceremony',
            image: '/images/ullash_award_crest_01.jpg',
            month: 'MAR',
            day: '15',
            time: '04:00 PM',
            location: 'Main Auditorium & Reception Wing',
            category: 'Award',
            description: 'Ullash Coaching Center honors top scorers in HSC and SSC board exams with merit crests, certificates, and recognition by the Director.',
            color: 'amber',
        },
        {
            id: 2,
            title: 'HSC & SSC Central Model Test Grand Exam',
            image: '/images/ullash_classroom_model_test_01.jpg',
            month: 'MAR',
            day: '25',
            time: '09:00 AM',
            location: 'Examination Hall 1 & 2',
            category: 'Exam',
            description: 'Board-standard centralized model test examination in our air-conditioned classrooms with strict invigilation and detailed script evaluation.',
            color: 'emerald',
        },
        {
            id: 3,
            title: 'HSC Batch Grand Farewell & Celebration Ceremony',
            image: '/images/ullash_farewell_gift_ceremony.jpg',
            month: 'APR',
            day: '05',
            time: '11:00 AM',
            location: 'Coaching Campus Hall',
            category: 'Events',
            description: 'Grand farewell ceremony for outgoing HSC examinees featuring gift pack presentations, celebration cake cutting, and motivational guidance from faculty.',
            color: 'rose',
        },
        {
            id: 4,
            title: 'New HSC ICT Batch Admission & Orientation Seminar',
            image: '/images/ullash_ict_batch_poster.jpg',
            month: 'APR',
            day: '14',
            time: '10:00 AM',
            location: 'ICT Seminar Room',
            category: 'Seminar',
            description: 'Special orientation seminar on ICT syllabus coverage, C programming, and practical board question mastery for HSC science and commerce students.',
            color: 'blue',
        },
        {
            id: 5,
            title: 'Female Batch Academic Counseling & Campus Study Camp',
            image: '/images/ullash_campus_female_batch.jpg',
            month: 'MAY',
            day: '10',
            time: '10:30 AM',
            location: 'Campus Garden & Counseling Wing',
            category: 'Academic',
            description: 'Dedicated academic discussion and progress review for female examinees with faculty mentors at Ullash Coaching campus grounds.',
            color: 'indigo',
        },
        {
            id: 6,
            title: 'Academic Guidance & Personalized Mentorship Workshop',
            image: '/images/ullash_campus_mentorship.jpg',
            month: 'MAY',
            day: '20',
            time: '15:00 PM',
            location: 'Executive Office & Meeting Room',
            category: 'Workshop',
            description: 'One-on-one student counseling and board exam strategic roadmap session led by Director Md. Faruk Hossain and senior lecturers.',
            color: 'teal',
        },
    ];

    const eventsList = (dbEvents && dbEvents.length > 0)
        ? [...dbEvents, ...defaultEvents.filter(d => !dbEvents.some(e => e.title.toLowerCase() === d.title.toLowerCase()))]
        : defaultEvents;

    const categories = ['All', 'Culture', 'Science', 'Sports', 'Festival', 'Academic'];

    const filteredEvents = eventsList.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <FrontendLayout>
            <Head title={`Events - ${centerName}`} />

            {/* Header Banner - Same Style Like Events */}
            <div className="bg-[#009ca6] text-white py-14 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Events</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        Events & Programs
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Stay up to date with all the upcoming workshops, competitions, cultural fests, and campus events at {centerName}.
                    </p>
                </div>
            </div>

            {/* Events Content */}
            <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl font-inter">
                {/* Filters & Search */}
                <div className="bg-white p-4 md:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-[#009ca6] text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[260px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search events..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-[4px] text-xs font-medium focus:ring-1 focus:ring-[#009ca6] focus:border-[#009ca6]"
                        />
                    </div>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((evt) => (
                        <div 
                            key={evt.id} 
                            className="bg-white rounded-[4px] overflow-hidden shadow-2xs border border-slate-200/90 flex flex-col group hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative h-52 overflow-hidden bg-slate-100">
                                <img 
                                    src={evt.image || '/images/coaching/coaching_12.jpg'} 
                                    alt={evt.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    loading="lazy" 
                                />
                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-[4px] p-2 text-center shadow-md min-w-[56px] border-b-2 border-[#009ca6]">
                                    <span className="block text-[#009ca6] font-bold text-[10px] uppercase mb-0.5">{evt.month}</span>
                                    <span className="block text-xl font-black text-slate-900 leading-none">{evt.day}</span>
                                </div>
                                <div className="absolute top-3 right-3 bg-[#009ca6] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[3px] shadow-xs">
                                    {evt.category || 'Event'}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2.5">
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-[#009ca6]" /> {evt.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={13} className="text-[#009ca6]" /> {evt.location}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#009ca6] transition-colors leading-snug">
                                        {evt.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                                        {evt.description}
                                    </p>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => setActiveModalEvent(evt)}
                                    className="w-full py-2 rounded-[3px] border border-[#009ca6]/30 text-[#009ca6] text-xs font-bold hover:bg-[#009ca6] hover:text-white transition-colors cursor-pointer"
                                >
                                    Event Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="p-12 text-center text-slate-400 bg-white rounded-[4px] border border-slate-200">
                        <Calendar size={36} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-semibold">No events found matching your search.</p>
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

            {/* Event Detail Modal */}
            {activeModalEvent && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setActiveModalEvent(null)}
                >
                    <div 
                        className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-[#009ca6] text-white px-6 py-4 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {activeModalEvent.category || 'Event'}
                            </span>
                            <button 
                                type="button" 
                                onClick={() => setActiveModalEvent(null)}
                                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <img 
                                src={activeModalEvent.image} 
                                alt={activeModalEvent.title} 
                                className="w-full h-48 object-cover rounded-[4px]"
                            />
                            <h3 className="text-xl font-bold text-slate-900">
                                {activeModalEvent.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-[3px] border border-slate-100">
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#009ca6]" /> {activeModalEvent.day} {activeModalEvent.month}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#009ca6]" /> {activeModalEvent.time}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#009ca6]" /> {activeModalEvent.location}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {activeModalEvent.description}
                            </p>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setActiveModalEvent(null)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-[3px] transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
