import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import AcademicClassForm from '../Form/AcademicClassForm';

export default function AcademicClassEditPage({ auth, academic_class }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Edit Class - ${academic_class.name}`} />
            
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Edit Academic Class</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Modify details and sections for {academic_class.name}.</p>
                </div>
                <Link
                    href={route('admin.classes.index')}
                    className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#202223] rounded-[3px] text-[13px] font-bold hover:bg-[#f6f6f7] transition-all flex items-center gap-1.5 shadow-sm"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </Link>
            </div>

            <AcademicClassForm academic_class={academic_class} />
        </AdminLayout>
    );
}
