import React, { useState, useRef } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileText, FileDown, Table as TableIcon, TrendingUp, Users, Calendar, Filter, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';

const CLASS_COLORS = ['#008060','#3b82f6','#f49342','#e32c2b','#6366f1','#06b6d4','#84cc16','#f59e0b'];

export default function Index({ auth, type, filters, records, stats, classCounts, classes }) {
    const [localType, setLocalType]     = useState(filters?.type || type || 'student');
    const [classId, setClassId]         = useState(filters?.class_id || '');
    const [startDate, setStartDate]     = useState(filters?.start_date || '');
    const [endDate, setEndDate]         = useState(filters?.end_date || '');
    const startRef = useRef(null);
    const endRef   = useRef(null);

    const applyFilter = (extra = {}) => {
        router.get(route('admin.reports.promotions.index'), {
            type: localType, class_id: classId, start_date: startDate, end_date: endDate, page: 1, ...extra,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClear = () => {
        setLocalType('student'); setClassId(''); setStartDate(''); setEndDate('');
        router.get(route('admin.reports.promotions.index'), { type: 'student' },
            { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleExport = (fmt) => {
        const params = new URLSearchParams({ type: localType, class_id: classId, start_date: startDate, end_date: endDate, export: fmt }).toString();
        window.location.href = `${route('admin.reports.promotions.index')}?${params}`;
    };

    const hasFilters = filters?.class_id || filters?.start_date || filters?.end_date;

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <TrendingUp size={20} className="text-[#008060]" />
                            Promotion Reports
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Track and export student & teacher promotion records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleExport('excel')} className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                            <TableIcon size={14} className="text-green-600" /> Export Excel
                        </button>
                        <button onClick={() => handleExport('pdf')} className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                            <FileDown size={14} className="text-red-500" /> Export PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Promotion Reports" />

            {/* Filters */}
            <div className="bg-white p-4 rounded-[4px] border border-[#ebebeb] shadow-sm mb-5 flex flex-wrap items-end gap-4">
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Report Type</label>
                    <select value={localType} onChange={e => setLocalType(e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0 min-w-[170px]">
                        <option value="student">Student Promotions</option>
                        <option value="teacher">Teacher Promotions</option>
                    </select>
                </div>
                {localType === 'student' && (
                    <div className="flex flex-col">
                        <label className="text-[12px] font-bold text-[#202223] mb-1.5">Class</label>
                        <select value={classId} onChange={e => setClassId(e.target.value)}
                            className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0 min-w-[150px]">
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                )}
                {/* Start date icon-button */}
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">From</label>
                    <div className="relative">
                        <input ref={startRef} type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" tabIndex={-1} />
                        <button type="button" onClick={() => startRef.current?.showPicker()}
                            className="h-[32px] pl-3 pr-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-medium text-[#202223] hover:border-[#008060] flex items-center gap-2 min-w-[140px] shadow-sm">
                            <Calendar size={13} className="text-[#008060]" />
                            <span>{startDate ? new Date(startDate+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'Select date'}</span>
                        </button>
                    </div>
                </div>
                {/* End date icon-button */}
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">To</label>
                    <div className="relative">
                        <input ref={endRef} type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" tabIndex={-1} />
                        <button type="button" onClick={() => endRef.current?.showPicker()}
                            className="h-[32px] pl-3 pr-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-medium text-[#202223] hover:border-[#008060] flex items-center gap-2 min-w-[140px] shadow-sm">
                            <Calendar size={13} className="text-[#008060]" />
                            <span>{endDate ? new Date(endDate+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : 'Select date'}</span>
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => applyFilter()} className="h-[32px] px-4 bg-[#008060] text-white font-bold text-[12px] rounded-[4px] hover:bg-[#006e52] flex items-center gap-1.5">
                        <Filter size={14} /> Filter
                    </button>
                    {hasFilters && (
                        <button onClick={handleClear} className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#6d7175] font-bold text-[12px] rounded-[4px] hover:bg-[#f4f6f8] flex items-center gap-1.5">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                {/* Stat card */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                    <h3 className="text-[13px] font-bold text-[#202223] mb-3 border-b border-[#ebebeb] pb-2">
                        {type === 'student' ? 'Promotions by Class' : 'Promotion Overview'}
                    </h3>
                    <div className="h-[200px]">
                        {(classCounts?.length ?? 0) > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classCounts} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#6d7175' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: '6px', fontSize: '12px', border: '1px solid #ebebeb' }} />
                                    <Bar dataKey="total" name="Promoted" radius={[4,4,0,0]} maxBarSize={40}>
                                        {classCounts.map((_, i) => <Cell key={i} fill={CLASS_COLORS[i % CLASS_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[13px] text-[#6d7175]">No chart data available</div>
                        )}
                    </div>
                </div>

                {/* Horizontal Progress Bars - Class Breakdown */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                    <h3 className="text-[13px] font-bold text-[#202223] mb-4 border-b border-[#ebebeb] pb-2 flex items-center gap-2">
                        <Users size={15} className="text-[#008060]" /> Class-wise Breakdown
                    </h3>
                    <div className="space-y-3 pt-1">
                        {(classCounts?.length ?? 0) > 0 ? (() => {
                            const max = Math.max(...classCounts.map(r => r.total), 1);
                            return classCounts.map((row, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-[80px] text-right text-[11px] font-bold text-[#6d7175] shrink-0 truncate">{row.class}</div>
                                    <div className="flex-1 h-[28px] bg-[#f4f6f8] rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                                            style={{
                                                width: `${Math.max((row.total / max) * 100, 3)}%`,
                                                background: `linear-gradient(90deg, ${CLASS_COLORS[i % CLASS_COLORS.length]}, ${CLASS_COLORS[i % CLASS_COLORS.length]}cc)`,
                                            }}
                                        >
                                            {(row.total / max) * 100 > 15 && (
                                                <span className="text-white text-[10px] font-bold">{row.total}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-[30px] text-[11px] font-bold shrink-0" style={{ color: CLASS_COLORS[i % CLASS_COLORS.length] }}>{row.total}</div>
                                </div>
                            ));
                        })() : (
                            <div className="text-center text-[#6d7175] text-[13px] py-8">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb]">
                <div className="px-4 py-3 border-b border-[#ebebeb] bg-[#fdfdfd] flex justify-between items-center">
                    <h3 className="text-[13px] font-bold text-[#202223]">
                        {type === 'teacher' ? 'Teacher Promotion Records' : 'Student Promotion Records'}
                    </h3>
                    <span className="text-[11px] text-[#6d7175]">{records?.total ?? 0} record(s)</span>
                </div>

                <Table>
                    <TableHeader>
                        {type === 'teacher' ? (<>
                            <TableHeadCell isFirst className="!py-2 !px-3">Teacher</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Prev. Designation</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">New Designation</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Promotion Date</TableHeadCell>
                            <TableHeadCell isLast className="!py-2 !px-3">Note</TableHeadCell>
                        </>) : (<>
                            <TableHeadCell isFirst className="!py-2 !px-3">ID</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Student Name</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Session</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Class (Section)</TableHeadCell>
                            <TableHeadCell isLast className="!py-2 !px-3">Promoted On</TableHeadCell>
                        </>)}
                    </TableHeader>
                    <TableBody>
                        {(records?.data?.length ?? 0) > 0 ? records.data.map((row, idx) => (
                            <TableRow key={idx}>
                                {type === 'teacher' ? (<>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="font-medium text-[#202223]">{row.teacher_profile?.user?.name || '-'}</div>
                                        <div className="text-[11px] text-[#6d7175]">ID: {row.teacher_profile?.employee_id || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[12px] text-[#6d7175]">{row.previous_designation || '-'}</TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="text-[12px] font-bold text-[#008060]">{row.new_designation || '-'}</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[12px] text-[#202223]">
                                        {row.promotion_date ? new Date(row.promotion_date).toLocaleDateString('en-GB') : '-'}
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[12px] text-[#6d7175] italic">{row.note || '—'}</TableCell>
                                </>) : (<>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="font-bold text-[#202223]">{row.student_profile?.student_id || '-'}</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="font-medium text-[#202223]">{row.student_profile?.user?.name || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[12px] text-[#6d7175]">{row.academic_session?.name || '-'}</TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="text-[12px] font-bold text-[#202223]">{row.academic_class?.name || '-'}</span>
                                        <span className="text-[11px] text-[#6d7175] ml-1">({row.section?.name || '-'})</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[12px] text-[#6d7175]">
                                        {new Date(row.updated_at).toLocaleDateString('en-GB')}
                                    </TableCell>
                                </>)}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-10 text-[#6d7175]">
                                    No promotion data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-6 px-4 py-3 border-t border-[#ebebeb]">
                    <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                        {(records?.total ?? 0) > 0 ? `${records.from} - ${records.to} of ${records.total}` : '0'}
                    </span>
                    <div className="flex gap-1">
                        <Link href={records?.prev_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!records?.prev_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">‹</span>
                        </Link>
                        <Link href={records?.next_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!records?.next_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">›</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
