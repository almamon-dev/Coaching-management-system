import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ChevronDown, Menu, X, Share2, Phone, Video } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Header() {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const topBarLinks = [
        'Students', 'Prospective Student', 'Faculty & Staff', 'IQAC', 'SDGs', 
        'Library', 'Archived Website', 'News', 'Notice', 'Document Request', 'Degree Verification'
    ];

    const mainNavLinks = [
        'About Us', 'Admission', 'Academics', 'Administration', 'Research', 'Campus Life', 'Quick Link'
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-inter">
            {/* Top Bar (Cyan) */}
            <div className="bg-[#009ca6] text-white text-[11px] font-bold hidden lg:block">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    
                    {/* Left side links */}
                    <div className="flex items-center">
                        {topBarLinks.map((link, index) => (
                            <a 
                                key={index} 
                                href="#" 
                                className="px-2.5 py-2 hover:bg-white/10 transition-colors border-r border-white/20 last:border-r-0"
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center h-full">
                        <div className="flex items-center gap-1 px-3 py-2 border-r border-white/20 hover:bg-white/10 cursor-pointer">
                            <Search size={12} strokeWidth={2.5} />
                            <span>Search</span>
                        </div>
                        <a href="#" className="px-3 py-2 border-r border-white/20 hover:bg-white/10 flex items-center justify-center">
                            <Share2 size={12} strokeWidth={2.5} />
                        </a>
                        <a href="#" className="px-3 py-2 border-r border-white/20 hover:bg-white/10 flex items-center justify-center">
                            <Phone size={12} strokeWidth={2.5} />
                        </a>
                        <a href="#" className="px-3 py-2 hover:bg-white/10 flex items-center justify-center">
                            <Video size={12} strokeWidth={2.5} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white py-2 md:py-3 border-b border-slate-100">
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                        {/* School Logo */}
                        <img 
                            src="/images/logo_final.png" 
                            alt="Lohadi High School Logo" 
                            className="h-10 md:h-12 w-auto object-contain"
                        />

                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/" className="text-[14px] font-bold text-slate-700 hover:text-[#16a34a] transition-colors">
                            Home
                        </Link>
                        <div className="group relative cursor-pointer flex items-center gap-1">
                            <span className="text-[14px] font-bold text-slate-700 group-hover:text-[#16a34a] transition-colors">
                                Academics
                            </span>
                            <ChevronDown size={14} className="text-slate-400 group-hover:text-[#16a34a]" />
                        </div>
                        <Link href={route('faculties.index')} className="text-[14px] font-bold text-slate-700 hover:text-[#16a34a] transition-colors">
                            Faculty & Staff
                        </Link>
                        <div className="group relative cursor-pointer flex items-center gap-1">
                            <span className="text-[14px] font-bold text-slate-700 group-hover:text-[#16a34a] transition-colors">
                                Admissions
                            </span>
                            <ChevronDown size={14} className="text-slate-400 group-hover:text-[#16a34a]" />
                        </div>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            className="text-slate-800 p-2 hover:bg-slate-50 rounded-md"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full max-h-[80vh] overflow-y-auto">
                    <div className="bg-[#009ca6] text-white p-4 grid grid-cols-2 gap-2 text-xs font-bold">
                        {topBarLinks.map((link, index) => (
                            <a key={index} href="#" className="p-2 border border-white/20 rounded hover:bg-white/10">
                                {link}
                            </a>
                        ))}
                    </div>
                    <nav className="flex flex-col py-2">
                        {mainNavLinks.map((link, index) => (
                            <div 
                                key={index} 
                                className="flex items-center justify-between px-5 py-3 text-[15px] font-bold text-slate-700 hover:bg-[#16a34a]/5 hover:text-[#16a34a] border-b border-slate-50 last:border-0 cursor-pointer"
                            >
                                <span>{link}</span>
                                <ChevronDown size={16} />
                            </div>
                        ))}
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="m-4 flex items-center justify-center py-3 bg-[#16a34a] text-white font-bold rounded-lg">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="m-4 flex items-center justify-center py-3 bg-[#16a34a] text-white font-bold rounded-lg">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
