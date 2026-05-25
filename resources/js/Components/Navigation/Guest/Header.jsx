import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Heart, User, ChevronDown, MapPin, ShoppingCart, Grid } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

// Grogin Brand Colors
const BRAND = {
    primary: '#5c319e', // Grogin Purple
    accent: '#ea580c',  // Grogin Orange
    bgGray: '#f3f4f7',  // Search box background
};

export default function Header({ categories = [], brands = [] }) {
    const { component } = usePage();
    const { t, locale } = useTranslation();
    const [search, setSearch] = useState('');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    
    const isProductDetail = component === 'Frontend/Products/Show';
    const isFilterPage = component === 'Frontend/Products/Index';
    const isAuthPage = component.startsWith('Auth/');
    const hideAllCategories = isProductDetail || isFilterPage;

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
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar (Purple) */}
            <div className="bg-[#5c319e] text-white text-[12px] py-2 hidden lg:block">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <p className="font-medium">FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.</p>
                    <p className="font-medium">
                        Until the end of the sale: <strong className="font-bold text-lg leading-none align-middle mx-1">80</strong> days <strong className="font-bold text-lg leading-none align-middle mx-1">07</strong> hours <strong className="font-bold text-lg leading-none align-middle mx-1">55</strong> minutes <strong className="font-bold text-lg leading-none align-middle mx-1">47</strong> sec.
                    </p>
                </div>
            </div>

            {/* Second Bar (White) */}
            <div className="bg-white border-b border-slate-100 text-slate-500 text-[12px] py-2 hidden lg:block">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Link href="#" className="hover:text-[#5c319e] transition-colors">{t('About Us')}</Link>
                        <Link href="#" className="hover:text-[#5c319e] transition-colors">{t('Contact')}</Link>
                        <Link href="#" className="hover:text-[#5c319e] transition-colors">{t('Blog')}</Link>
                        <span className="text-slate-400 pl-5 border-l border-slate-200">{t('We deliver to you every day from')} <strong className="text-[#ea580c] font-bold">7:00 to 23:00</strong></span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative" onMouseLeave={() => setLangDropdownOpen(false)}>
                            <div 
                                className="flex items-center gap-1 hover:text-[#5c319e] cursor-pointer transition-colors"
                                onMouseEnter={() => setLangDropdownOpen(true)}
                            >
                                {locale === 'bn' ? 'বাংলা' : 'English'} <ChevronDown size={12} />
                            </div>
                            {langDropdownOpen && (
                                <div className="absolute top-full left-0 w-28 bg-white border border-slate-100 shadow-lg rounded-b-md py-2 z-50">
                                    <Link href={route('language.switch', 'en')} className="block px-4 py-1.5 hover:bg-[#f3f4f7] hover:text-[#5c319e] transition-colors">English</Link>
                                    <Link href={route('language.switch', 'bn')} className="block px-4 py-1.5 hover:bg-[#f3f4f7] hover:text-[#5c319e] transition-colors">বাংলা</Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#5c319e] cursor-pointer transition-colors">{t('USD')} <ChevronDown size={12} /></div>
                        <Link href="#" className="hover:text-[#5c319e] transition-colors">{t('Order Tracking')}</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white py-5">
                <div className="container mx-auto px-4 flex items-center gap-5 lg:gap-8">
                    
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="relative text-[#5c319e]">
                            <ShoppingCart size={34} strokeWidth={2.5} />
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ea580c] rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-[28px] font-black tracking-tight text-[#5c319e]">
                            grogin
                        </span>
                    </Link>

                    {/* Search */}
                    <div className="flex-1 max-w-3xl relative hidden md:block">
                        <input
                            type="text"
                            placeholder={t('Search for products, categories or brands...')}
                            className="w-full h-[46px] pl-5 pr-14 rounded-lg bg-[#f3f4f7] text-slate-800 border-none outline-none focus:ring-1 focus:ring-[#5c319e] text-[13px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="absolute right-0 top-0 h-[46px] w-[46px] flex items-center justify-center text-slate-800 hover:text-[#5c319e] transition-colors">
                            <Search size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-5 ml-auto">
                        <Link href={route('login')} className="flex items-center gap-2 group">
                            <User size={26} className="text-slate-800 group-hover:text-[#5c319e] transition-colors" strokeWidth={1.5} />
                            <div className="hidden lg:block leading-tight">
                                <span className="block text-[11px] text-slate-500">{t('Sign In')}</span>
                                <span className="block text-[13px] font-bold text-slate-800 group-hover:text-[#5c319e] transition-colors">{t('Account')}</span>
                            </div>
                        </Link>

                        <Link href="#" className="relative group">
                            <Heart size={26} className="text-slate-800 group-hover:text-[#5c319e] transition-colors" strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white box-content">0</span>
                        </Link>

                        <Link href="#" className="relative group">
                            <ShoppingCart size={26} className="text-slate-800 group-hover:text-[#5c319e] transition-colors" strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white box-content">0</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Bar */}
            {!isAuthPage && (
                <div className="bg-white border-b border-slate-200 hidden md:block">
                    <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center h-[50px]">
                        {/* All Categories Button */}
                        {!hideAllCategories && (
                            <div className="hidden lg:block lg:col-span-3 h-full relative">
                                <button className="w-full h-[calc(100%+1px)] bg-white border border-slate-200 border-b-0 flex items-center justify-between px-5 text-slate-800 font-bold rounded-t-xl relative z-40 top-[1px]">
                                    <div className="flex items-center gap-2.5 text-[14px]">
                                        <Grid size={18} className="text-[#5c319e]" strokeWidth={1.5} />
                                        {t('All Categories')}
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </button>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className={`flex items-center justify-between w-full h-full ${hideAllCategories ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
                            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] xl:text-[14px] font-bold text-slate-800 h-full whitespace-nowrap">
                                <div className="h-full relative group">
                                    <Link href="/" className="text-[#5c319e] flex items-center gap-1 h-full border-b-2 border-[#5c319e]">{t('Home')} <ChevronDown size={14} /></Link>
                                </div>

                                {/* Shop Dropdown */}
                                <div className="h-full relative group">
                                    <Link href="#" className="hover:text-[#5c319e] flex items-center gap-1 h-full border-b-2 border-transparent transition-colors">
                                        {t('Shop')} <ChevronDown size={14} />
                                    </Link>

                                    {/* Simplified Practical Shop Menu */}
                                    <div className="absolute top-full left-0 w-[220px] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-b-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-[3px] border-t-[#5c319e]">
                                        <ul className="text-[14px] text-slate-600 font-medium">
                                            <li><Link href={route('frontend.url', 'shop')} className="block px-5 py-2.5 hover:text-[#5c319e] hover:bg-[#f3f4f7] transition-colors">{t('All Products')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-[#5c319e] hover:bg-[#f3f4f7] transition-colors">{t('New Arrivals')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-[#5c319e] hover:bg-[#f3f4f7] transition-colors">{t('Best Sellers')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-red-500 hover:bg-red-50 transition-colors">{t('Special Offers')}</Link></li>
                                            <li className="border-t border-slate-100 mt-1 pt-1"><Link href="#" className="block px-5 py-2.5 hover:text-[#5c319e] hover:bg-[#f3f4f7] transition-colors">{t('Track Your Order')}</Link></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Dynamic Categories */}
                                {categories.slice(0, 2).map((cat) => (
                                    <Link key={cat.id} href={route('frontend.url', cat.path)} className="hover:text-[#5c319e] h-full flex items-center border-b-2 border-transparent transition-colors">
                                        {cat.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] xl:text-[14px] font-bold whitespace-nowrap">
                                <Link href="#" className="flex items-center gap-1 text-slate-800 hover:text-[#5c319e] transition-colors">
                                    {t('Trending Products')} <ChevronDown size={14} />
                                </Link>
                                <Link href="#" className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors">
                                    {t('Almost Finished')}
                                    <span className="bg-[#ea580c] text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">{t('SALE')}</span>
                                    <ChevronDown size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </header>
    );
}
