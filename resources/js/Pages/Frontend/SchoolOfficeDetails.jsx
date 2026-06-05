import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function SchoolOfficeDetails({ id }) {
    // Mock Data based on the provided reference design
    const office = {
        title: "Office of the Vice Chancellor",
        category: "Administration",
        personName: "Prof. Dr. Mohammad Shorif Uddin",
        personTitle: "Vice Chancellor",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        message: [
            "It is my great pleasure to welcome you to Green University of Bangladesh (GUB) through our website. As the Vice-Chancellor, I am proud to lead an institution committed to academic excellence, innovation, and holistic development.",
            "GUB was established in 2003 with the vision of becoming a global center of excellence in higher education. We offer a diverse range of undergraduate and postgraduate programs through our four faculties: Business Studies, Science & Engineering, Arts & Social Sciences, and Law, to meet the socio-economic needs of our country. Our curriculum is designed to provide quality education imbued with high moral and ethical values. Over the years, the university has grown rapidly and currently serves 7,000 students with over 300 dedicated faculty members. Our graduates are gaining admission to renowned foreign universities for further studies with financial aid and securing positions in prestigious industries and institutions.",
            "We have forged strong partnerships with national and international institutions, facilitating exchange programs, joint research, and shared learning opportunities that enrich our academic community. In an era of rapid global and national changes, universities play a crucial role in shaping the future workforce. At GUB, we recognize that knowledge is a key resource in a world where change is the norm. We are dedicated to preparing our students to excel in their respective fields, equipped not only with comprehensive knowledge but also with ethical empowerment and outcome-based skills.",
            "Our state-of-the-art facilities, including modern laboratories and an extensive library, provide the necessary infrastructure for a conducive learning environment. GUB is a place where everyone feels valued and supported, fostering an inclusive culture that celebrates diversity and provides equal opportunities for all. Adequate support systems for both teachers and students have been developed to ensure their success and well-being, complemented by various centers and clubs. We have enhanced our outreach programs to ensure our work positively impacts the community. Sustainability has been integrated into our curriculum and campus practices, promoting environmental conservation and social responsibility.",
            "While teaching is a core aspect of our mission, GUB is deeply invested in research and training activities to expand the boundaries of knowledge."
        ],
        employees: [
            { 
                name: "Prof. Dr. Mohammad Shorif Uddin", 
                designation: "Vice Chancellor", 
                email: "vc@green.edu.bd",
                phone: "+880 1711 000000",
                location: "Room 401-4th Floor, Admin Building",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            }
        ],
        contacts: {
            phone: "+880 1711 000000",
            email: "vc@green.edu.bd",
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
