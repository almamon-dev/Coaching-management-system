import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function SchoolOffices() {
    // School-appropriate office names mirroring the layout
    const offices = [
        { id: 1, title: "Office of the Headmaster" },
        { id: 2, title: "Office of the Asst. Headmaster" },
        { id: 3, title: "Office of the Accounts" },
        { id: 4, title: "Office of the Admission" },
        { id: 5, title: "Office of the Exam Controller" },
        { id: 6, title: "Teachers' Common Room" },
        { id: 7, title: "Office of the Library" },
        { id: 8, title: "Coordination Office" },
        { id: 9, title: "Office of the Logistics" },
        { id: 10, title: "Office of the Proctor" },
        { id: 11, title: "Medical Center" },
        { id: 12, title: "Student Affairs Office" },
    ];

    return (
        <FrontendLayout>
            <Head title="Offices" />

            {/* Hero Section with Background Image */}
            <div className="relative h-[300px] md:h-[400px] w-full bg-[#16a34a] overflow-hidden">
                {/* Background Overlay simulating the image overlay */}
                <div 
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                
                {/* Gradient overlay similar to the reference */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent"></div>

                <div className="container mx-auto px-4 lg:px-12 h-full flex flex-col justify-end pb-12 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-medium text-white mb-2 tracking-tight">Offices</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-12 py-16 max-w-7xl min-h-[50vh]">
                
                {/* Offices Grid - Matching the 5-column or 4-column layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {offices.map((office) => (
                        <Link 
                            key={office.id}
                            href={route('school-offices.show', office.id)} 
                            className="bg-[#f0f0f0] hover:bg-[#e5e5e5] transition-colors h-28 px-4 py-6 flex items-center justify-center text-center group"
                        >
                            <h3 className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-[#00a9cc] transition-colors">
                                {office.title}
                            </h3>
                        </Link>
                    ))}
                </div>

            </div>
        </FrontendLayout>
    );
}
