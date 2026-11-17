import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function SchoolOfficeDetails({ id }) {
    // Mock Data based on the provided reference design
    const office = {
        title: "Office of the Academic Director",
        category: "Administration",
        personName: "Engr. Mamon Hossain",
        personTitle: "Founder & Director",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        message: [
            "It is my great pleasure to welcome you to Ullash Coaching Center through our website. As the Director, I am proud to lead an academic institution dedicated to student success, conceptual clarity, and board exam excellence.",
            "Ullash Coaching Center was established with the vision of providing top-tier academic coaching in Higher Mathematics, Physics, Chemistry, Biology, and ICT for SSC and HSC candidates. Our dedicated instructors focus on bridging foundational gaps, regular chapter-wise model tests, and continuous evaluation to ensure every student reaches their highest potential.",
            "We believe that real learning happens when students understand the 'why' behind equations and theories. With smart classroom facilities, personalized doubt-clearing sessions, and regular guardian conferences, we ensure a supportive environment for every learner.",
            "Our alumni consistently achieve GPA 5.00 in SSC & HSC exams and successfully secure admission to BUET, Medical colleges, and prestigious public universities. We look forward to guiding your academic journey."
        ],
        employees: [
            { 
                name: "Engr. Mamon Hossain", 
                designation: "Director & Academic Head", 
                email: "director@ullash.edu.bd",
                phone: "+880 1711 223344",
                location: "Room 101, Main Academic Building",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            }
        ],
        contacts: {
            phone: "+880 1711 223344",
            email: "director@ullash.edu.bd",
        }
    };

    const [activeTab, setActiveTab] = useState('Message');

    return (
        <FrontendLayout>
            <Head title={office.title} />

            {/* Hero Section with Background Image (Matches SchoolOffices.jsx EXACTLY) */}
            <div className="relative h-[250px] md:h-[350px] w-full bg-[#16a34a] overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent"></div>

                <div className="container mx-auto px-4 lg:px-12 h-full flex flex-col justify-end pb-8 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-medium text-white mb-2 tracking-tight">{office.title}</h1>
                    <div className="text-[14px] text-emerald-100 font-medium tracking-wide">
                        {office.category} <span className="mx-2">/</span> {office.title}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation - Placed in a white bar BELOW the hero */}
            <div className="border-b border-gray-200 shadow-sm relative z-20 bg-white">
                <div className="container mx-auto px-4 lg:px-12 flex">
                    <button 
                        onClick={() => setActiveTab('Message')}
                        className="px-8 md:px-12 py-3.5 font-medium text-[15px] transition-colors"
                        style={{ 
                            backgroundColor: activeTab === 'Message' ? '#ffffff' : '#0aa5c7',
                            color: activeTab === 'Message' ? '#0aa5c7' : '#ffffff'
                        }}
                    >
                        Message
                    </button>
                    <button 
                        onClick={() => setActiveTab('Employee')}
                        className="px-8 md:px-12 py-3.5 font-medium text-[15px] transition-colors"
                        style={{ 
                            backgroundColor: activeTab === 'Employee' ? '#ffffff' : '#0aa5c7',
                            color: activeTab === 'Employee' ? '#0aa5c7' : '#ffffff'
                        }}
                    >
                        Employee
                    </button>
                    <button 
                        onClick={() => setActiveTab('Contacts')}
                        className="px-8 md:px-12 py-3.5 font-medium text-[15px] transition-colors"
                        style={{ 
                            backgroundColor: activeTab === 'Contacts' ? '#ffffff' : '#0aa5c7',
                            color: activeTab === 'Contacts' ? '#0aa5c7' : '#ffffff'
                        }}
                    >
                        Contacts
                    </button>
                </div>
            </div>

            {/* Content Area - EXACT layout used in the first functional iteration */}
            <div className="container mx-auto px-4 lg:px-12 py-12 max-w-7xl min-h-[40vh]">
                
                {activeTab === 'Message' && (
                    <div className="flex flex-col md:flex-row gap-10 lg:gap-14">
                        
                        {/* Profile Section */}
                        <div className="w-full md:w-[280px] flex-shrink-0">
                            {/* Image with BOTTOM-LEFT shadow offset per the screenshot */}
                            <div className="mb-8 ml-3 inline-block">
                                <img 
                                    src={office.image} 
                                    alt={office.personName} 
                                    className="w-full max-w-[280px] aspect-[4/5] object-cover border-2 bg-white"
                                    style={{ 
                                        borderColor: '#0aa5c7',
                                        boxShadow: '-12px 12px 0px 0px #0aa5c7'
                                    }}
                                />
                            </div>
                            
                            <div className="mt-2">
                                <h3 className="text-[22px] font-bold mb-1 leading-tight" style={{ color: '#0aa5c7' }}>
                                    {office.personName}
                                </h3>
                                <p className="text-[14px] text-gray-700 font-medium">
                                    {office.personTitle}
                                </p>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 space-y-5 pt-1">
                            {office.message.map((paragraph, idx) => (
                                <p key={idx} className="text-[14px] text-slate-800 leading-[1.8] text-justify">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Employee' && (
                    <div className="space-y-6">
                        {office.employees.map((emp, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row max-w-[850px] overflow-hidden shadow-sm border border-gray-100" style={{ backgroundColor: '#eaf7fa' }}>
                                <img 
                                    src={emp.image} 
                                    alt={emp.name} 
                                    className="w-[240px] h-[240px] object-cover flex-shrink-0 bg-white" 
                                />
                                <div className="p-8 flex flex-col justify-center">
                                    <h3 className="text-[24px] font-bold text-[#1f2937] leading-tight mb-2">{emp.name}</h3>
                                    <div className="text-[14px] font-medium px-4 py-1.5 inline-block mb-6 self-start rounded-[2px]" style={{ backgroundColor: '#0aa5c7', color: 'white' }}>
                                        {emp.designation}
                                    </div>
                                    <div className="space-y-3 text-[#1f2937] text-[15px] font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-[#1f2937] fill-current" /> {emp.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-[#1f2937] fill-current" /> | {emp.location} | <Phone size={18} className="text-[#1f2937] fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'Contacts' && (
                    <div className="max-w-[850px] mt-4">
                        <div className="flex flex-col md:flex-row gap-20">
                            
                            {/* Email Column */}
                            <div className="flex-1">
                                <h4 className="text-[17px] font-bold mb-3" style={{ color: '#0aa5c7' }}>Official Email</h4>
                                <div className="w-full h-[1px] bg-gray-300 mb-5"></div>
                                <p className="text-[15px] font-medium text-slate-800">{office.contacts.email}</p>
                            </div>
                            
                            {/* Contact No Column */}
                            <div className="flex-1">
                                <h4 className="text-[17px] font-bold mb-3" style={{ color: '#0aa5c7' }}>Official Contact No.</h4>
                                <div className="w-full h-[1px] bg-gray-300 mb-5"></div>
                                <p className="text-[15px] font-medium text-slate-800">{office.contacts.phone}</p>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </FrontendLayout>
    );
}
