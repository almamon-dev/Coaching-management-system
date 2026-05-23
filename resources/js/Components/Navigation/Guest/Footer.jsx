import { Link, usePage } from '@inertiajs/react';
import { Camera, MapPin, MessagesSquare, Phone, Share2, Video, Wrench } from 'lucide-react';

const BRAND_PRIMARY = '#7C3AED';
const BRAND_ACCENT  = '#A855F7';
const HEADER_BG     = '#0F0A1E';

export default function Footer() {
    const { pages = [] } = usePage().props;

    const getPageUrl = (slug, fallback = '#') => {
        const found = pages.find(p => p.slug === slug);
        return found ? route('frontend.pages.show', found.slug) : fallback;
    };

    return (
        <footer style={{ backgroundColor: HEADER_BG }} className="text-white pt-16 pb-8 mt-0 border-t border-slate-900 shadow-inner">
            <div className="container mx-auto px-4">

                {/* Main 5-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">

                    {/* Column 1: Support Hotline, Store Locator & Repair Center */}
                    <div className="space-y-6">
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5 text-slate-400">Support</h4>
                        
                        {/* Hotline */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400 border border-white/10">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500 font-bold ">Hotline</p>
                                <p className="text-[14px] font-extrabold text-white">16793</p>
                            </div>
                        </div>

                        {/* Store Locator */}
                        <Link href={getPageUrl('store-locator')} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400 border border-white/10 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500 font-bold ">Store Locator</p>
                                <p className="text-[10px] hover:underline font-bold text-slate-350 group-hover:text-white transition-colors">Find Our Stores</p>
                            </div>
                        </Link>

                        {/* Repair Center */}
                        <Link href={getPageUrl('repair-center')} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400 border border-white/10 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Wrench size={18} />
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500 font-bold ">Repair Center</p>
                                <p className="text-[10px] hover:underline font-bold text-slate-350 group-hover:text-white transition-colors">Find a Service Center</p>
                            </div>
                        </Link>
                    </div>

                    {/* Column 2: About Us */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>About Us</h4>
                        <ul className="space-y-3 text-[13px] text-slate-400 font-medium">
                            <li>
                                <Link href={getPageUrl('affiliate-program')} className="hover:text-white transition-colors">Affiliate Program</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('online-delivery')} className="hover:text-white transition-colors">Online Delivery</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('return-policy')} className="hover:text-white transition-colors">Refund and Return Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('blog')} className="hover:text-white transition-colors">Blog</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>Policies</h4>
                        <ul className="space-y-3 text-[13px] text-slate-400 font-medium">
                            <li>
                                <Link href={getPageUrl('emi-terms')} className="hover:text-white transition-colors">EMI Terms</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('star-point-policy')} className="hover:text-white transition-colors">Star Point Policy</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('contact-us')} className="hover:text-white transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5" style={{ color: BRAND_ACCENT }}>Company</h4>
                        <ul className="space-y-3 text-[13px] text-slate-400 font-medium">
                            <li>
                                <Link href={getPageUrl('our-story')} className="hover:text-white transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('terms-and-conditions')} className="hover:text-white transition-colors">Terms and Conditions</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('careers')} className="hover:text-white transition-colors">Career</Link>
                            </li>
                            <li>
                                <Link href={getPageUrl('brands')} className="hover:text-white transition-colors">Brand</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Stay Connected */}
                    <div className="space-y-4">
                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Stay Connected</h4>
                        <div className="text-[13px] text-slate-400 leading-relaxed font-medium space-y-2">
                            <p className="font-bold text-white">GadgetZone Ltd.</p>
                            <p>Head Office: House-12, Road-05, Dhanmandi, Dhaka-1205</p>
                            <p className="text-[12px]">Email: <span className="text-purple-400">support@gadgetzone.com.bd</span></p>
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
                                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all text-slate-400 border border-white/5">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[13px] text-slate-500">
                        &copy; {new Date().getFullYear()} GadgetZone. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <span>Secure payments via</span>
                        <span className="font-bold text-slate-400">bKash · Nagad · Visa · MasterCard</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
