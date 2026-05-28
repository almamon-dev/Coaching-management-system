import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Heart, User, ChevronDown, MapPin, ShoppingCart, Grid, Menu, X } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import { useFrontend } from '@/Contexts/FrontendContext';

// DailyFresh Brand Colors
const BRAND = {
    primary: '#16a34a', // green-600
    accent: '#f59e0b',  // amber-500
    bgGray: '#f3f4f7',  // Search box background
};

export default function Header({ categories = [], brands = [] }) {
    const { component, props } = usePage();
    const { pages = [], auth } = props;
    const { t, locale } = useTranslation();
    const { cartItems, setIsCartOpen } = useFrontend();
    const [search, setSearch] = useState('');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    
    const getPageUrl = (slug, fallback = '#') => {
        const found = pages.find(p => p.slug === slug);
        return found ? route('frontend.pages.show', found.slug) : fallback;
    };
    
    const isProductDetail = component === 'Frontend/Products/Show';
    const isFilterPage = component === 'Frontend/Products/Index';
    const isCheckoutPage = component === 'Frontend/Checkout';
    const isOrderSuccessPage = component === 'Frontend/OrderSuccess';
    const isAuthPage = component.startsWith('Auth/');
    
    const hideAllCategories = isProductDetail || isFilterPage || isCheckoutPage || isOrderSuccessPage;

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
            {/* Top Bar (Green) */}
            <div className="bg-[#16a34a] text-white text-[12px] py-2 hidden lg:block">
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
                        <Link href={getPageUrl('our-story')} className="hover:text-[#16a34a] transition-colors">{t('About Us')}</Link>
                        <Link href={getPageUrl('contact-us')} className="hover:text-[#16a34a] transition-colors">{t('Contact')}</Link>
                        <Link href={getPageUrl('blog')} className="hover:text-[#16a34a] transition-colors">{t('Blog')}</Link>
                        <span className="text-slate-400 pl-5 border-l border-slate-200">{t('We deliver to you every day from')} <strong className="text-[#f59e0b] font-bold">7:00 to 23:00</strong></span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative" onMouseLeave={() => setLangDropdownOpen(false)}>
                            <div 
                                className="flex items-center gap-1 hover:text-[#16a34a] cursor-pointer transition-colors"
                                onMouseEnter={() => setLangDropdownOpen(true)}
                            >
                                {locale === 'bn' ? 'বাংলা' : 'English'} <ChevronDown size={12} />
                            </div>
                            {langDropdownOpen && (
                                <div className="absolute top-full left-0 w-28 bg-white border border-slate-100 shadow-lg rounded-b-md py-2 z-50">
                                    <Link href={route('language.switch', 'en')} className="block px-4 py-1.5 hover:bg-[#f3f4f7] hover:text-[#16a34a] transition-colors">English</Link>
                                    <Link href={route('language.switch', 'bn')} className="block px-4 py-1.5 hover:bg-[#f3f4f7] hover:text-[#16a34a] transition-colors">বাংলা</Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#16a34a] cursor-pointer transition-colors">{t('USD')} <ChevronDown size={12} /></div>
                        <Link href="#" className="hover:text-[#16a34a] transition-colors">{t('Order Tracking')}</Link>
                    </div>
                </div>
            </div>

            {/* Main Header (Mobile & Desktop) */}
            <div className="bg-white py-3 md:py-5 border-b md:border-none border-slate-100">
                <div className="container mx-auto px-4 flex items-center justify-between gap-3 md:gap-5 lg:gap-8">
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-slate-800 hover:text-[#16a34a] transition-colors flex-shrink-0"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} strokeWidth={2} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="relative text-[#16a34a]">
                            <ShoppingCart size={28} className="md:w-[34px] md:h-[34px]" strokeWidth={2.5} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 bg-[#f59e0b] rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-[20px] md:text-[28px] font-black tracking-tight text-[#16a34a]">
                            DailyFresh
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="flex-1 max-w-3xl relative hidden md:block">
                        <input
                            type="text"
                            placeholder={t('Search for grocery, categories or brands...')}
                            className="w-full h-[46px] pl-5 pr-14 rounded-lg bg-[#f3f4f7] text-slate-800 border-none outline-none focus:ring-1 focus:ring-[#16a34a] text-[13px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="absolute right-0 top-0 h-[46px] w-[46px] flex items-center justify-center text-slate-800 hover:text-[#16a34a] transition-colors bg-[#f59e0b] text-white rounded-r-lg hover:bg-amber-600">
                            <Search size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4 md:gap-5 ml-auto">
                        {/* Mobile Search Toggle */}
                        <button 
                            className="md:hidden text-slate-800 hover:text-[#16a34a]"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        >
                            <Search size={22} strokeWidth={2} />
                        </button>

                        {auth?.user ? (
                            <Link href={route('dashboard')} className="hidden md:flex items-center gap-2 group">
                                {auth.user.profile_picture ? (
                                    <img src={auth.user.profile_picture} alt={auth.user.name} className="w-[26px] h-[26px] rounded-full object-cover border border-slate-200" />
                                ) : (
                                    <User size={26} className="text-slate-800 group-hover:text-[#16a34a] transition-colors" strokeWidth={1.5} />
                                )}
                                <div className="hidden lg:block leading-tight">
                                    <span className="block text-[11px] text-slate-500">{t('Hello')},</span>
                                    <span className="block text-[13px] font-bold text-slate-800 group-hover:text-[#16a34a] transition-colors truncate max-w-[100px]">{auth.user.name.split(' ')[0]}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link href={route('login')} className="hidden md:flex items-center gap-2 group">
                                <User size={26} className="text-slate-800 group-hover:text-[#16a34a] transition-colors" strokeWidth={1.5} />
                                <div className="hidden lg:block leading-tight">
                                    <span className="block text-[11px] text-slate-500">{t('Sign In')}</span>
                                    <span className="block text-[13px] font-bold text-slate-800 group-hover:text-[#16a34a] transition-colors">{t('Account')}</span>
                                </div>
                            </Link>
                        )}

                        <Link href="#" className="relative group hidden md:block">
                            <Heart size={26} className="text-slate-800 group-hover:text-[#16a34a] transition-colors" strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white box-content">0</span>
                        </Link>

                        <button onClick={() => setIsCartOpen(true)} className="relative group focus:outline-none">
                            <ShoppingCart size={24} className="md:w-[26px] md:h-[26px] text-slate-800 group-hover:text-[#16a34a] transition-colors" strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white box-content">
                                {cartItems?.length || 0}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Expandable) */}
            {mobileSearchOpen && (
                <div className="md:hidden bg-white p-3 border-b border-slate-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('Search products...')}
                            className="w-full h-[40px] pl-4 pr-12 rounded-lg bg-[#f3f4f7] text-slate-800 border-none outline-none focus:ring-1 focus:ring-[#16a34a] text-[13px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="absolute right-0 top-0 h-[40px] w-[40px] flex items-center justify-center text-white bg-[#f59e0b] rounded-r-lg hover:bg-amber-600">
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Nav Bar (Desktop Only) */}
            {!isAuthPage && (
                <div className="bg-white border-b border-slate-200 hidden md:block">
                    <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center h-[50px]">
                        {/* All Categories Button */}
                        {!hideAllCategories && (
                            <div className="hidden lg:block lg:col-span-3 h-full relative">
                                <button className="w-full h-[calc(100%+1px)] bg-[#16a34a] text-white flex items-center justify-between px-5 font-bold rounded-t-xl relative z-40 top-[1px]">
                                    <div className="flex items-center gap-2.5 text-[14px]">
                                        <Grid size={18} strokeWidth={2} />
                                        {t('All Categories')}
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className={`flex items-center justify-between w-full h-full ${hideAllCategories ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
                            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] xl:text-[14px] font-bold text-slate-800 h-full whitespace-nowrap">
                                <div className="h-full relative group">
                                    <Link href="/" className="text-[#16a34a] flex items-center gap-1 h-full border-b-2 border-[#16a34a]">{t('Home')} <ChevronDown size={14} /></Link>
                                </div>

                                {/* Shop Dropdown */}
                                <div className="h-full relative group">
                                    <Link href="#" className="hover:text-[#16a34a] flex items-center gap-1 h-full border-b-2 border-transparent transition-colors">
                                        {t('Shop')} <ChevronDown size={14} />
                                    </Link>

                                    {/* Simplified Practical Shop Menu */}
                                    <div className="absolute top-full left-0 w-[220px] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-b-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-[3px] border-t-[#16a34a]">
                                        <ul className="text-[14px] text-slate-600 font-medium">
                                            <li><Link href={route('frontend.url', 'shop')} className="block px-5 py-2.5 hover:text-[#16a34a] hover:bg-[#f3f4f7] transition-colors">{t('All Products')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-[#16a34a] hover:bg-[#f3f4f7] transition-colors">{t('New Arrivals')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-[#16a34a] hover:bg-[#f3f4f7] transition-colors">{t('Best Sellers')}</Link></li>
                                            <li><Link href="#" className="block px-5 py-2.5 hover:text-red-500 hover:bg-red-50 transition-colors">{t('Special Offers')}</Link></li>
                                            <li className="border-t border-slate-100 mt-1 pt-1"><Link href="#" className="block px-5 py-2.5 hover:text-[#16a34a] hover:bg-[#f3f4f7] transition-colors">{t('Track Your Order')}</Link></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Dynamic Categories */}
                                {categories.slice(0, 3).map((cat) => (
                                    <Link key={cat.id} href={route('frontend.url', cat.path)} className="hover:text-[#16a34a] h-full flex items-center border-b-2 border-transparent transition-colors">
                                        {cat.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] xl:text-[14px] font-bold whitespace-nowrap">
                                <Link href="#" className="flex items-center gap-1 text-slate-800 hover:text-[#16a34a] transition-colors">
                                    {t('Trending Products')} <ChevronDown size={14} />
                                </Link>
                                <Link href="#" className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors">
                                    {t('Almost Finished')}
                                    <span className="bg-[#f59e0b] text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">{t('SALE')}</span>
                                    <ChevronDown size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="relative w-[80%] max-w-[300px] bg-white h-full flex flex-col overflow-y-auto transform transition-transform">
                        <div className="p-4 flex items-center justify-between bg-[#16a34a] text-white">
                            <span className="font-bold text-lg">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 py-4">
                            <ul className="text-[15px] font-medium text-slate-700">
                                <li>
                                    <Link href="/" className="block px-5 py-3 hover:bg-slate-50 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>{t('Home')}</Link>
                                </li>
                                <li>
                                    <Link href={route('frontend.url', 'shop')} className="block px-5 py-3 hover:bg-slate-50 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>{t('Shop')}</Link>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link href={route('frontend.url', cat.path)} className="block px-5 py-3 hover:bg-slate-50 border-b border-slate-50" onClick={() => setMobileMenuOpen(false)}>
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                                {auth?.user ? (
                                    <li>
                                        <Link href={route('dashboard')} className="block px-5 py-3 hover:bg-slate-50 text-[#16a34a] font-bold" onClick={() => setMobileMenuOpen(false)}>
                                            {t('My Dashboard')}
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link href={route('login')} className="block px-5 py-3 hover:bg-slate-50 text-[#16a34a] font-bold" onClick={() => setMobileMenuOpen(false)}>
                                            {t('Sign In / Account')}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
