import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Rocket, FileQuestion, Clock } from 'lucide-react';
import SchoolLogo from '@/Components/SchoolLogo';

export default function ComingSoon() {
    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden font-sans">
            <Head title="Coming Soon - Ullash Coaching Center" />
            
            {/* Top Left Gradient Circle */}
            <div 
                className="absolute top-[-25%] left-[-15%] w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(98,177,70,0.2) 0%, rgba(255,255,255,0) 70%)' }}
            ></div>
            
            {/* Bottom Right Gradient Circle */}
            <div 
                className="absolute bottom-[-25%] right-[-15%] w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(98,177,70,0.2) 0%, rgba(255,255,255,0) 70%)' }}
            ></div>

            <div className="container mx-auto px-4 relative z-10 flex items-center justify-center w-full max-w-4xl">
                
                {/* Unified Split Card */}
                <div className="flex flex-col lg:flex-row w-full bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,138,69,0.2)] border border-gray-100 overflow-hidden items-stretch">
                    
                    {/* Left Side - Logo Container */}
                    <div className="w-full lg:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-12 border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden">
                        {/* Subtle decorative background inside left side */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#008a45 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                        
                        <SchoolLogo variant="wide" className="scale-125 transform relative z-10" />
                    </div>

                    {/* Right Side - Error Content */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12 relative z-10 flex flex-col justify-center bg-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Coming Soon</h1>
                                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mt-1">Under Construction</p>
                            </div>
                        </div>

                        <h2 className="text-[20px] font-serif text-[#4a3f35] mb-3">
                            We're building something great.
                        </h2>
                        
                        <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
                            This module is currently under development. Our team is working hard to bring you this feature very soon!
                        </p>
                        
                        {/* Instructions Box */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
                            <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <FileQuestion size={14} className="text-slate-400" /> 
                                What's happening?
                            </h3>
                            
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                    <span>We are adding new capabilities to your system.</span>
                                </li>
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                    <span>All your existing data remains fully accessible.</span>
                                </li>
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                    <span>Check back soon to see the finished page!</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
                            <Link
                                href="/"
                                className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-gradient-to-r from-[#5ca939] to-[#8ac950] hover:from-[#4b8a2e] hover:to-[#74ad42] text-white rounded-[4px] font-medium text-[14px] transition-all shadow-md"
                            >
                                <ArrowLeft size={16} /> Go Back Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Back Link to Home */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="inline-flex items-center gap-2 text-[#008a45] hover:text-[#006834] font-medium text-[14px]">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
