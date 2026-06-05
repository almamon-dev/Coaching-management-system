import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StudentForm from '../Form/StudentForm';

export default function StudentCreatePage({ auth }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Create New student" />
            
            <div studentName="mb-6">
                <h1 studentName="text-[20px] font-bold text-[#202223] tracking-tight">Create Student</h1>
                <p studentName="text-[#6d7175] text-[13px] mt-0.5 font-medium">Add a new student to the school system.</p>
            </div>

            <StudentForm />
        </AdminLayout>
    );
}
