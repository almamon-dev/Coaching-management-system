import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Search, Gift, Zap, User, ChevronRight, Store, ShoppingBag } from 'lucide-react';

// Brand colors — Super Shop palette (Fresh Green & Warm Amber)
const BRAND = {
    primary: '#16a34a', // green-600
    primaryHover: '#15803d', // green-700
    accent: '#f59e0b', // amber-500
    headerBg: '#14532d', // green-900 (deep organic green)
};

export default function Header({ categories = [], brands = [] }) {
    const [search, setSearch] = useState('');

    const categoryTree = React.useMemo(() => {
        if (!categories || categories.length === 0) return [];
        const looksLikeTree = categories.every(cat => cat.parent_id === null);
        if (looksLikeTree) return categories;
        const buildTree = (parentId = null) =>
            categories
                .filter(cat => cat.parent_id === parentId && cat.status === 1)
                .map(cat => ({ ...cat, children: buildTree(cat.id) }));
        return buildTree(null);
    }, [categories]);

    return (
        <header className="sticky top-0 z-50 shadow-lg">
            {/* Main Header */}
            <div style={{ backgroundColor: BRAND.headerBg }} className="py-3.5 text-white">
                <div className="container mx-auto px-4 flex items-center justify-between gap-8">

                    {/* Premium CSS Super Shop Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md transition-transform hover:scale-105">
                            <ShoppingBag size={22} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-white block leading-none font-inter">
                                Daily<span className="text-amber-400">Fresh</span>
                            </span>
                            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                                Super Shop
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="Search fresh fruits, vegetables, dairy, household items..."
                            className="w-full h-11 pl-4 pr-12 rounded-lg bg-white/10 text-white border border-white/20 outline-none placeholder:text-emerald-200/50 text-sm font-medium backdrop-blur-sm transition-all focus:bg-white/15 focus:border-amber-400"
                            style={{ '--tw-ring-color': BRAND.accent }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <Link href="/offer" className="flex items-center gap-2.5 group">
                            <div className="p-1.5 rounded-lg group-hover:bg-white/10 transition-all">
                                <Gift style={{ color: BRAND.accent }} size={22} />
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[13px] font-bold leading-tight text-white group-hover:text-amber-300 transition-colors">Offers</p>
                                <p className="text-[10px] text-emerald-200">Daily Deals</p>
                            </div>
                        </Link>

                        <a href="#!" onClick={(e) => e.preventDefault()} className="flex items-center gap-2.5 group">
                            <div className="p-1.5 rounded-lg group-hover:bg-white/10 transition-all">
                                <Zap style={{ color: BRAND.accent }} size={22} />
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[13px] font-bold leading-tight text-white group-hover:text-amber-300 transition-colors">Flash Sale</p>
                                <p className="text-[10px] text-emerald-200">Limited Time</p>
                            </div>
                        </a>

                        <Link href={route('login')} className="flex items-center gap-2.5 group">
                            <div className="p-1.5 rounded-lg group-hover:bg-white/10 transition-all">
                                <User style={{ color: BRAND.accent }} size={22} />
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[13px] font-bold leading-tight text-white group-hover:text-amber-300 transition-colors">Account</p>
                                <p className="text-[10px] text-emerald-200">Login / Register</p>
                            </div>
                        </Link>

                        <Link
                            href="/offer"
                            className="text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-lg transition-all hidden xl:block uppercase tracking-wide"
                            style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})` }}
                        >
                            Hot Deals
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 hidden md:block">
                <div className="container mx-auto px-4 overflow-visible">
                    <ul className="flex items-center justify-between w-full">
                        {categoryTree.map((category) => (
                            <li key={category.id} className="group relative">
                                <Link
                                    href={route('frontend.url', category.path)}
                                    prefetch
                                    className="block px-1.5 xl:px-2 py-3 text-[11px] xl:text-[13px] font-bold text-slate-700 hover:text-green-600 transition-colors whitespace-nowrap"
                                >
                                    {category.name}
                                </Link>

                                {/* Dropdown Level 1 */}
                                {category.children && category.children.length > 0 && (() => {
                                    const subs = category.children;
                                    const ITEM_HEIGHT_PX = 28;
                                    const MAX_HEIGHT_PX = 600;
                                    const COLUMN_THRESHOLD = Math.floor(MAX_HEIGHT_PX / ITEM_HEIGHT_PX);
                                    const useColumns = subs.length > COLUMN_THRESHOLD;
                                    const half = Math.ceil(subs.length / 2);
                                    const col1 = useColumns ? subs.slice(0, half) : subs;
                                    const col2 = useColumns ? subs.slice(half) : [];

                                    const renderSubItem = (sub) => (
                                        <div key={sub.id} className="group/sub relative">
                                            <Link
                                                href={route('frontend.url', sub.path)}
                                                prefetch
                                                className="flex items-center justify-between px-4 py-1 text-[13px] font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors group/subitem"
                                            >
                                                <span className="whitespace-nowrap">{sub.name}</span>
                                                {sub.children && sub.children.length > 0 && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                                                        className="text-green-400 ml-2 flex-shrink-0 transition-transform group-hover/subitem:translate-x-0.5"
                                                        style={{ marginTop: '1px' }}>
                                                        <path d="M8 5L18 12L8 19V5Z" />
                                                    </svg>
                                                )}
                                            </Link>

                                            {sub.children && sub.children.length > 0 && (
                                                <div className="absolute left-full top-0 invisible opacity-0 group-hover/sub:visible group-hover/sub:opacity-100 translate-x-1 group-hover/sub:translate-x-0 transition-all duration-200 min-w-max bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] border-l border-slate-100 z-50">
                                                    <div className="py-1">
                                                        {sub.children.map((subSub) => (
                                                            <Link key={subSub.id} href={route('frontend.url', subSub.path)}
                                                                prefetch
                                                                className="block px-4 py-1 text-[13px] font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                                                                {subSub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div className="absolute left-0 top-full invisible opacity-0 group-hover:visible group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] border-t-[3px] z-50"
                                            style={{ borderTopColor: BRAND.primary }}>
                                            <div className="flex">
                                                <div className="py-1 min-w-[190px]">
                                                    {col1.map(renderSubItem)}
                                                </div>
                                                {useColumns && (
                                                    <div className="py-1 min-w-[190px] border-l border-slate-100">
                                                        {col2.map(renderSubItem)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="border-t border-slate-100">
                                                <Link href={route('frontend.url', category.path)}
                                                    className="block px-4 py-1.5 text-[13px] font-bold text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors">
                                                    Show All {category.name}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
