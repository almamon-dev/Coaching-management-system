import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileText, FileDown, Table as TableIcon, Eye, Users } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';
import TableSearch from '@/Components/Table/TableSearch';
import SelectInput from '@/Components/Form/SelectInput';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Index({ auth, filters, reportData, sessions, classes, sections, stats, genderData, classDistribution }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleFilterChange = (key, value) => {
        router.get(route('admin.reports.students.index'), {
            ...filters,
            [key]: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleExport = (exportType) => {
        const queryParams = new URLSearchParams({ ...filters, export: exportType }).toString();
        window.location.href = `${route('admin.reports.students.index')}?${queryParams}`;
    };

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('admin.reports.students.index'), {
            ...filters,
            search: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <FileText size={20} className="text-[#008060]" />
                            Student Reports
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Overview and export of student records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleExport('excel')} className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                            <TableIcon size={14} className="text-green-600" />
                            Export Excel
                        </button>
                        <button onClick={() => handleExport('pdf')} className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                            <FileDown size={14} className="text-red-500" />
                            Export PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Student Reports" />

            {/* Graphical Reports Section */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
                        <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Students</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.total}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#008060] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Active Students</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.active}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#3b82f6] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Promoted</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.promoted}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#f49342] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Transferred</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.transferred}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#e32c2b] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Dropped Out</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.dropped}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                            <h3 className="text-[14px] font-bold text-[#202223] mb-4 border-b border-[#ebebeb] pb-2">Gender Ratio</h3>
                            <div className="h-[250px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={genderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#ec4899" />
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5 lg:col-span-2">
                            <h3 className="text-[14px] font-bold text-[#202223] mb-4 border-b border-[#ebebeb] pb-2 flex justify-between items-center">
                                <span>Students Per Class</span>
                                <Users size={16} className="text-[#6d7175]" />
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={classDistribution} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f4f6f8' }} contentStyle={{ borderRadius: '4px', fontSize: '12px' }} />
                                        <Bar dataKey="students" name="Students" fill="#008060" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb] mb-5 p-4 flex flex-wrap items-end gap-4">
                <div className="flex flex-col w-[160px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Session</label>
                    <select
                        value={filters?.academic_session_id || ''}
                        onChange={(e) => handleFilterChange('academic_session_id', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Sessions</option>
                        {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col w-[140px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Class</label>
                    <select
                        value={filters?.academic_class_id || ''}
                        onChange={(e) => handleFilterChange('academic_class_id', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col w-[140px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Section</label>
                    <select
                        value={filters?.section_id || ''}
                        onChange={(e) => handleFilterChange('section_id', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Sections</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col w-[140px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Status</label>
                    <select
                        value={filters?.status || 'active'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="active">Active</option>
                        <option value="promoted">Promoted</option>
                        <option value="transferred">Transferred</option>
                        <option value="dropped">Dropped</option>
                        <option value="">All Statuses</option>
                    </select>
                </div>
                <div className="flex flex-col w-[140px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Gender</label>
                    <select
                        value={filters?.gender || ''}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5 opacity-0">Search</label>
                    <TableSearch 
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name or Student ID..."
                        className="w-full"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb]">
                <Table>
                    <TableHeader>
                        <TableHeadCell isFirst className="!py-2 !px-3">ID</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Student Name</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Gender / Blood</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Session</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Class (Section)</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Status</TableHeadCell>
                        <TableHeadCell isLast align="right" className="!py-2 !px-3">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {reportData.data.length > 0 ? (
                            reportData.data.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="font-bold text-[#202223]">{row.student_profile?.student_id || '-'}</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="font-medium text-[#202223] truncate max-w-[180px]">{row.student_profile?.user?.name || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="text-[12px] text-[#202223] capitalize">{row.student_profile?.gender || '-'} {row.student_profile?.blood_group ? `(${row.student_profile?.blood_group})` : ''}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="text-[12px] text-[#6d7175]">{row.academic_session?.name || '-'}</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="text-[12px] font-bold text-[#202223]">
                                            {row.academic_class?.name || '-'} <span className="font-normal text-[#6d7175]">({row.section?.name || '-'})</span>
                                        </span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider
                                            ${row.status === 'active' ? 'bg-[#e4f1ef] text-[#008060]' : ''}
                                            ${row.status === 'promoted' ? 'bg-blue-50 text-blue-600' : ''}
                                            ${row.status === 'transferred' ? 'bg-orange-50 text-orange-600' : ''}
                                            ${row.status === 'dropped' ? 'bg-red-50 text-red-600' : ''}
                                            ${!['active', 'promoted', 'transferred', 'dropped'].includes(row.status) ? 'bg-slate-100 text-slate-600' : ''}
                                        `}>
                                            {row.status || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" className="!py-1.5 !px-3">
                                        <div className="flex justify-end">
                                            <Link
                                                href={route('admin.students.show', row.student_profile?.id)}
                                                className="h-[24px] w-[24px] flex items-center justify-center bg-[#008060] text-white rounded-[2px] hover:bg-[#006e52] transition-all cursor-pointer"
                                                title="View Student Details"
                                            >
                                                <Eye size={12} />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-12 text-[#6d7175]">
                                    No student data found for the selected filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-[75px]">
                            <SelectInput
                                value={reportData.per_page}
                                onChange={(e) => {
                                    handleFilterChange('per_page', e.target.value);
                                }}
                                showSearch={false}
                                direction="up"
                                options={[{ id: '10', name: '10' }, { id: '15', name: '15' }, { id: '30', name: '30' }, { id: '50', name: '50' }, { id: '100', name: '100' }]}
                                className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                            {reportData.total > 0 ? `${reportData.from || 0} - ${reportData.to || 0} of ${reportData.total}` : '0 - 0'}
                        </span>
                        <div className="flex gap-1">
                            <Link
                                href={reportData.prev_page_url || '#'}
                                preserveState preserveScroll
                                as="button" disabled={!reportData.prev_page_url}
                                className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                            >
                                <span className="text-[14px]">‹</span>
                            </Link>
                            <Link
                                href={reportData.next_page_url || '#'}
                                preserveState preserveScroll
                                as="button" disabled={!reportData.next_page_url}
                                className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                            >
                                <span className="text-[14px]">›</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
