import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { MonitorSmartphone, ClipboardCheck, Users, Beaker, Briefcase, BookOpen } from 'lucide-react';

export default function Portals() {
    const departments = [
        { acronym: 'SCI', name: 'Department of Science', icon: <Beaker className="text-emerald-600" size={32} /> },
        { acronym: 'BUS', name: 'Department of Business Studies', icon: <Briefcase className="text-blue-800" size={32} /> },
        { acronym: 'HUM', name: 'Department of Humanities', icon: <BookOpen className="text-amber-800" size={32} /> },
    ];

    const importantLinks = [
        'News',
        'Notice',
        'FAQ',
        'Campus Events',
        'Research Events',
        'Upcoming Events',
        'Sexual Harassment Prevention'
    ];

    return (
        <FrontendLayout>
            <Head title="Staff Faculty Portal" />

            <div className="container mx-auto px-4 py-12 max-w-8xl">

                {/* Top Portals */}
                <div className="flex justify-center gap-8 mb-16">
                    <Link href={route('teacher.login')} className="flex flex-col items-center justify-center w-40 h-32 bg-[#efefef] hover:bg-[#e2e2e2] transition-colors">
                        <div className="text-[#00a9cc] mb-2">
                            <MonitorSmartphone size={48} strokeWidth={1} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Teacher Portal</span>
                    </Link>

                    <Link href={route('school-offices')} className="flex flex-col items-center justify-center w-40 h-32 bg-[#efefef] hover:bg-[#e2e2e2] transition-colors">
                        <div className="text-[#00a9cc] mb-2">
                            <Users size={48} strokeWidth={1} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">School Offices</span>
                    </Link>

                    <a href="#" className="flex flex-col items-center justify-center w-40 h-32 bg-[#efefef] hover:bg-[#e2e2e2] transition-colors">
                        <div className="text-[#00a9cc] mb-2">
                            <ClipboardCheck size={48} strokeWidth={1} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Attendance</span>
                    </a>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Side: Departments Grid */}
                    <div className="lg:w-3/4">
                        <div className="bg-[#f2f2f2] border-b-2 border-[#00a9cc] px-4 py-2 mb-6">
                            <h2 className="text-xl font-bold text-[#0088a3]">Department</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {departments.map((dept, index) => (
                                <Link
                                    key={index}
                                    href="#"
                                    className="flex items-center p-4 bg-[#f4f4f4] hover:bg-[#e9e9e9] transition-colors gap-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        {dept.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{dept.acronym}</h3>
                                        <p className="text-sm text-gray-600">{dept.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Important Links Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="border border-[#00a9cc]">
                            <div className="bg-[#00a9cc] px-4 py-3">
                                <h3 className="text-white font-bold text-[15px]">Important Links</h3>
                            </div>
                            <div className="bg-white">
                                <ul className="flex flex-col">
                                    {importantLinks.map((link, index) => (
                                        <li key={index} className="border-b border-gray-100 last:border-0">
                                            <a
                                                href="#"
                                                className="block px-4 py-2.5 text-[13px] text-gray-700 hover:text-[#00a9cc] hover:bg-gray-50 transition-colors"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </FrontendLayout>
    );
}
