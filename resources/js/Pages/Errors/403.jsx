import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home, Lock, AlertCircle, HelpCircle } from 'lucide-react';
import SchoolLogo from '@/Components/SchoolLogo';

export default function Error403({ message }) {
    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden font-sans">
            <Head title="403: Access Denied" />
            
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
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">403</h1>
                                <p className="text-red-600 font-bold uppercase tracking-widest text-[10px] mt-1">Access Denied</p>
                            </div>
                        </div>

                        <h2 className="text-[20px] font-serif text-[#4a3f35] mb-3">
                            Authentication Required
                        </h2>
                        
                        <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
                            {message || "We're sorry, but you don't have the necessary administrative privileges to view this page or perform this action."}
                        </p>
                        
                        {/* Instructions Box */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
                            <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
                                <AlertCircle size={14} className="text-slate-400" /> 
                                Possible Reasons
                            </h3>
                            
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                                    <span>Your designated <strong className="text-slate-800">User Role</strong> does not include access.</span>
                                </li>
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                                    <span>You are accessing a restricted administrative URL.</span>
                                </li>
                                <li className="flex items-start gap-2 text-[13px] text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                                    <span>Your permissions were modified recently.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
                            <button 
                                onClick={() => window.history.back()}
                                className="w-full sm:w-1/2 flex items-center justify-center gap-2 h-11 px-4 bg-white border border-slate-300 rounded-[4px] text-slate-700 font-medium text-[14px] hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <ArrowLeft size={16} /> Go Back
                            </button>
                            
                            <Link
                                href="/"
                                className="w-full sm:w-1/2 flex items-center justify-center gap-2 h-11 px-4 bg-gradient-to-r from-[#5ca939] to-[#8ac950] hover:from-[#4b8a2e] hover:to-[#74ad42] text-white rounded-[4px] font-medium text-[14px] transition-all shadow-md"
                            >
                                <Home size={16} /> Dashboard
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
