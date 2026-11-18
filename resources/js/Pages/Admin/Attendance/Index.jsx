import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import AttendanceToolbar from '@/Components/Attendance/AttendanceToolbar';
import AttendanceTable from '@/Components/Attendance/AttendanceTable';
import SelectInput from '@/Components/Form/SelectInput';
import InputLabel from '@/Components/Form/InputLabel';

export default function AttendanceIndex({ 
    batches = [], 
    students = [], 
    existingAttendances = {}, 
    existingRemarks = {}, 
    selectedBatchId, 
    selectedDate, 
    isAttendanceTaken = false, 
    auth 
}) {
    const [batchId, setBatchId] = useState(selectedBatchId || (batches[0]?.id || ''));
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);

    const buildAttendancesList = (studentList, existAtt, existRem) => {
        return (studentList || []).map(st => {
            const rawStatus = existAtt?.[st.id];
            let status = 'present';
            if (rawStatus) {
                status = (rawStatus === 'leave' || rawStatus === 'on_leave') ? 'on_leave' : rawStatus;
            }
            const remarks = existRem?.[st.id] || '';
            return {
                id: st.id,
                status,
                remarks
            };
        });
    };

    const { data, setData, post, processing } = useForm({
        batch_id: selectedBatchId || (batches[0]?.id || ''),
        date: selectedDate || new Date().toISOString().split('T')[0],
        attendances: buildAttendancesList(students, existingAttendances, existingRemarks),
    });

    useEffect(() => {
        setBatchId(selectedBatchId || (batches[0]?.id || ''));
        const freshAttendances = buildAttendancesList(students, existingAttendances, existingRemarks);
        setData({
            batch_id: selectedBatchId || (batches[0]?.id || ''),
            date: selectedDate || new Date().toISOString().split('T')[0],
            attendances: freshAttendances,
        });
        setSelectedIds([]);
    }, [students, existingAttendances, existingRemarks, selectedBatchId, selectedDate]);

    const handleBatchChange = (newBatchId) => {
        setBatchId(newBatchId);
        router.get(route('admin.attendance.index'), {
            batch_id: newBatchId,
            date: data.date,
        }, { preserveState: true, replace: true, preserveScroll: true });
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (!newDate) return;
        setData('date', newDate);
        router.get(route('admin.attendance.index'), {
            batch_id: batchId,
            date: newDate,
        }, { preserveState: true, replace: true, preserveScroll: true });
    };

    const handleStatusChange = (studentId, status) => {
        setData('attendances', data.attendances.map(a => a.id === studentId ? { ...a, status } : a));
    };

    const handleRemarkChange = (studentId, remarks) => {
        setData('attendances', data.attendances.map(a => a.id === studentId ? { ...a, remarks } : a));
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === students.length && students.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map(s => s.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectedBulkAction = (status) => {
        if (selectedIds.length === 0) return;
        setData('attendances', data.attendances.map(a => selectedIds.includes(a.id) ? { ...a, status } : a));
        setBulkDropdownOpen(false);
    };

    const handleQuickAction = (action) => {
        if (action === 'Clear' || action === 'MarkAllPresent') {
            setData('attendances', data.attendances.map(a => ({ ...a, status: 'present' })));
        } else if (action === 'MarkAllAbsent') {
            setData('attendances', data.attendances.map(a => ({ ...a, status: 'absent' })));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const attendanceMap = {};
        const remarksMap = {};
        data.attendances.forEach(a => {
            attendanceMap[a.id] = a.status;
            if (a.remarks) {
                remarksMap[a.id] = a.remarks;
            }
        });

        router.post(route('admin.attendance.store'), {
            batch_id: batchId,
            date: data.date,
            attendances: attendanceMap,
            remarks: remarksMap,
        }, {
            preserveScroll: true,
        });
    };

    const batchOptions = batches.map(b => ({ id: b.id, name: b.name }));

    // Compute Toolbar Stats
    const total = students.length;
    const present = data.attendances.filter(a => a.status === 'present').length;
    const absent = data.attendances.filter(a => a.status === 'absent').length;
    const late = data.attendances.filter(a => a.status === 'late').length;
    const onLeave = data.attendances.filter(a => a.status === 'on_leave' || a.status === 'leave').length;

    const stats = {
        total,
        present,
        presentPct: total > 0 ? Math.round((present / total) * 100) : 0,
        absent,
        absentPct: total > 0 ? Math.round((absent / total) * 100) : 0,
        late,
        latePct: total > 0 ? Math.round((late / total) * 100) : 0,
        onLeave,
        onLeavePct: total > 0 ? Math.round((onLeave / total) * 100) : 0,
    };

    return (
        <AdminLayout>
            <Head title="Attendance Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Management</h1>
                    <p className="text-xs text-[#6d7175]">Record daily student attendance, status tracking & remarks.</p>
                </div>

                <div className="w-full md:w-72">
                    <InputLabel htmlFor="batchId" value="Select Batch *" />
                    <SelectInput
                        value={batchId}
                        onChange={(e) => {
                            const val = e.target ? e.target.value : e;
                            handleBatchChange(val);
                        }}
                        options={batchOptions}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] overflow-hidden">
                <AttendanceToolbar
                    title="Batch Students:"
                    stats={stats}
                    data={data}
                    handleDateChange={handleDateChange}
                    selectedIds={selectedIds}
                    bulkDropdownOpen={bulkDropdownOpen}
                    setBulkDropdownOpen={setBulkDropdownOpen}
                    handleSelectedBulkAction={handleSelectedBulkAction}
                    handleQuickAction={handleQuickAction}
                    processing={processing}
                    isAttendanceTaken={isAttendanceTaken}
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
        </AdminLayout>
    );
}
