import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone, Share2, Camera, MessagesSquare, Video, BookOpen } from 'lucide-react';
import SchoolLogo from '@/Components/SchoolLogo';

export default function Footer() {
    return (
        <footer className="bg-indigo-950 text-slate-300 pt-16 pb-8 border-t border-indigo-900 font-inter print:hidden">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex bg-white/95 px-3 py-2 rounded-lg shadow-sm">
                            <SchoolLogo variant="wide" className="[&_img]:h-9" />
                        </Link>
                        <p className="text-[14px] leading-relaxed text-indigo-200">
                            Knowledge · Discipline · Service. Established in 1968, Kirtonia Yousob Ali Bhuyan High School is committed to nurturing future leaders through quality education and strong values.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-[14px] font-bold uppercase tracking-widest mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-4 text-[14px] font-medium">
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Academics</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Admissions</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Careers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Portals & Policies */}
                    <div>
                        <h4 className="text-[14px] font-bold uppercase tracking-widest mb-6 text-white">Resources</h4>
                        <ul className="space-y-4 text-[14px] font-medium">
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Student Portal</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Parent Portal</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div className="space-y-6">
                        <h4 className="text-[14px] font-bold uppercase tracking-widest mb-6 text-white">Contact Us</h4>
                        
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                            <p className="text-[14px] leading-relaxed">
                                123 Education Boulevard,<br />
                                Tech District, City 12345
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-indigo-400 flex-shrink-0" />
                            <p className="text-[14px]">+1 (555) 123-4567</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-indigo-400 flex-shrink-0" />
                            <p className="text-[14px]">support@edumanage.edu</p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-2">
                            {[
                                { icon: Share2, href: '#' },
                                { icon: Video, href: '#' },
                                { icon: Camera, href: '#' },
                                { icon: MessagesSquare, href: '#' },
                            ].map(({ icon: Icon, href }, i) => (
                                <Link key={i} href={href}
                                    className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-indigo-300">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-indigo-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[14px]">
                        &copy; {new Date().getFullYear()} Kirtonia Yousob Ali Bhuyan High School. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[14px]">
                        <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
                        <span className="w-1 h-1 rounded-full bg-indigo-700"></span>
                        <Link href="#" className="hover:text-white transition-colors">System Status</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
