import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Layers, Trash2 } from 'lucide-react';
import SelectInput from '@/Components/Form/SelectInput';
import DataTable from '@/Components/Table/DataTable';

export default function CourseIndex({ courses = {}, filters = {} }) {
    // Filters State
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const courseList = courses.data || (Array.isArray(courses) ? courses : []);

    const handleDeleteCourse = (id, name) => {
        if (confirm(`Are you sure you want to delete subject "${name}"?`)) {
            router.delete(route('admin.courses.destroy', id));
        }
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.courses.index'), {
            ...filters,
            [key]: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const categoryOptions = [
        { id: 'Class 1', name: 'Class 1' },
        { id: 'Class 2', name: 'Class 2' },
        { id: 'Class 3', name: 'Class 3' },
        { id: 'Class 4', name: 'Class 4' },
        { id: 'Class 5', name: 'Class 5' },
        { id: 'Class 6', name: 'Class 6' },
        { id: 'Class 7', name: 'Class 7' },
        { id: 'Class 8', name: 'Class 8' },
        { id: 'Class 9', name: 'Class 9' },
        { id: 'Class 10', name: 'Class 10' },
        { id: 'SSC', name: 'SSC' },
        { id: 'HSC / Intermediate', name: 'HSC / Intermediate' },
    ];

    // Subject Columns
    const subjectColumns = [
        {
            header: 'Subject Name',
            accessor: 'title',
            cell: (row) => (
                <div>
                    <div className="font-bold text-slate-900 text-xs">{row.title}</div>
                    {row.description && <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{row.description}</div>}
                </div>
            ),
        },
        {
            header: 'Code',
            accessor: 'code',
            className: 'w-[140px]',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[10.5px] font-bold text-[#16a34a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{row.code}</span>
            ),
        },
        {
            header: 'Category',
            accessor: 'category',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-[3px]">
                    {row.category || '—'}
                </span>
            ),
        },
        {
            header: 'Monthly Fee',
            accessor: 'fee',
            className: 'w-[120px]',
            cell: (row) => (
                <div className="whitespace-nowrap">
                    <span className="text-xs font-bold text-[#16a34a]">৳ {parseFloat(row.monthly_fee || row.fee || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block">/month</span>
                </div>
            ),
        },
        {
            header: 'Admission',
            accessor: 'admission_fee',
            className: 'w-[100px]',
            cell: (row) => (
                <span className="inline-block whitespace-nowrap text-xs font-semibold text-amber-600">৳ {row.admission_fee ? parseFloat(row.admission_fee).toLocaleString() : '0'}</span>
            ),
        },
        {
            header: 'Duration',
            accessor: 'duration',
            className: 'w-[100px]',
            cell: (row) => <span className="inline-block whitespace-nowrap text-[11px] font-semibold text-slate-700">{row.duration || '—'}</span>,
        },
        {
            header: 'Lectures & Lessons',
            accessor: 'total_lectures',
            className: 'w-[150px]',
            cell: (row) => (
                <div className="whitespace-nowrap text-[11px] font-semibold text-slate-700">
                    <span className="text-[#16a34a] font-bold">{row.total_lectures || 0}</span> Lectures
                    <span className="text-slate-400 mx-1">•</span>
                    <span className="text-slate-800 font-bold">{row.total_lessons || 0}</span> Lessons
                </div>
            ),
        },
        {
            header: 'Batches',
            accessor: 'batches_count',
            className: 'w-[80px] text-center',
            cell: (row) => (
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    <Layers size={12} className="text-emerald-500" /> {row.batches_count || 0}
                </span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'w-[90px]',
            cell: (row) => (
                <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 text-[10.5px] font-bold rounded-full capitalize ${
                    row.status === 'active' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>{row.status}</span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'actions',
            className: 'text-right w-[110px]',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={route('admin.courses.edit', row.id)}
                        className="inline-flex items-center gap-1 font-bold text-[#16a34a] hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[3px] text-[11px] transition-all"
                    >
                        <Edit size={12} /> Edit
                    </Link>
                    <button
                        onClick={() => handleDeleteCourse(row.id, row.title)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer transition-colors"
                        title="Delete Subject"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    const subjectFilters = (
        <div className="grid grid-cols-2 gap-3">
            <SelectInput
                value={selectedCategory}
                onChange={(e) => {
                    const val = e.target ? e.target.value : e;
                    setSelectedCategory(val);
                    handleFilterChange('category', val);
                }}
                options={[
                    { id: '', name: 'All Categories' },
                    ...categoryOptions
                ]}
                placeholder="Filter by Category"
                showSearch={false}
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
                ]}
                placeholder="Filter by Status"
                showSearch={false}
            />
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Subject Management" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subject Management</h1>
                    <p className="text-sm text-slate-500">Configure coaching subjects, tuition fees, and full lecture/lesson syllabus breakdown.</p>
                </div>
                <div>
                    <Link
                        href={route('admin.courses.create')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Create Subject
                    </Link>
                </div>
            </div>

            {/* SUBJECTS DATATABLE */}
            <DataTable
                columns={subjectColumns}
                data={courseList}
                pagination={courses.links ? courses : null}
                selectable={true}
                itemNoun="subjects"
                searchQuery={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    handleFilterChange('search', val);
                }}
                searchPlaceholder="Search subject name, code..."
                advancedFilters={subjectFilters}
            />
        </AdminLayout>
    );
}
