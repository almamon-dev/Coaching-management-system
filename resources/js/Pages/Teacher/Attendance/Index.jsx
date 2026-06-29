import React, { useState, useMemo, useEffect } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import AttendanceToolbar from '@/Components/Attendance/AttendanceToolbar';
import AttendanceTable from '@/Components/Attendance/AttendanceTable';

export default function Index({ auth, students = [], date, isAttendanceTaken }) {
    const { data, setData, post, processing, errors } = useForm({
        date: date,
        attendances: students.map(s => ({
            id: s.id,
            status: s.status || 'present',
            remarks: s.remarks || ''
        }))
    });

    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);

    // Update local form state if students prop changes (e.g. date changed)
    useEffect(() => {
        setData('attendances', students.map(s => ({
            id: s.id,
            status: s.status || 'present',
            remarks: s.remarks || ''
        })));
    }, [students]);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setData('date', newDate);
        router.get(route('teacher.mark-attendance'), { date: newDate }, {
            preserveState: true,
            replace: true
        });
    };

    // Computed Stats
    const stats = useMemo(() => {
        const total = data.attendances.length;
        const present = data.attendances.filter(s => s.status === 'present').length;
        const absent = data.attendances.filter(s => s.status === 'absent').length;
        const late = data.attendances.filter(s => s.status === 'late').length;
        const onLeave = data.attendances.filter(s => s.status === 'on_leave').length;

        return {
            total,
            present,
            absent,
            late,
            onLeave,
            presentPct: total ? ((present / total) * 100).toFixed(1) : '0.0',
            absentPct: total ? ((absent / total) * 100).toFixed(1) : '0.0',
            latePct: total ? ((late / total) * 100).toFixed(1) : '0.0',
            onLeavePct: total ? ((onLeave / total) * 100).toFixed(1) : '0.0'
        };
    }, [data.attendances]);

    // Handlers
    const handleStatusChange = (id, newStatus) => {
        setData('attendances', data.attendances.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleRemarkChange = (id, val) => {
        setData('attendances', data.attendances.map(s => s.id === id ? { ...s, remarks: val } : s));
    };

    const handleQuickAction = (action) => {
        if (action === 'Clear') {
            setData('attendances', data.attendances.map(s => ({ ...s, status: 'present', remarks: '' })));
        }
    };

    const handleSelectedBulkAction = (action) => {
        if (selectedIds.length === 0) return alert('Please select at least one student.');
        setData('attendances', data.attendances.map(s => selectedIds.includes(s.id) ? { ...s, status: action } : s));
        setSelectedIds([]);
        setBulkDropdownOpen(false);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === data.attendances.length && data.attendances.length > 0) setSelectedIds([]);
        else setSelectedIds(data.attendances.map(s => s.id));
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('teacher.attendance.store'), {
            preserveScroll: true,
            onSuccess: () => {
                // Flash message will handle notification
            }
        });
    };

    return (
        <TeacherLayout user={auth?.user}>
            <Head title="Student Attendance" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#008060]" />
                        Student Attendance
                    </h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Record and monitor daily student attendance</p>
                </div>
            </div>

            {isAttendanceTaken && (
                <div className="bg-[#e6f2ef] border border-[#008060] rounded-[4px] p-4 mb-6 flex items-start gap-3 shadow-sm">
                    <CheckCircle2 className="text-[#008060] w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="text-[#008060] font-bold text-[14px]">Attendance Already Recorded</h3>
                        <p className="text-[#008060] text-[13px] mt-1 font-medium">
                            Attendance for {date} has already been recorded. You can still make changes below and save to update the records.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] mb-8 flex flex-col">
                <AttendanceToolbar 
                    stats={stats}
                    data={data}
                    handleDateChange={handleDateChange}
                    selectedIds={selectedIds}
                    bulkDropdownOpen={bulkDropdownOpen}
                    setBulkDropdownOpen={setBulkDropdownOpen}
                    handleSelectedBulkAction={handleSelectedBulkAction}
                    handleQuickAction={handleQuickAction}
                    processing={processing}
                />

                <AttendanceTable 
                    students={students}
                    data={data}
                    selectedIds={selectedIds}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelect={toggleSelect}
                    handleStatusChange={handleStatusChange}
                    handleRemarkChange={handleRemarkChange}
                    auth={auth}
                />
            </form>
        </TeacherLayout>
    );
}
