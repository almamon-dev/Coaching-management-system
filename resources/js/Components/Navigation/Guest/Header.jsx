import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ChevronDown, Menu, X, Share2, Phone, Video } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import SchoolLogo from '@/Components/SchoolLogo';

export default function Header() {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const topBarLinks = [
        { name: 'Student Portal', url: route('student.login') },
        { name: 'Admissions', url: route('admissions') },
        { name: 'Staff Faculty Portal', url: route('portals.index') },
        { name: 'Library', url: route('coming.soon') },
        { name: 'Notice', url: '/#notice-board' },
        { name: 'News', url: route('events') },
        { name: 'Document Request', url: route('coming.soon') }
    ];

    const mainNavLinks = [
        'About Us', 'Admission', 'Academics', 'Administration', 'Research', 'Campus Life', 'Quick Link'
    ];

    const handleShare = async (e) => {
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Check out this page from Lohadi High School.',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('User cancelled share');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Page link copied to clipboard!');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-inter print:hidden">
            {/* Top Bar (Cyan) */}
            <div className="bg-[#16a34a] text-white text-[11px] font-bold hidden lg:block">
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Left side links */}
                    <div className="flex items-center">
                        {topBarLinks.map((link, index) => {
                            const isHashLink = link.url.includes('#');
                            const linkClasses = "px-2.5 py-2 hover:bg-white/10 transition-colors border-r border-white/20 last:border-r-0";

                            return isHashLink ? (
                                <a key={index} href={link.url} className={linkClasses}>
                                    {link.name}
                                </a>
                            ) : (
                                <Link key={index} href={link.url} className={linkClasses}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center h-full">
                        <button
                            onClick={() => alert('Search functionality will be implemented soon!')}
                            className="flex items-center gap-1 px-3 py-2 border-r border-white/20 hover:bg-white/10 cursor-pointer"
                        >
                            <Search size={12} strokeWidth={2.5} />
                            <span>Search</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-3 py-2 border-r border-white/20 hover:bg-white/10 flex items-center justify-center"
                            title="Share this page"
                        >
                            <Share2 size={12} strokeWidth={2.5} />
                        </button>
                        <a
                            href="tel:+8801711000000"
                            className="px-3 py-2 border-r border-white/20 hover:bg-white/10 flex items-center justify-center"
                            title="Call Administration"
                        >
                            <Phone size={12} strokeWidth={2.5} />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 hover:bg-white/10 flex items-center justify-center"
                            title="Watch Campus Video"
                        >
                            <Video size={12} strokeWidth={2.5} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white py-2 md:py-3 border-b border-slate-100">
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <SchoolLogo variant="wide" />
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
                        <Link href={route('admissions')} className="text-[14px] font-bold text-slate-700 hover:text-[#16a34a] transition-colors">
                            Admissions
                        </Link>
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
                    <div className="bg-[#16a34a] text-white p-4 grid grid-cols-2 gap-2 text-xs font-bold">
                        {topBarLinks.map((link, index) => {
                            const isHashLink = link.url.includes('#');
                            const linkClasses = "p-2 border border-white/20 rounded hover:bg-white/10";

                            return isHashLink ? (
                                <a key={index} href={link.url} className={linkClasses}>
                                    {link.name}
                                </a>
                            ) : (
                                <Link key={index} href={link.url} className={linkClasses}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                    <nav className="flex flex-col py-2">
                        {mainNavLinks.map((link, index) => {
                            if (link === 'Admission') {
                                return (
                                    <Link
                                        key={index}
                                        href={route('admissions')}
                                        className="flex items-center justify-between px-5 py-3 text-[15px] font-bold text-slate-700 hover:bg-[#16a34a]/5 hover:text-[#16a34a] border-b border-slate-50 last:border-0 cursor-pointer"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>{link}</span>
                                    </Link>
                                );
                            }
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-5 py-3 text-[15px] font-bold text-slate-700 hover:bg-[#16a34a]/5 hover:text-[#16a34a] border-b border-slate-50 last:border-0 cursor-pointer"
                                >
                                    <span>{link}</span>
                                    <ChevronDown size={16} />
                                </div>
                            );
                        })}
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="m-4 flex items-center justify-center py-3 bg-[#16a34a] text-white font-bold rounded-lg">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href={route('student.login')} className="m-4 flex items-center justify-center py-3 bg-[#16a34a] text-white font-bold rounded-lg">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
