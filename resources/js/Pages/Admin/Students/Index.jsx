import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, User, GraduationCap } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';
import SelectInput from '@/Components/Form/SelectInput';

export default function StudentIndex({ students, courses, batches, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCourse, setSelectedCourse] = useState(filters?.course_id || '');
    const [selectedBatch, setSelectedBatch] = useState(filters?.batch_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.students.index'), {
                    ...filters,
                    search,
                    page: 1
                }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        router.get(route('admin.students.index'), {
            ...filters,
            [key]: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const columns = [
        {
            header: "Student ID",
            accessor: "student_id",
            className: "w-[120px]",
            cell: (row) => <span className="font-bold text-[#16a34a] text-xs">{row.student_id}</span>
        },
        {
            header: "Student Name",
            accessor: "name",
            cell: (row) => (
                <div>
                    <div className="font-bold text-slate-900 text-xs">{row.name}</div>
                    <div className="text-[11px] text-slate-500">{row.phone || row.email || 'No contact info'}</div>
                </div>
            )
        },
        {
            header: "Subject & Batch",
            accessor: "course",
            cell: (row) => (
                <div>
                    <div className="text-xs font-semibold text-slate-800">{row.course ? row.course.title : 'N/A'}</div>
                    <div className="text-[11px] text-slate-500">{row.batch ? row.batch.name : 'N/A'}</div>
                </div>
            )
        },
        {
            header: "Guardian Contact",
            accessor: "guardian_phone",
            cell: (row) => (
                <div>
                    <div className="text-xs font-semibold text-slate-800">{row.guardian_name || 'N/A'}</div>
                    <div className="text-[11px] text-slate-500">{row.guardian_phone || 'N/A'}</div>
                </div>
            )
        },
        {
            header: "School / College",
            accessor: "school_college",
            cell: (row) => <span className="text-xs text-slate-600">{row.school_college || 'N/A'}</span>
        },
        {
            header: "Status",
            accessor: "status",
            className: "w-[100px]",
            cell: (row) => (
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                    row.status === 'active' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-[110px]",
            cell: (row) => (
                <div className="flex items-center justify-end">
                    <Link
                        href={route('admin.students.show', row.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] hover:underline"
                    >
                        <Eye size={14} /> Profile
                    </Link>
                </div>
            )
        }
    ];

    const advancedFilters = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectInput
                value={selectedCourse}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedCourse(val);
                    handleFilterChange('course_id', val);
                }}
                options={[{ id: '', name: 'All Courses' }, ...courses.map(c => ({ id: c.id, name: c.title }))]}
                placeholder="Filter by Course"
            />
            <SelectInput
                value={selectedBatch}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedBatch(val);
                    handleFilterChange('batch_id', val);
                }}
                options={[{ id: '', name: 'All Batches' }, ...batches.map(b => ({ id: b.id, name: b.name }))]}
                placeholder="Filter by Batch"
            />
            <SelectInput
                value={selectedStatus}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedStatus(val);
                    handleFilterChange('status', val);
                }}
                options={[
                    { id: '', name: 'All Status' },
                    { id: 'active', name: 'Active' },
                    { id: 'inactive', name: 'Inactive' },
                    { id: 'passed_out', name: 'Passed Out' },
                    { id: 'dropped', name: 'Dropped' }
                ]}
                placeholder="Filter by Status"
            />
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Student Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
                    <p className="text-sm text-slate-500">Manage all registered student records, batch assignments and profiles.</p>
                </div>
                <Link
                    href={route('admin.admissions.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all"
                >
                    <Plus size={16} /> Add / Admit Student
                </Link>
            </div>

            {/* MODULAR DATATABLE INTEGRATION */}
            <DataTable
                columns={columns}
                data={students.data}
                pagination={students}
                selectable={true}
                itemNoun="students"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search student name, ID, phone..."
                advancedFilters={advancedFilters}
            />
        </AdminLayout>
    );
}
