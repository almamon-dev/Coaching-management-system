import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ChevronRight, FileText, Calendar, Search, ArrowRight, Tag, Bell, X } from 'lucide-react';

export default function Index({ notices = {}, settings = {} }) {
    const { settings: globalSettings } = usePage().props;
    const centerName = settings?.center_name || globalSettings?.center_name || "Ullash Coaching Center";

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedNotice, setSelectedNotice] = useState(null);

    // Fallback notices if database has fewer items
    const defaultNotices = [
        {
            id: 'd1',
            day: '28',
            month: 'JUL',
            title: 'Annual Sports Day 2026 Registration Open',
            category: 'Sports',
            author: 'Sports Department',
            description: 'Get ready for the annual sports day! Registrations for track and field events are now open. All students from Class 6 to Class 12 are encouraged to participate.',
            content: 'Get ready for the annual sports day! Registrations for track and field events are now open. All students from Class 6 to Class 12 are encouraged to participate. Please contact your sports department teacher for registration forms and schedule details.',
            date: '2026-07-28',
            is_new: false,
        },
        {
            id: 'd2',
            day: '28',
            month: 'JUL',
            title: 'New Library Rules & Digital Resource Access',
            category: 'Academic',
            author: 'Administration',
            description: 'Students must return their borrowed books within 14 days to avoid a late fee penalty. Reference books can now be accessed digitally via student portal accounts.',
            content: 'Students must return their borrowed books within 14 days to avoid a late fee penalty. Reference books can now be accessed digitally via student portal accounts.',
            date: '2026-07-28',
            is_new: false,
        },
        {
            id: 'd3',
            day: '28',
            month: 'JUL',
            title: 'Teachers & Parents Coordination Meeting at 3 PM',
            category: 'Meeting',
            author: 'Principal Office',
            description: 'All teaching staff and guardians are requested to gather in the main auditorium for the monthly academic progress and semester review meeting.',
            content: 'All teaching staff and guardians are requested to gather in the main auditorium for the monthly academic progress and semester review meeting.',
            date: '2026-07-28',
            is_new: false,
        },
        {
            id: 'd4',
            day: '27',
            month: 'JUL',
            title: 'Upcoming Final Examinations & Routine Published',
            category: 'Exam',
            author: 'Exam Controller',
            description: 'Dear students and guardians, the upcoming model tests and semester examinations will commence next month. Please check the complete routine attached on the coaching notice board.',
            content: 'Dear students and guardians, the upcoming model tests and examinations will commence from next month. Please check the complete routine attached on the coaching notice board. Admit cards will be distributed from the administrative counter next week.',
            date: '2026-07-27',
            is_new: false,
        },
        {
            id: 'd5',
            day: '25',
            month: 'JUL',
            title: 'Weekly Model Test Schedule Announcement (HSC 2026)',
            category: 'Exam',
            author: 'Academic Team',
            description: 'All HSC 2026 students are hereby informed that the upcoming weekly Physics Model Test will take place this Friday at 10:00 AM in Hall Room B.',
            content: 'All HSC 2026 students are hereby informed that the upcoming weekly Physics Model Test will take place this Friday at 10:00 AM in Hall Room B. Attendance is mandatory for all enrolled batch students.',
            date: '2026-07-25',
            is_new: true,
        },
        {
            id: 'd6',
            day: '20',
            month: 'JUL',
            title: 'Summer Vacation & Special Intensive Revision Classes',
            category: 'Holiday',
            author: 'Administration',
            description: 'Regular classes will remain suspended for summer break from June 1st to June 15th. Special board exam preparation sessions will continue as per schedule.',
            content: 'Regular classes will remain suspended for summer break from June 1st to June 15th. Special board exam preparation sessions will continue as per schedule.',
            date: '2026-07-20',
            is_new: false,
        },
    ];

    const noticeList = (notices.data && notices.data.length > 0)
        ? [...notices.data, ...defaultNotices.filter(d => !notices.data.some(n => n.title.toLowerCase() === d.title.toLowerCase()))]
        : defaultNotices;

    // Filter notices based on search & category
    const filteredNotices = noticeList.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Exam', 'Academic', 'Sports', 'Meeting', 'Holiday'];

    return (
        <FrontendLayout>
            <Head title={`Notice Board - ${centerName}`} />

            {/* Header Banner - Same Style Like Events */}
            <div className="bg-[#009ca6] text-white py-14 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3.5 shadow-xs">
                        <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span>Notice Board</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                        Notice Board
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Stay updated with the latest official circulars, examination schedules, holiday notices, and important academic announcements from {centerName}.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-12 bg-slate-50 min-h-[60vh] font-inter">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-8">

                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 md:p-6 rounded-[4px] border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Category Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                                            ? 'bg-[#009ca6] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[260px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search notices..."
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-[4px] text-xs font-medium focus:ring-1 focus:ring-[#009ca6] focus:border-[#009ca6]"
                            />
                        </div>
                    </div>

                    {/* Notice List */}
                    <div className="bg-white rounded-[4px] border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                        {filteredNotices.length > 0 ? (
                            filteredNotices.map((notice) => (
                                <div
                                    key={notice.id}
                                    onClick={() => setSelectedNotice(notice)}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        {/* Calendar Date Card */}
                                        <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-2xs shrink-0 w-16 group-hover:border-[#009ca6] group-hover:shadow-xs transition-all mt-0.5">
                                            <div className="w-full bg-[#009ca6] group-hover:bg-[#008790] text-white text-[11px] font-black uppercase tracking-wider text-center py-1 leading-none transition-colors">
                                                {notice.month || (notice.date ? new Date(notice.date).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JUL')}
                                            </div>
                                            <div className="w-full py-2 flex items-center justify-center bg-white group-hover:bg-teal-50/20 transition-colors">
                                                <span className="font-black text-2xl text-slate-800 leading-none group-hover:text-[#009ca6] transition-colors">
                                                    {notice.day || (notice.date ? new Date(notice.date).getDate() : '28')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title & Preview */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#009ca6] transition-colors">
                                                    {notice.title}
                                                </h3>
                                                {notice.is_new && (
                                                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded shrink-0">
                                                        New
                                                    </span>
                                                )}
                                                {notice.category && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                                                        {notice.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                                {notice.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="shrink-0 self-end sm:self-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[3px] bg-slate-100 text-slate-700 text-xs font-bold group-hover:bg-[#009ca6] group-hover:text-white transition-colors">
                                            <span>Read Notice</span>
                                            <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">
                                <Bell size={36} className="mx-auto mb-3 opacity-40" />
                                <p className="text-sm font-semibold">No notices found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                        >
                            <span>← Back to Home</span>
                        </Link>
                    </div>

                </div>
            </section>

            {/* Notice Detail Modal */}
            {selectedNotice && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setSelectedNotice(null)}
                >
                    <div
                        className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#009ca6] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-white/20 text-white border border-white/30 text-[11px] font-bold rounded">
                                    Official Notice
                                </span>
                                {selectedNotice.category && (
                                    <span className="text-xs text-white/90 font-medium">
                                        • {selectedNotice.category}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
                                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center rounded-[4px] overflow-hidden border border-slate-200/90 bg-white shadow-xs shrink-0 w-16">
                                    <div className="w-full bg-[#009ca6] text-white text-[11px] font-black uppercase tracking-wider text-center py-1 leading-none">
                                        {selectedNotice.month || (selectedNotice.date ? new Date(selectedNotice.date).toLocaleString('default', { month: 'short' }).toUpperCase() : 'JUL')}
                                    </div>
                                    <div className="w-full py-2.5 flex items-center justify-center bg-white">
                                        <span className="font-black text-2xl text-slate-900 leading-none">
                                            {selectedNotice.day || (selectedNotice.date ? new Date(selectedNotice.date).getDate() : '28')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                        {selectedNotice.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                        <Calendar size={13} className="text-slate-400" />
                                        <span>Published: {selectedNotice.date || 'Recent'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                                    {selectedNotice.content || selectedNotice.description}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
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
