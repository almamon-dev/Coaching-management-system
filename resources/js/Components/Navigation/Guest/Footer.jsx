import { Link, usePage } from '@inertiajs/react';
import { Camera, MapPin, MessagesSquare, Phone, Share2, Video, Truck, HelpCircle } from 'lucide-react';

const BRAND_PRIMARY = '#16a34a'; // green-600
const BRAND_ACCENT  = '#f59e0b'; // amber-500
const HEADER_BG     = '#14532d'; // green-900

export default function Footer() {
    const { pages = [] } = usePage().props;

    const getPageUrl = (slug, fallback = '#') => {
        const found = pages.find(p => p.slug === slug);
        return found ? route('frontend.pages.show', found.slug) : fallback;
    };

    return (
        <footer style={{ backgroundColor: HEADER_BG }} className="text-white pt-16 pb-8 mt-0 border-t border-emerald-950 shadow-inner">
            <div className="container mx-auto px-4">

                {/* Main 5-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">

                    {/* Column 1: Support Hotline, Store Locator & Repair Center */}
                    <div className="space-y-6">
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5 text-emerald-250">Support</h4>
                        
                        {/* Hotline */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-emerald-350 font-bold">Hotline</p>
                                <p className="text-[14px] font-extrabold text-white">16793</p>
                            </div>
                        </div>

                        {/* Store Locator */}
                        <Link href={getPageUrl('store-locator')} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400 border border-white/10 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-emerald-350 font-bold">Store Locator</p>
                                <p className="text-[10px] hover:underline font-bold text-slate-350 group-hover:text-white transition-colors">Find Our Outlets</p>
                            </div>
                        </Link>

                        {/* Express Delivery info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
                                <Truck size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-emerald-350 font-bold">Home Delivery</p>
                                <p className="text-[10px] font-bold text-slate-350">Same-Day Express</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: About Us */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>About Us</h4>
                        <ul className="space-y-3 text-[13px] text-emerald-200/80 font-medium">
                            <li>
                                <Link href={getPageUrl('affiliate-program')} className="hover:text-white transition-colors">Affiliate Program</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('online-delivery')} className="hover:text-white transition-colors">Online Delivery Info</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('return-policy')} className="hover:text-white transition-colors">Refund & Return Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('blog')} className="hover:text-white transition-colors">Our Blog</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>Policies</h4>
                        <ul className="space-y-3 text-[13px] text-emerald-200/80 font-medium">
                            <li>
                                <Link href={getPageUrl('faq')} className="hover:text-white transition-colors">FAQs & Help</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('star-point-policy')} className="hover:text-white transition-colors">DailyFresh Points Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('contact-us')} className="hover:text-white transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>Company</h4>
                        <ul className="space-y-3 text-[13px] text-emerald-200/80 font-medium">
                            <li>
                                <Link href={getPageUrl('our-story')} className="hover:text-white transition-colors">Our Story</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('terms-and-conditions')} className="hover:text-white transition-colors">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('careers')} className="hover:text-white transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('brands')} className="hover:text-white transition-colors">Product Brands</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Stay Connected */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-emerald-200/80">Stay Connected</h4>
                        <div className="text-[13px] text-emerald-200/80 leading-relaxed font-medium space-y-2">
                            <p className="font-bold text-white">DailyFresh Super Shop Ltd.</p>
                            <p>Head Office: House-24, Road-04, Dhanmondi, Dhaka-1209</p>
                            <p className="text-[12px]">Email: <span className="text-amber-400">support@dailyfresh.com.bd</span></p>
                        </div>
                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { icon: Share2, href: '#' },
                                { icon: Video, href: '#' },
                                { icon: Camera, href: '#' },
                                { icon: MessagesSquare, href: '#' },
                            ].map(({ icon: Icon, href }, i) => (
                                <Link key={i} href={href}
                                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-slate-400 border border-white/5">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[13px] text-slate-400">
                        &copy; {new Date().getFullYear()} DailyFresh Super Shop. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-slate-400">
                        <span>Secure payments via</span>
                        <span className="font-bold text-slate-350">bKash · Nagad · Visa · MasterCard</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
