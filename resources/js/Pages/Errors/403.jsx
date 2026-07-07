import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Error403({ message }) {
    return (
        <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center justify-center p-4">
            <Head title="Access Denied" />
            
            <div className="max-w-md w-full bg-white rounded-[8px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] p-8 text-center border-t-4 border-[#ff4d4f]">
                <div className="w-16 h-16 bg-[#fff2f0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="text-[#ff4d4f]" size={32} />
                </div>
                
                <h1 className="text-[24px] font-bold text-[#202223] mb-2 tracking-tight">Access Denied</h1>
                
                <p className="text-[14px] text-[#6d7175] mb-8 leading-relaxed">
                    {message || "You don't have the necessary permissions to access this page. If you believe this is an error, please contact your system administrator."}
                </p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full flex items-center justify-center gap-2 h-[40px] px-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[#202223] font-bold text-[13px] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft size={16} /> Go Back
                    </button>
                    
                    <Link
                        href={route('admin.dashboard')}
                        className="w-full flex items-center justify-center h-[40px] px-4 bg-[#008060] text-white rounded-[4px] font-bold text-[13px] hover:bg-[#006e52] transition-all shadow-sm active:scale-95"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
