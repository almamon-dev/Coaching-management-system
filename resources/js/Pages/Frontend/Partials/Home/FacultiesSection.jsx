import React from 'react';
import { Link } from '@inertiajs/react';

export default function FacultiesSection() {
    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4 md:px-8 max-w-8xl">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-block px-3 py-1 bg-[#16a34a]/10 text-[#16a34a] font-bold text-[10px] uppercase tracking-wider rounded-full mb-3">Academic Departments</div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Explore Our Faculties</h2>
                    <p className="text-slate-600 text-[14px] leading-relaxed">We offer a diverse range of academic programs guided by experienced educators dedicated to student success.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { title: 'Faculty of Science', icon: '🔬', color: 'bg-blue-500', desc: 'Physics, Chemistry, Biology, Mathematics & Computer Science.', img: '/images/faculty_science.png' },
                        { title: 'Faculty of Business', icon: '📊', color: 'bg-emerald-500', desc: 'Accounting, Finance, Management, and Business Entrepreneurship.', img: '/images/faculty_business.png' },
                        { title: 'Faculty of Humanities', icon: '🎨', color: 'bg-purple-500', desc: 'Literature, History, Geography, Economics, and Social Sciences.', img: '/images/faculty_humanities.png' }
                    ].map((faculty, index) => (
                        <div key={index} className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full">
                            <div className="h-36 overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                <img src={faculty.img} alt={faculty.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg z-20">
                                    {faculty.icon}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 group-hover:text-[#009ca6] transition-colors leading-snug">{faculty.title}</h3>
                                <p className="text-slate-600 text-[13px] leading-relaxed mb-4 flex-1">{faculty.desc}</p>
                                <Link href="#" className="inline-flex items-center text-[#16a34a] font-bold text-[13px] hover:text-[#009ca6] transition-colors mt-auto">
                                    View Departments
                                    <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
