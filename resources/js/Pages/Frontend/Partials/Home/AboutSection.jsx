import React from 'react';
import { Link } from '@inertiajs/react';

export default function AboutSection() {
    return (
        <section id="about-section" className="py-10 bg-transparent scroll-mt-24">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 relative px-4 sm:px-0">
                        <div className="rounded-lg overflow-hidden shadow-md relative z-10 border-4 border-white">
                            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" alt="Students studying in classroom" className="w-full h-auto object-cover aspect-[16/10]" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#009ca6] rounded-full opacity-20 -z-10 blur-2xl"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#16a34a] rounded-full opacity-20 -z-10 blur-xl"></div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="inline-block px-3 py-1 bg-[#009ca6]/10 text-[#009ca6] font-bold text-[10px] rounded-full mb-3">About Our Coaching Center</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight">
                            A Legacy of <span className="text-[#16a34a]">Excellence</span> & Innovation
                        </h2>
                        <p className="text-slate-600 text-[14px] leading-relaxed mb-3 font-medium max-w-3xl">
                            আমাদের কোচিং সেন্টারে আমরা প্রতিটি শিক্ষার্থীর অন্তর্নিহিত মেধা ও সম্ভাবনাকে বিকশিত করায় বিশ্বাসী। অভিজ্ঞ মেন্টরশিপ, সুনির্দিষ্ট স্টাডি প্ল্যান এবং সৃজনশীল পাঠদানের মাধ্যমে প্রতিটি শিক্ষার্থীকে পরীক্ষার জন্য শতভাগ প্রস্তুত করা হয়।
                        </p>
                        <p className="text-slate-500 text-[13px] leading-relaxed mb-5 max-w-3xl">
                            মানসম্মত শিক্ষা ও সেরা ফলাফলের অঙ্গীকার নিয়ে আমাদের যাত্রা। প্রতিটি বিষয়ের বেসিক কনসেপ্ট ক্লিয়ারিং এবং নিয়মিত মডেল টেস্টের মাধ্যমে শিক্ষার্থীদের বোর্ড পরীক্ষায় সেরা সাফল্য নিশ্চিত করাই আমাদের মূল লক্ষ্য।
                        </p>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-2 mb-6 max-w-2xl">
                            {[
                                'বিষয়ভিত্তিক বেসিক কনসেপ্ট ক্লিয়ারিং',
                                'অধ্যায়ভিত্তিক রিভিশন ও বিশেষ হ্যান্ডনোট',
                                'নিয়মিত মডেল টেস্ট ও ওএমআর এসেসমেন্ট',
                                'অভিভাবকদের সাথে নিয়মিত যোগাযোগ ও রিপোর্ট'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-slate-700 font-bold text-xs">
                                    <div className="w-4 h-4 rounded-full bg-[#16a34a]/20 flex items-center justify-center text-[#16a34a] shrink-0">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href={route('faculties.index')} className="inline-flex items-center justify-center px-5 py-2 bg-transparent hover:bg-[#009ca6] text-[#009ca6] hover:text-white font-bold text-xs rounded-[3px] border-2 border-[#009ca6] transition-all">
                            View All Classes & Routine
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
