import React, { useState, useRef } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ClipboardCheck, Users, AlertCircle, FileDown, CalendarDays, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';

export default function AttendanceReport({ auth, stats, trendData, recentAbsentees, classes, filters }) {
    const [date, setDate]       = useState(filters?.date      || new Date().toISOString().split('T')[0]);
    const [classId, setClassId] = useState(filters?.class_id  || '');
    const [userType, setUserType] = useState(filters?.user_type || 'student');
    const dateInputRef = useRef(null);

    const handleFilter = () => {
        router.get(route('admin.reports.attendance.index'), {
            date,
            class_id: classId,
            user_type: userType,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClear = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setClassId('');
        setUserType('student');
        router.get(route('admin.reports.attendance.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const COLORS = ['#008060', '#e32c2b', '#f49342', '#3b82f6'];
    const pieData = [
        { name: 'Present', value: stats.present },
        { name: 'Absent', value: stats.absent },
        { name: 'Late', value: stats.late },
        { name: 'On Leave', value: stats.leave },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <ClipboardCheck size={20} className="text-[#008060]" />
                            Attendance Reports
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Comprehensive overview of student attendance</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="h-[32px] px-3 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-bold text-[#202223] hover:bg-[#f4f6f8] transition-all flex items-center gap-1.5 shadow-sm">
                            <FileDown size={14} className="text-red-500" />
                            Export Report
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Reports" />

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-[4px] border border-[#ebebeb] shadow-sm mb-5 flex flex-wrap items-end gap-4">
                {/* Date Filter: Calendar Icon Button */}
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Select Date</label>
                    <div className="relative">
                        {/* Hidden native date input */}
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            tabIndex={-1}
                        />
                        {/* Visible button */}
                        <button
                            type="button"
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="h-[32px] pl-3 pr-4 bg-white border border-[#d1d1d1] rounded-[4px] text-[12px] font-medium text-[#202223] hover:border-[#008060] hover:text-[#008060] transition-all flex items-center gap-2 shadow-sm min-w-[160px]"
                        >
                            <CalendarIcon size={15} className="text-[#008060] shrink-0" />
                            <span>{new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </button>
                    </div>
                </div>
                {/* Type Filter */}
                <div className="flex flex-col">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Type</label>
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0 min-w-[140px]"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                {/* Class Filter — only for students */}
                {userType === 'student' && (
                <div className="flex flex-col w-[200px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5 flex items-center gap-1.5">
                        <Users size={14} className="text-[#6d7175]" /> Filter by Class
                    </label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                )}
                <div className="flex items-center gap-2">
                    <button onClick={handleFilter} className="h-[32px] px-4 bg-[#008060] text-white font-bold text-[12px] rounded-[4px] hover:bg-[#006e52] transition-colors flex items-center gap-1.5">
                        <Filter size={14} /> Filter
                    </button>
                    {(filters?.date || filters?.class_id) && (
                        <button onClick={handleClear} className="h-[32px] px-3 bg-white border border-[#d1d1d1] text-[#6d7175] font-bold text-[12px] rounded-[4px] hover:bg-[#f4f6f8] hover:text-[#202223] transition-colors flex items-center gap-1.5">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
                <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-sm flex flex-col justify-center">
                    <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Students</div>
                    <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.total}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#008060] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                    <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Present</div>
                    <div className="flex items-end gap-3">
                        <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.present}</div>
                        <div className="text-[14px] font-bold text-[#008060] mb-0.5">{stats.present_percentage}%</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#e32c2b] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                    <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Absent</div>
                    <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.absent}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#f49342] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                    <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Late</div>
                    <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.late}</div>
                </div>
                <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#3b82f6] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                    <div className="text-[13px] font-bold text-[#6d7175] mb-1">On Leave</div>
                    <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.leave}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Custom SVG Multi-Ring Chart */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-2 border-b border-[#ebebeb] pb-2">Today's Distribution</h3>
                    <div className="h-[260px] w-full flex items-center justify-center">
                        {stats.total > 0 ? (() => {
                            const cx = 110, cy = 120, rings = [
                                { label: 'Present',  pct: Math.round((stats.present / stats.total) * 100), color: '#008060', r: 85 },
                                { label: 'Absent',   pct: Math.round((stats.absent  / stats.total) * 100), color: '#e32c2b', r: 68 },
                                { label: 'Late',     pct: Math.round((stats.late    / stats.total) * 100), color: '#f49342', r: 51 },
                                { label: 'On Leave', pct: Math.round((stats.leave   / stats.total) * 100), color: '#3b82f6', r: 34 },
                            ];
                            const arc = (pct, r) => {
                                const angle = (pct / 100) * 360;
                                const rad = (a) => (a - 90) * Math.PI / 180;
                                const x1 = cx + r * Math.cos(rad(0));
                                const y1 = cy + r * Math.sin(rad(0));
                                const x2 = cx + r * Math.cos(rad(Math.min(angle, 359.99)));
                                const y2 = cy + r * Math.sin(rad(Math.min(angle, 359.99)));
                                return `M ${x1} ${y1} A ${r} ${r} 0 ${angle >= 180 ? 1 : 0} 1 ${x2} ${y2}`;
                            };
                            return (
                                <svg width="280" height="240" viewBox="0 0 280 240">
                                    {rings.map((ring, i) => (
                                        <g key={i}>
                                            {/* background track */}
                                            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke="#f0f0f0" strokeWidth="12" />
                                            {/* colored arc */}
                                            <path
                                                d={arc(ring.pct, ring.r)}
                                                fill="none"
                                                stroke={ring.color}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                            />
                                        </g>
                                    ))}
                                    {/* center text */}
                                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#202223">
                                        {stats.present}
                                    </text>
                                    <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6d7175">
                                        Present
                                    </text>
                                    {/* right-side legend */}
                                    {rings.map((ring, i) => (
                                        <g key={i} transform={`translate(205, ${50 + i * 42})`}>
                                            <circle cx="6" cy="6" r="6" fill={ring.color} />
                                            <text x="16" y="10" fontSize="11" fontWeight="bold" fill="#202223">{ring.pct}%</text>
                                            <text x="16" y="22" fontSize="10" fill="#6d7175">{ring.label}</text>
                                        </g>
                                    ))}
                                </svg>
                            );
                        })() : (
                            <div className="flex flex-col items-center justify-center text-[#6d7175] text-[13px]">
                                <AlertCircle size={32} className="mb-2 text-[#d1d1d1]" />
                                No attendance data for this date
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Horizontal Progress Bar Chart */}
                <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5 lg:col-span-2">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-5 border-b border-[#ebebeb] pb-2 flex justify-between items-center">
                        <span>Attendance Breakdown</span>
                        <CalendarDays size={16} className="text-[#6d7175]" />
                    </h3>
                    <div className="space-y-4">
                        {[
                            {
                                label: 'Present',
                                value: stats.present,
                                pct: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
                                color: '#008060',
                                bg: 'linear-gradient(90deg, #008060, #00a87a)',
                            },
                            {
                                label: 'Absent',
                                value: stats.absent,
                                pct: stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0,
                                color: '#e32c2b',
                                bg: 'linear-gradient(90deg, #e32c2b, #ff5c5b)',
                            },
                            {
                                label: 'Late',
                                value: stats.late,
                                pct: stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0,
                                color: '#f49342',
                                bg: 'linear-gradient(90deg, #f49342, #ffb367)',
                            },
                            {
                                label: 'On Leave',
                                value: stats.leave,
                                pct: stats.total > 0 ? Math.round((stats.leave / stats.total) * 100) : 0,
                                color: '#3b82f6',
                                bg: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                            },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-[80px] text-right text-[12px] font-bold text-[#6d7175] shrink-0">{item.label}</div>
                                <div className="flex-1 relative h-[32px] bg-[#f4f6f8] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                                        style={{
                                            width: `${Math.max(item.pct, 4)}%`,
                                            background: item.bg,
                                        }}
                                    >
                                        <span className="text-white text-[11px] font-bold drop-shadow">{item.pct}%</span>
                                        {/* Arrow tip */}
                                        <div
                                            className="absolute right-0 top-0 h-full w-[28px] flex items-center justify-center"
                                            style={{
                                                right: `calc(${100 - Math.max(item.pct, 4)}% - 1px)`,
                                                position: 'absolute',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-[40px] text-[12px] font-bold shrink-0" style={{ color: item.color }}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Absentees Table */}
            <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm">
                <div className="px-4 py-3 border-b border-[#ebebeb] bg-[#fdfdfd] flex justify-between items-center">
                    <h3 className="text-[13px] font-bold text-[#202223] flex items-center gap-2">
                        <AlertCircle size={15} className="text-[#e32c2b]" />
                        Recent Absentees / Late {filters?.user_type === 'teacher' ? 'Teachers' : 'Students'}
                    </h3>
                    <span className="text-[11px] text-[#6d7175] font-medium">{recentAbsentees?.total ?? 0} record(s)</span>
                </div>
                <Table>
                    <TableHeader>
                        {filters?.user_type === 'teacher' ? (<>
                            <TableHeadCell isFirst className="!py-2 !px-3">Employee ID</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Teacher Name</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Designation</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Status</TableHeadCell>
                            <TableHeadCell isLast className="!py-2 !px-3">Remarks</TableHeadCell>
                        </>) : (<>
                            <TableHeadCell isFirst className="!py-2 !px-3">ID</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Student Name</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Class (Section)</TableHeadCell>
                            <TableHeadCell className="!py-2 !px-3">Status</TableHeadCell>
                            <TableHeadCell isLast className="!py-2 !px-3">Remarks</TableHeadCell>
                        </>)}
                    </TableHeader>
                    <TableBody>
                        {(recentAbsentees?.data?.length ?? 0) > 0 ? (
                            recentAbsentees.data.map((att, idx) => (
                                <TableRow key={idx}>
                                    {filters?.user_type === 'teacher' ? (<>
                                        <TableCell className="!py-1.5 !px-3">
                                            <span className="font-bold text-[#202223]">{att.user?.teacher_profile?.employee_id || '-'}</span>
                                        </TableCell>
                                        <TableCell className="!py-1.5 !px-3">
                                            <div className="font-medium text-[#202223]">{att.user?.name || '-'}</div>
                                        </TableCell>
                                        <TableCell className="!py-1.5 !px-3 text-[12px] text-[#6d7175]">
                                            {att.user?.teacher_profile?.designation || '-'}
                                        </TableCell>
                                    </>) : (<>
                                        <TableCell className="!py-1.5 !px-3">
                                            <span className="font-bold text-[#202223]">{att.user?.student_profile?.student_id || '-'}</span>
                                        </TableCell>
                                        <TableCell className="!py-1.5 !px-3">
                                            <div className="font-medium text-[#202223]">{att.user?.name || '-'}</div>
                                        </TableCell>
                                        <TableCell className="!py-1.5 !px-3">
                                            <span className="text-[12px] font-bold text-[#202223]">
                                                {att.user?.student_profile?.latest_enrollment?.academic_class?.name || '-'}
                                                <span className="font-normal text-[#6d7175] ml-1">({att.user?.student_profile?.latest_enrollment?.section?.name || '-'})</span>
                                            </span>
                                        </TableCell>
                                    </>)}
                                    <TableCell className="!py-1.5 !px-3">
                                        {att.status === 'absent' && <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wider">Absent</span>}
                                        {att.status === 'late' && <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-orange-50 text-orange-600 uppercase tracking-wider">Late</span>}
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3 text-[#6d7175] italic">
                                        {att.remarks || '—'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-8 text-[#6d7175]">
                                    No absentees or late {filters?.user_type === 'teacher' ? 'teachers' : 'students'} found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex items-center justify-end gap-6 px-4 py-3 border-t border-[#ebebeb]">
                    <span className="text-[12px] text-[#6d7175] font-medium tabular-nums">
                        {(recentAbsentees?.total ?? 0) > 0 ? `${recentAbsentees.from} - ${recentAbsentees.to} of ${recentAbsentees.total}` : '0'}
                    </span>
                    <div className="flex gap-1">
                        <Link href={recentAbsentees?.prev_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!recentAbsentees?.prev_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">‹</span>
                        </Link>
                        <Link href={recentAbsentees?.next_page_url || '#'} preserveState preserveScroll
                            as="button" disabled={!recentAbsentees?.next_page_url}
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm">
                            <span className="text-[14px]">›</span>
                        </Link>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}
