import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Mail, Phone, BookOpen, GraduationCap } from 'lucide-react';

export default function FacultyIndex({ faculties }) {
    const [activeFilter, setActiveFilter] = useState('All Departments');

    const departments = ['All Departments', 'Science', 'Business Studies', 'Humanities', 'Physical Education'];

    const filteredFaculties = activeFilter === 'All Departments' 
        ? faculties 
        : faculties.filter(faculty => faculty.department === activeFilter);

    return (
        <FrontendLayout>
            <Head title="Faculty & Staff - Lohadi High School" />

            {/* Page Header */}
            <div className="bg-[#15803d] py-16 relative overflow-hidden border-b-4 border-[#16a34a]">
                <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
                    <GraduationCap size={200} />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Our Faculty & Staff</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">Meet the dedicated educators and professionals who are shaping the future of our students.</p>
                </div>
            </div>

            {/* Faculty Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4 md:px-8">
                    
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {departments.map((dept) => (
                            <button 
                                key={dept}
                                onClick={() => setActiveFilter(dept)}
                                className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-colors border ${
                                    activeFilter === dept 
                                        ? 'bg-[#16a34a] text-white border-[#16a34a]' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a]'
                                }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFaculties.length > 0 ? (
                            filteredFaculties.map((faculty) => (
                                <Link
                                    href={route('faculties.show', faculty.id)}
                                    key={faculty.id}
                                    className="relative group rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-[2px] flex flex-col"
                                >
                                    {/* Animated Running Border Background */}
                                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#16a34a_25%,transparent_50%,#009ca6_75%,transparent_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Actual Card Content with Glass and Grid */}
                                    <div className="relative rounded-[22px] bg-white/90 backdrop-blur-md p-8 w-full h-full flex flex-col items-center text-center z-10">
                                        {/* Subtle Grid Pattern Overlay */}
                                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-[22px]" style={{ backgroundImage: 'linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                                        {/* Faculty Image */}
                                        <div className="w-24 h-24 rounded-full overflow-hidden mb-5 shadow-inner relative z-10 border-4 border-white ring-4 ring-slate-100/50 group-hover:ring-[#16a34a]/20 transition-all duration-500">
                                            <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>

                                        {/* Department Badge */}
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full uppercase tracking-wider mb-4 border border-slate-200/60 group-hover:bg-[#16a34a]/10 group-hover:text-[#16a34a] group-hover:border-transparent transition-all duration-300">
                                            {faculty.department}
                                        </span>

                                        {/* Name & Role */}
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1 group-hover:text-[#009ca6] transition-colors duration-300">{faculty.name}</h3>
                                        <p className="text-[13px] font-medium text-slate-500 mb-6">{faculty.role}</p>

                                        {/* Divider */}
                                        <div className="w-12 h-[2px] bg-slate-200/80 rounded-full mb-6 group-hover:w-20 transition-all duration-300"></div>

                                        {/* Contact Info */}
                                        <div className="flex flex-col gap-3 w-full text-[13px] font-medium text-slate-600 mt-auto">
                                            <div className="flex items-center justify-center gap-2.5 hover:text-[#009ca6] transition-colors py-1 rounded-lg hover:bg-slate-50/80">
                                                <Mail size={15} className="text-slate-400 group-hover:text-[#009ca6] transition-colors" strokeWidth={2} />
                                                <span className="truncate max-w-[200px]">{faculty.email}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2.5 hover:text-[#009ca6] transition-colors py-1 rounded-lg hover:bg-slate-50/80">
                                                <Phone size={15} className="text-slate-400 group-hover:text-[#009ca6] transition-colors" strokeWidth={2} />
                                                <span>{faculty.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-base font-medium text-slate-500">No faculty members found in this department.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
