import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileText, FileDown, Table as TableIcon, Eye, Users } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';
import TableSearch from '@/Components/Table/TableSearch';
import SelectInput from '@/Components/Form/SelectInput';

export default function Index({ auth, filters, reportData, stats, genderData, designations, designationDistribution, classDistribution, totalStudents }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleFilterChange = (key, value) => {
        router.get(route('admin.reports.teachers.index'), {
            ...filters,
            [key]: value,
            page: 1
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('admin.reports.teachers.index'), {
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
                            Teacher Reports
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Overview and export of teacher records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Export placeholder */}
                    </div>
                </div>
            }
        >
            <Head title="Teacher Reports" />

            {stats && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
                        <div className="bg-white p-5 rounded-[4px] border border-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Total Teachers</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.total}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#008060] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Male Teachers</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.male}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#ec4899] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Female Teachers</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.female}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#f49342] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Departments</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.departments}</div>
                        </div>
                        <div className="bg-white p-5 rounded-[4px] border-l-4 border-l-[#3b82f6] border-y border-y-[#ebebeb] border-r border-r-[#ebebeb] shadow-sm flex flex-col justify-center">
                            <div className="text-[13px] font-bold text-[#6d7175] mb-1">Designations</div>
                            <div className="text-[28px] font-bold text-[#202223] leading-none">{stats.designations}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5">
                            <h3 className="text-[14px] font-bold text-[#202223] mb-2 border-b border-[#ebebeb] pb-2">Gender Distribution</h3>
                            <div className="h-[260px] w-full flex items-center justify-center">
                                {stats.total > 0 ? (() => {
                                    const cx = 110, cy = 120;
                                    const male = genderData.find(g => g.name === 'Male')?.value || 0;
                                    const female = genderData.find(g => g.name === 'Female')?.value || 0;
                                    const rings = [
                                        { label: 'Male',   pct: Math.round((male / stats.total) * 100), color: '#3b82f6', r: 80 },
                                        { label: 'Female', pct: Math.round((female / stats.total) * 100), color: '#ec4899', r: 55 },
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
                                                    <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke="#f0f0f0" strokeWidth="15" />
                                                    <path d={arc(ring.pct, ring.r)} fill="none" stroke={ring.color} strokeWidth="15" strokeLinecap="round" />
                                                </g>
                                            ))}
                                            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#202223">{stats.total}</text>
                                            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6d7175">Total</text>
                                            {rings.map((ring, i) => (
                                                <g key={i} transform={`translate(205, ${80 + i * 42})`}>
                                                    <circle cx="6" cy="6" r="6" fill={ring.color} />
                                                    <text x="16" y="10" fontSize="11" fontWeight="bold" fill="#202223">{ring.pct}%</text>
                                                    <text x="16" y="22" fontSize="10" fill="#6d7175">{ring.label}</text>
                                                </g>
                                            ))}
                                        </svg>
                                    );
                                })() : (
                                    <div className="flex flex-col items-center justify-center text-[#6d7175] text-[13px]">
                                        <Users size={32} className="mb-2 text-[#d1d1d1]" />
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5 lg:col-span-2 flex flex-col">
                            <h3 className="text-[14px] font-bold text-[#202223] mb-5 border-b border-[#ebebeb] pb-2 flex justify-between items-center shrink-0">
                                <span>Teachers Per Designation</span>
                                <Users size={16} className="text-[#6d7175]" />
                            </h3>
                            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1 max-h-[240px]">
                                {(() => {
                                    const palette = [
                                        { from: '#008060', to: '#00a87a', text: '#008060' },
                                        { from: '#3b82f6', to: '#60a5fa', text: '#3b82f6' },
                                        { from: '#f49342', to: '#fbbf24', text: '#d97706' },
                                        { from: '#ec4899', to: '#f472b6', text: '#db2777' },
                                        { from: '#8b5cf6', to: '#a78bfa', text: '#7c3aed' },
                                        { from: '#06b6d4', to: '#67e8f9', text: '#0891b2' },
                                        { from: '#ef4444', to: '#f87171', text: '#dc2626' },
                                        { from: '#10b981', to: '#6ee7b7', text: '#059669' },
                                        { from: '#f59e0b', to: '#fcd34d', text: '#d97706' },
                                        { from: '#6366f1', to: '#a5b4fc', text: '#4f46e5' },
                                    ];
                                    return designationDistribution.map((item, idx) => {
                                        const pct = stats.total > 0 ? Math.round((item.teachers / stats.total) * 100) : 0;
                                        const clr = palette[idx % palette.length];
                                        const bg = `linear-gradient(90deg, ${clr.from}, ${clr.to})`;
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-[120px] text-right text-[12px] font-bold text-[#6d7175] shrink-0 truncate" title={item.name}>{item.name}</div>
                                                <div className="flex-1 relative h-[32px] bg-[#f4f6f8] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                                                        style={{ width: `${Math.max(pct, 4)}%`, background: bg }}
                                                    >
                                                        <span className="text-white text-[11px] font-bold drop-shadow">{pct}%</span>
                                                        <div className="absolute right-0 top-0 h-full w-[28px] flex items-center justify-center" style={{ right: `calc(${100 - Math.max(pct, 4)}% - 1px)`, position: 'absolute' }} />
                                                    </div>
                                                </div>
                                                <div className="w-[40px] text-[12px] font-bold shrink-0" style={{ color: clr.text }}>{item.teachers}</div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Students Per Class Bar Chart */}
                    {classDistribution && classDistribution.length > 0 && (
                        <div className="bg-white border border-[#ebebeb] rounded-[4px] shadow-sm p-5 mb-5">
                            <h3 className="text-[14px] font-bold text-[#202223] mb-5 border-b border-[#ebebeb] pb-2 flex justify-between items-center">
                                <span>Students Per Class</span>
                                <Users size={16} className="text-[#6d7175]" />
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                                {(() => {
                                    const palette = [
                                        { from: '#008060', to: '#00a87a', text: '#008060' },
                                        { from: '#3b82f6', to: '#60a5fa', text: '#3b82f6' },
                                        { from: '#f49342', to: '#fbbf24', text: '#d97706' },
                                        { from: '#ec4899', to: '#f472b6', text: '#db2777' },
                                        { from: '#8b5cf6', to: '#a78bfa', text: '#7c3aed' },
                                        { from: '#06b6d4', to: '#67e8f9', text: '#0891b2' },
                                        { from: '#ef4444', to: '#f87171', text: '#dc2626' },
                                        { from: '#10b981', to: '#6ee7b7', text: '#059669' },
                                        { from: '#f59e0b', to: '#fcd34d', text: '#d97706' },
                                        { from: '#6366f1', to: '#a5b4fc', text: '#4f46e5' },
                                    ];
                                    return classDistribution.map((item, idx) => {
                                        const pct = totalStudents > 0 ? Math.round((item.students / totalStudents) * 100) : 0;
                                        const clr = palette[idx % palette.length];
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-[100px] text-right text-[12px] font-bold text-[#6d7175] shrink-0 truncate" title={item.name}>{item.name}</div>
                                                <div className="flex-1 relative h-[32px] bg-[#f4f6f8] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                                                        style={{ width: `${Math.max(pct, 4)}%`, background: `linear-gradient(90deg, ${clr.from}, ${clr.to})` }}
                                                    >
                                                        <span className="text-white text-[11px] font-bold drop-shadow">{pct}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-[36px] text-[12px] font-bold shrink-0" style={{ color: clr.text }}>{item.students}</div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-blue-50 text-blue-600 text-[10px] font-bold">♂{item.male ?? 0}</span>
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-pink-50 text-pink-600 text-[10px] font-bold">♀{item.female ?? 0}</span>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb] mb-5 p-4 flex flex-wrap items-end gap-4">
                <div className="flex flex-col w-[160px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5">Designation</label>
                    <select
                        value={filters?.designation || ''}
                        onChange={(e) => handleFilterChange('designation', e.target.value)}
                        className="h-[32px] text-[13px] border-[#d1d1d1] rounded-[4px] focus:ring-[#008060] focus:border-[#008060] py-0"
                    >
                        <option value="">All Designations</option>
                        {designations.map((d, i) => <option key={i} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[12px] font-bold text-[#202223] mb-1.5 opacity-0">Search</label>
                    <TableSearch 
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name, ID or phone..."
                        className="w-full"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb]">
                <Table>
                    <TableHeader>
                        <TableHeadCell isFirst className="!py-2 !px-3">Emp ID</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Teacher Name</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Designation</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Department</TableHeadCell>
                        <TableHeadCell className="!py-2 !px-3">Contact</TableHeadCell>
                        <TableHeadCell isLast align="right" className="!py-2 !px-3">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {reportData.data.length > 0 ? (
                            reportData.data.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="font-bold text-[#202223]">{row.employee_id || '-'}</span>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="font-medium text-[#202223]">{row.user?.name || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="text-[12px] text-[#202223]">{row.designation || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <div className="text-[12px] text-[#6d7175]">{row.department || '-'}</div>
                                    </TableCell>
                                    <TableCell className="!py-1.5 !px-3">
                                        <span className="text-[12px] text-[#6d7175]">{row.user?.phone || row.user?.email || '-'}</span>
                                    </TableCell>
                                    <TableCell align="right" className="!py-1.5 !px-3">
                                        <div className="flex justify-end">
                                            <Link
                                                href={route('admin.teachers.show', row.id)}
                                                className="h-[24px] w-[24px] flex items-center justify-center bg-[#008060] text-white rounded-[2px] hover:bg-[#006e52] transition-all cursor-pointer"
                                                title="View Details"
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
                                    No teacher data found.
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
