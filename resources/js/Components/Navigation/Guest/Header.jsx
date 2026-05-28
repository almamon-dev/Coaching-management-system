import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Heart, User, ChevronDown, MapPin, Plus, ShoppingCart, Grid } from 'lucide-react';
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
                                className="flex items-center gap-1 hover:text-[#5c319e] cursor-pointer transition-colors"
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

            {/* Main Header */}
            <div className="bg-white py-5">
                <div className="container mx-auto px-4 flex items-center gap-5 lg:gap-8">

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
                                    <div className="h-full relative group">
                                        <Link href="#" className="flex items-center gap-1 text-slate-800 group-hover:text-[#5c319e] transition-colors h-full">
                                            {t('Trending Products')} <ChevronDown size={14} />
                                        </Link>

                                        {/* Trending Products Megamenu */}
                                        <div className="absolute top-full right-0 w-[950px] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-b-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-[3px] border-t-[#5c319e]">
                                            <div className="grid grid-cols-4 gap-6">
                                                {/* Dummy Product 1 */}
                                                <div className="group/card relative">
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">21%</div>
                                                    <button className="absolute top-2 right-2 text-slate-800 hover:text-[#ea580c] z-10"><Heart size={20} strokeWidth={1.5} /></button>

                                                    <div className="relative mb-3 h-[140px] flex items-center justify-center">
                                                        <img src="https://placehold.co/200x200/transparent/5c319e?text=Pizza" alt="Product" className="max-h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300" />
                                                        <button className="absolute -bottom-1 right-0 w-8 h-8 bg-[#5c319e] text-white rounded-full flex items-center justify-center hover:bg-[#4a267c] transition-colors shadow-md z-10"><Plus size={16} strokeWidth={2.5} /></button>
                                                    </div>

                                                    <div className="mb-2">
                                                        <span className="bg-cyan-100 text-cyan-600 text-[9px] font-black uppercase px-2 py-0.5 rounded inline-flex items-center gap-1">❄️ COLD SALE</span>
                                                    </div>

                                                    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
                                                        {[1, 2, 3, 4].map(i => <svg key={i} fill="currentColor" viewBox="0 0 20 20" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                                                        <span className="text-[11px] text-slate-400 ml-1">3</span>
                                                    </div>

                                                    <h4 className="text-[13px] font-bold text-[#202223] leading-tight mb-3 line-clamp-2 min-h-[36px]">California Pizza Kitchen Margherita, Crispy Thin Crust...</h4>

                                                    <div className="flex items-end gap-2 mb-4">
                                                        <span className="text-[20px] font-black text-red-500 leading-none">$11.77</span>
                                                        <span className="text-[13px] text-slate-500 line-through leading-none pb-0.5">$14.77</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-medium text-slate-400">This product is about to run out</p>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[80%] rounded-full"></div>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-slate-500 pt-0.5">available only: <span className="font-bold text-slate-800">105</span></p>
                                                    </div>
                                                </div>

                                                {/* Dummy Product 2 */}
                                                <div className="group/card relative">
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">41%</div>
                                                    <button className="absolute top-2 right-2 text-slate-800 hover:text-[#ea580c] z-10"><Heart size={20} strokeWidth={1.5} /></button>

                                                    <div className="relative mb-3 h-[140px] flex items-center justify-center">
                                                        <img src="https://placehold.co/200x200/transparent/ea580c?text=Juice" alt="Product" className="max-h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300" />
                                                        <button className="absolute -bottom-1 right-0 w-8 h-8 bg-[#5c319e] text-white rounded-full flex items-center justify-center hover:bg-[#4a267c] transition-colors shadow-md z-10"><Plus size={16} strokeWidth={2.5} /></button>
                                                    </div>

                                                    <div className="mb-2 min-h-[22px]"></div>

                                                    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
                                                        {[1, 2, 3, 4, 5].map(i => <svg key={i} fill="currentColor" viewBox="0 0 20 20" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                                                        <span className="text-[11px] text-slate-400 ml-1">2</span>
                                                    </div>

                                                    <h4 className="text-[13px] font-bold text-[#202223] leading-tight mb-3 line-clamp-2 min-h-[36px]">Simply Orange Pulp Free Juice – 52 fl oz</h4>

                                                    <div className="flex items-end gap-2 mb-4">
                                                        <span className="text-[20px] font-black text-red-500 leading-none">$2.45</span>
                                                        <span className="text-[13px] text-slate-500 line-through leading-none pb-0.5">$4.13</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-medium text-slate-400">This product is about to run out</p>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[40%] rounded-full"></div>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-slate-500 pt-0.5">available only: <span className="font-bold text-slate-800">26</span></p>
                                                    </div>
                                                </div>

                                                {/* Dummy Product 3 */}
                                                <div className="group/card relative">
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">11%</div>
                                                    <button className="absolute top-2 right-2 text-slate-800 hover:text-[#ea580c] z-10"><Heart size={20} strokeWidth={1.5} /></button>

                                                    <div className="relative mb-3 h-[140px] flex items-center justify-center">
                                                        <img src="https://placehold.co/200x200/transparent/059669?text=Frozen+Pizza" alt="Product" className="max-h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300" />
                                                        <button className="absolute -bottom-1 right-0 w-8 h-8 bg-[#5c319e] text-white rounded-full flex items-center justify-center hover:bg-[#4a267c] transition-colors shadow-md z-10"><Plus size={16} strokeWidth={2.5} /></button>
                                                    </div>

                                                    <div className="mb-2">
                                                        <span className="bg-cyan-100 text-cyan-600 text-[9px] font-black uppercase px-2 py-0.5 rounded inline-flex items-center gap-1">❄️ COLD SALE</span>
                                                    </div>

                                                    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
                                                        {[1, 2, 3, 4].map(i => <svg key={i} fill="currentColor" viewBox="0 0 20 20" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                                                        <span className="text-[11px] text-slate-400 ml-1">3</span>
                                                    </div>

                                                    <h4 className="text-[13px] font-bold text-[#202223] leading-tight mb-3 line-clamp-2 min-h-[36px]">Great Value Rising Crust Frozen Pizza, Supreme</h4>

                                                    <div className="flex items-end gap-2 mb-4">
                                                        <span className="text-[20px] font-black text-red-500 leading-none">$8.99</span>
                                                        <span className="text-[13px] text-slate-500 line-through leading-none pb-0.5">$9.99</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-medium text-slate-400">This product is about to run out</p>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[70%] rounded-full"></div>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-slate-500 pt-0.5">available only: <span className="font-bold text-slate-800">80</span></p>
                                                    </div>
                                                </div>

                                                {/* Dummy Product 4 */}
                                                <div className="group/card relative">
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">18%</div>
                                                    <button className="absolute top-2 right-2 text-slate-800 hover:text-[#ea580c] z-10"><Heart size={20} strokeWidth={1.5} /></button>

                                                    <div className="relative mb-3 h-[140px] flex items-center justify-center">
                                                        <img src="https://placehold.co/200x200/transparent/0284c7?text=Paper" alt="Product" className="max-h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300" />
                                                        <button className="absolute -bottom-1 right-0 w-8 h-8 bg-[#5c319e] text-white rounded-full flex items-center justify-center hover:bg-[#4a267c] transition-colors shadow-md z-10"><Plus size={16} strokeWidth={2.5} /></button>
                                                    </div>

                                                    <div className="mb-2 min-h-[22px]"></div>

                                                    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
                                                        {[1, 2, 3, 4].map(i => <svg key={i} fill="currentColor" viewBox="0 0 20 20" className="w-3.5 h-3.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                                                        <span className="text-[11px] text-slate-400 ml-1">3</span>
                                                    </div>

                                                    <h4 className="text-[13px] font-bold text-[#202223] leading-tight mb-3 line-clamp-2 min-h-[36px]">Angel Soft Toilet Paper, 9 Mega Rolls</h4>

                                                    <div className="flex items-end gap-2 mb-4">
                                                        <span className="text-[20px] font-black text-red-500 leading-none">$14.12</span>
                                                        <span className="text-[13px] text-slate-500 line-through leading-none pb-0.5">$17.12</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-medium text-slate-400">This product is about to run out</p>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[15%] rounded-full"></div>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-slate-500 pt-0.5">available only: <span className="font-bold text-slate-800">21</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
