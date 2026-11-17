import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    GraduationCap, ClipboardCheck, Bell, Phone, 
    ChevronDown, Menu, X, ArrowRight, User 
} from 'lucide-react';
import SchoolLogo from '@/Components/SchoolLogo';

export default function Header() {
    const { url, props } = usePage();
    const { auth, settings } = props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

    const currentPath = url ? url.split('?')[0].split('#')[0] : '/';
    const isHomeActive = currentPath === '/';
    const isNoticesActive = currentPath.startsWith('/notices-board');
    const isEventsActive = currentPath.startsWith('/events');
    const isGalleryActive = currentPath.startsWith('/gallery');
    const isSuccessStoriesActive = currentPath.startsWith('/success-stories');
    const isAboutActive = currentPath.startsWith('/about-us') || currentPath.startsWith('/about');
    const isCoursesActive = currentPath.startsWith('/batches') || currentPath.startsWith('/faculties') || currentPath.startsWith('/courses') || currentPath.startsWith('/class-details');
    const isAdmissionActive = currentPath === '/admissions';
    const isStudentActive = currentPath.startsWith('/user') || currentPath.startsWith('/student');

    const hotline = settings?.phone || "+880 1712-345678";

    const coursesList = [
        { name: 'All Academic Batches', href: '/batches' },
        { name: 'College Academic Program (HSC 1st & 2nd Paper)', href: '/batches' },
        { name: 'SSC Preparation Program (Class 9 - 10)', href: '/batches' },
        { name: 'Foundation Science Program (Class 9)', href: '/batches' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white font-inter print:hidden shadow-xs">
            {/* 1. TOP GREEN UTILITY BAR */}
            <div className="bg-[#047857] text-white text-[11.5px] font-semibold">
                <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between py-1.5">
                    {/* Left Quick Links */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link 
                            href={auth?.user ? route('dashboard') : route('student.login')} 
                            className={`flex items-center gap-1.5 transition-colors ${isStudentActive ? 'text-amber-300 font-bold' : 'text-white hover:text-emerald-200'}`}
                        >
                            <GraduationCap size={13} className={isStudentActive ? 'text-amber-300' : 'text-emerald-300'} />
                            <span>Student Portal</span>
                        </Link>

                        <Link 
                            href={route('admissions')} 
                            className={`flex items-center gap-1.5 transition-colors ${isAdmissionActive ? 'text-amber-300 font-bold' : 'text-white hover:text-emerald-200'}`}
                        >
                            <ClipboardCheck size={13} className={isAdmissionActive ? 'text-amber-300' : 'text-emerald-300'} />
                            <span>Online Admission</span>
                        </Link>

                        <Link 
                            href={route('notices.index')} 
                            className={`flex items-center gap-1.5 transition-colors ${isNoticesActive ? 'text-amber-300 font-bold' : 'text-white hover:text-emerald-200'}`}
                        >
                            <Bell size={13} className={isNoticesActive ? 'text-amber-300' : 'text-emerald-300'} />
                            <span>Notice Board</span>
                        </Link>
                    </div>

                    {/* Right Hotline */}
                    <div className="hidden sm:flex items-center gap-1.5 text-emerald-100">
                        <Phone size={12} className="text-emerald-300" />
                        <span>Hotline: <b className="text-white font-bold">{hotline}</b></span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN NAVBAR */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-[72px]">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <SchoolLogo variant="wide" className="h-[44px]" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isHomeActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            Home
                        </Link>

                        {/* Courses Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setCoursesDropdownOpen(true)}
                            onMouseLeave={() => setCoursesDropdownOpen(false)}
                        >
                            <button
                                type="button"
                                className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                                    isCoursesActive 
                                        ? 'bg-orange-50 text-[#ea580c]' 
                                        : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                                }`}
                            >
                                <span>Courses & Classes</span>
                                <ChevronDown size={14} className={`transition-transform ${coursesDropdownOpen ? 'rotate-180 text-[#047857]' : 'text-slate-400'}`} />
                            </button>

                            {coursesDropdownOpen && (
                                <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-[4px] shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                                    {coursesList.map((c, idx) => (
                                        <a
                                            key={idx}
                                            href={c.href}
                                            onClick={() => setCoursesDropdownOpen(false)}
                                            className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#047857] font-semibold transition-colors"
                                        >
                                            <span>{c.name}</span>
                                            <ArrowRight size={12} className="text-slate-300" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href={route('notices.index')}
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isNoticesActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            Notices
                        </Link>

                        <Link
                            href={route('events')}
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isEventsActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            Events
                        </Link>

                        <Link
                            href={route('gallery')}
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isGalleryActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            Gallery
                        </Link>

                        <Link
                            href={route('success-stories')}
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isSuccessStoriesActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            Success Stories
                        </Link>

                        <Link
                            href={route('about-us')}
                            className={`px-3.5 py-1.5 text-[13.5px] font-bold rounded-full transition-colors ${
                                isAboutActive 
                                    ? 'bg-orange-50 text-[#ea580c]' 
                                    : 'text-slate-700 hover:text-[#047857] hover:bg-slate-50'
                            }`}
                        >
                            About Us
                        </Link>

                        <a
                            href="/#contact"
                            className="px-3.5 py-1.5 text-[13.5px] font-bold text-slate-700 hover:text-[#047857] hover:bg-slate-50 rounded-full transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Right CTA Button */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href={route('admissions')}
                            className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-[13px] rounded-[4px] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <span>Apply for Admission</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Link
                            href={route('admissions')}
                            className="px-3 py-1.5 bg-[#ea580c] text-white text-xs font-bold rounded-[3px]"
                        >
                            Apply
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. MOBILE MENU DRAWER */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-3 space-y-2 animate-in fade-in">
                    <nav className="flex flex-col space-y-1">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-bold rounded transition-colors ${
                                isHomeActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Home
                        </Link>
                        <a
                            href="/#courses"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isCoursesActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Courses & Programs
                        </a>
                        <Link
                            href={route('notices.index')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isNoticesActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Notices
                        </Link>
                        <Link
                            href={route('events')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isEventsActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Events
                        </Link>
                        <Link
                            href={route('gallery')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isGalleryActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Gallery
                        </Link>
                        <Link
                            href={route('success-stories')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isSuccessStoriesActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Success Stories
                        </Link>
                        <Link
                            href={route('about-us')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-3 py-2 text-sm font-semibold rounded transition-colors ${
                                isAboutActive ? 'text-[#ea580c] bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            About Us
                        </Link>
                        <a
                            href="/#contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded"
                        >
                            Contact
                        </a>
                    </nav>

                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                            href={auth?.user ? route('dashboard') : route('student.login')}
                            className="w-full py-2 bg-slate-900 text-white text-center text-xs font-bold rounded flex items-center justify-center gap-1.5"
                        >
                            <GraduationCap size={14} />
                            <span>Student Portal</span>
                        </Link>
                        <Link
                            href={route('admissions')}
                            className="w-full py-2 bg-[#ea580c] text-white text-center text-xs font-bold rounded"
                        >
                            Apply for Admission
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
