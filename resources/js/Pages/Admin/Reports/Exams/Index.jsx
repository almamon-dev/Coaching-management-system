import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BookOpen, Trophy, TrendingUp, Users, Filter, X, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';

const GRADE_COLORS = {
    'A+': '#008060', 'A': '#00a87a', 'A-': '#3b82f6',
    'B':  '#6366f1', 'C': '#f49342', 'D': '#fb923c', 'F': '#e32c2b',
};

export default function ExamReport({ auth, summary, gpaDistribution, classPerformance, topPerformers, overallStats, exams, classes, filters }) {
    const [examId, setExamId]   = React.useState(filters?.exam_id  || '');
    const [classId, setClassId] = React.useState(filters?.class_id || '');

    const handleFilter = () => {
        router.get(route('admin.reports.exams.index'), { exam_id: examId, class_id: classId },
            { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClear = () => {
        setExamId(''); setClassId('');
        router.get(route('admin.reports.exams.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <BookOpen size={20} className="text-[#008060]" />
                            Exam Reports
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Performance analytics and result overview</p>
                    </div>
                    <button className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                        <FileDown size={14} className="text-red-500" /> Export Report
                    </button>
                </div>
            }
        >
            <Head title="Exam Reports" />

            {/* Filters */}
            <div className="bg-white p-4 rounded-[4px] border border-[#ebebeb] shadow-sm mb-5 flex flex-wrap items-end gap-4">
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Exam</label>
                    <select value={examId} onChange={e => setExamId(e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0 min-w-[200px]">
                        <option value="">All Exams</option>
                        {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Class</label>
                    <select value={classId} onChange={e => setClassId(e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0 min-w-[160px]">
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleFilter} className="h-[32px] px-4 bg-[#008060] text-white font-bold text-[12px] rounded-[4px] hover:bg-[#006e52] transition-colors flex items-center gap-1.5">
                        <Filter size={14} /> Filter
                    </button>
                    {(filters?.exam_id || filters?.class_id) && (
                        <button onClick={handleClear} className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#6d7175] font-bold text-[12px] rounded-[4px] hover:bg-[#f4f6f8] transition-colors flex items-center gap-1.5">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
                <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-sm">
                    <div className="text-[12px] font-bold text-[#6d7175] mb-1">Total Results</div>
                    <div className="text-[26px] font-bold text-[#202223]">{overallStats.total_results}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#008060] border-y border-r border-[#ebebeb] shadow-sm">
                    <div className="text-[12px] font-bold text-[#6d7175] mb-1">Passed</div>
                    <div className="text-[26px] font-bold text-[#202223]">{overallStats.passed}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#e32c2b] border-y border-r border-[#ebebeb] shadow-sm">
                    <div className="text-[12px] font-bold text-[#6d7175] mb-1">Failed</div>
                    <div className="text-[26px] font-bold text-[#202223]">{overallStats.failed}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#3b82f6] border-y border-r border-[#ebebeb] shadow-sm">
                    <div className="text-[12px] font-bold text-[#6d7175] mb-1">Pass Rate</div>
                    <div className="text-[26px] font-bold text-[#202223]">{overallStats.pass_rate}%</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#f49342] border-y border-r border-[#ebebeb] shadow-sm">
                    <div className="text-[12px] font-bold text-[#6d7175] mb-1">Avg GPA</div>
                    <div className="text-[26px] font-bold text-[#202223]">{overallStats.avg_gpa}</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                {/* GPA Distribution Bar Chart */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-4 border-b border-[#ebebeb] pb-2 flex items-center gap-2">
                        <TrendingUp size={15} className="text-[#008060]" /> Grade Distribution
                    </h3>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gpaDistribution} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '6px', fontSize: '12px', border: '1px solid #ebebeb' }} />
                                <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]} maxBarSize={45}>
                                    {gpaDistribution.map((entry, i) => (
                                        <Cell key={i} fill={GRADE_COLORS[entry.grade] || '#6d7175'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Class-wise pass rate */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-4 border-b border-[#ebebeb] pb-2 flex items-center gap-2">
                        <Users size={15} className="text-[#008060]" /> Class-wise Pass Rate
                    </h3>
                    <div className="space-y-3 pt-1">
                        {classPerformance.length > 0 ? classPerformance.map((row, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-[80px] text-right text-[11px] font-bold text-[#6d7175] shrink-0 truncate">{row.class}</div>
                                <div className="flex-1 h-[28px] bg-[#f4f6f8] rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                                        style={{
                                            width: `${Math.max(row.pass_pct, 3)}%`,
                                            background: `linear-gradient(90deg, #008060, #00c48a)`,
                                        }}
                                    >
                                        {row.pass_pct > 10 && <span className="text-white text-[10px] font-bold">{row.pass_pct}%</span>}
                                    </div>
                                </div>
                                <div className="w-[50px] text-[11px] font-bold text-[#008060] shrink-0">{row.pass_pct}%</div>
                            </div>
                        )) : (
                            <div className="text-center text-[#6d7175] text-[13px] py-8">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm mb-5">
                <div className="px-4 py-3 border-b border-[#ebebeb] bg-[#fdfdfd] flex justify-between items-center">
                    <h3 className="text-[13px] font-bold text-[#202223]">Exam Result Summary</h3>
                    <span className="text-[11px] text-[#6d7175]">{summary?.total ?? 0} record(s)</span>
                </div>
                <Table>
                    <TableHeader>
                        <TableHeadCell isFirst className="!py-2 !px-3">Exam</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Class</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Total</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Passed</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Failed</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Avg Marks</TableHeadCell>
                        <TableHeadCell isLast className="!py-2 !px-3">Avg GPA</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {(summary?.data?.length ?? 0) > 0 ? summary.data.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="!py-1.5 !px-3 font-medium text-[#202223]">{row.exam?.name || '-'}</TableCell>
                                <TableCell className="!py-1.5 !px-3">{row.academic_class?.name || '-'}</TableCell>
                                <TableCell className="!py-1.5 !px-3 font-bold">{row.total}</TableCell>
                                <TableCell className="!py-1.5 !px-3">
                                    <span className="text-[11px] font-bold text-[#008060]">{row.passed}</span>
                                </TableCell>
                                <TableCell className="!py-1.5 !px-3">
                                    <span className="text-[11px] font-bold text-[#e32c2b]">{row.failed}</span>
                                </TableCell>
                                <TableCell className="!py-1.5 !px-3">{row.avg_marks}</TableCell>
                                <TableCell className="!py-1.5 !px-3 font-bold">{row.avg_gpa}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-6 text-[#6d7175]">No summary data available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex items-center justify-end gap-6 px-4 py-3 border-t border-[#ebebeb]">
                    <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                        {(summary?.total ?? 0) > 0 ? `${summary.from} - ${summary.to} of ${summary.total}` : '0'}
                    </span>
                    <div className="flex gap-1">
                        <Link href={summary?.prev_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!summary?.prev_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">‹</span>
                        </Link>
                        <Link href={summary?.next_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!summary?.next_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">›</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm">
                <div className="px-4 py-3 border-b border-[#ebebeb] bg-[#fdfdfd] flex justify-between items-center">
                    <h3 className="text-[13px] font-bold text-[#202223] flex items-center gap-2">
                        <Trophy size={14} className="text-[#f49342]" /> Top Performers
                    </h3>
                    <span className="text-[11px] text-[#6d7175]">{topPerformers?.total ?? 0} student(s)</span>
                </div>
                <Table>
                    <TableHeader>
                        <TableHeadCell isFirst className="!py-2 !px-3">#</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Student</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Exam</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Class</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Total Marks</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">GPA</TableHeadCell>
                        <TableHeadCell isLast className="!py-2 !px-3">Grade</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {(topPerformers?.data?.length ?? 0) > 0 ? topPerformers.data.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="!py-1.5 !px-3 font-bold text-[#6d7175]">{((topPerformers.current_page - 1) * topPerformers.per_page) + idx + 1}</TableCell>
                                <TableCell className="!py-1.5 !px-3">
                                    <div className="font-medium text-[#202223]">{row.student?.name || '-'}</div>
                                </TableCell>
                                <TableCell className="!py-1.5 !px-3 text-[#6d7175]">{row.exam?.name || '-'}</TableCell>
                                <TableCell className="!py-1.5 !px-3">{row.academic_class?.name || '-'}</TableCell>
                                <TableCell className="!py-1.5 !px-3 font-bold">{row.total_marks}</TableCell>
                                <TableCell className="!py-1.5 !px-3 font-bold text-[#008060]">{row.gpa}</TableCell>
                                <TableCell className="!py-1.5 !px-3">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider"
                                        style={{ background: (GRADE_COLORS[row.grade] || '#6d7175') + '20', color: GRADE_COLORS[row.grade] || '#6d7175' }}>
                                        {row.grade}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-8 text-[#6d7175]">No results found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-6 px-4 py-3 border-t border-[#ebebeb]">
                    <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                        {(topPerformers?.total ?? 0) > 0 ? `${topPerformers.from} - ${topPerformers.to} of ${topPerformers.total}` : '0'}
                    </span>
                    <div className="flex gap-1">
                        <Link
                            href={topPerformers?.prev_page_url || '#'}
                            preserveState preserveScroll
                            as="button" disabled={!topPerformers?.prev_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <span className="text-[14px]">‹</span>
                        </Link>
                        <Link
                            href={topPerformers?.next_page_url || '#'}
                            preserveState preserveScroll
                            as="button" disabled={!topPerformers?.next_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                        >
                            <span className="text-[14px]">›</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
