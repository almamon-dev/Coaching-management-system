import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Award, ArrowRight, User } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';
import Modal from '@/Components/Modal/Modal';
import SecondaryButton from '@/Components/Button/SecondaryButton';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@/Components/Table/Table';
import SortableHeader from '@/Components/Table/SortableHeader';
import TableSearch from '@/Components/Table/TableSearch';

export default function Index({ auth, teachers, filters, designations, departments }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        teacher_profile_id: '',
        new_designation: '',
        new_department: '',
        promotion_date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('admin.teacher-promotions.index'), { search }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const openModal = (teacher) => {
        clearErrors();
        setSelectedTeacher(teacher);
        setData({
            teacher_profile_id: teacher.id,
            new_designation: teacher.designation || '',
            new_department: teacher.department || '',
            promotion_date: new Date().toISOString().split('T')[0],
            note: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setSelectedTeacher(null);
        }, 300);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.teacher-promotions.store'), {
            onSuccess: () => closeModal()
        });
    };

    const designationOptions = designations.map(d => ({ id: d.name, name: d.name }));
    const departmentOptions = departments.map(d => ({ id: d.name, name: d.name }));

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#202223] tracking-tight flex items-center gap-2">
                            <Award size={20} className="text-[#008060]" />
                            Teacher Promotion
                        </h2>
                        <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Manage designations and promote teaching staff.</p>
                    </div>
                </div>
            }
        >
            <Head title="Teacher Promotion" />

            <div className="bg-white rounded-[4px] shadow-sm border border-[#ebebeb]">
                <div className="p-3 border-b border-[#ebebeb] flex items-center gap-4">
                    <TableSearch 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or Employee ID..."
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableHeadCell isFirst className="w-[50px]">SL</TableHeadCell>
                        <SortableHeader label="Teacher Info" field="name" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.teacher-promotions.index', params: filters }} />
                        <SortableHeader label="Current Designation" field="designation" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.teacher-promotions.index', params: filters }} />
                        <SortableHeader label="Department" field="department" currentSortField={filters?.sort_field} currentSortDirection={filters?.sort_direction} routeConfig={{ name: 'admin.teacher-promotions.index', params: filters }} />
                        <TableHeadCell align="right" isLast>Actions</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {teachers.data.length > 0 ? (
                            teachers.data.map((teacher, index) => (
                                <TableRow key={teacher.id}>
                                    <TableCell align="center">
                                        <span className="text-[12px] font-bold text-slate-500">{(teachers.current_page - 1) * teachers.per_page + index + 1}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-[32px] h-[32px] bg-[#e4f1ef] text-[#008060] font-bold text-[13px] rounded-full flex items-center justify-center shrink-0">
                                                {teacher.user?.name?.substring(0, 2).toUpperCase() || 'TR'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-slate-800">{teacher.user?.name}</span>
                                                <span className="text-[11px] font-medium text-slate-500">Emp ID: {teacher.employee_id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            {teacher.designation || 'Not Assigned'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[13px] font-medium text-slate-600">{teacher.department || '-'}</span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <button 
                                            onClick={() => openModal(teacher)}
                                            className="h-[28px] px-3 inline-flex items-center justify-center bg-[#008060] text-white text-[12px] font-bold rounded-[3px] hover:bg-[#006e52] transition-colors shadow-sm"
                                        >
                                            <Award size={14} className="mr-1.5" />
                                            Promote
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-12 text-slate-400">
                                    <User className="mx-auto mb-2.5 text-slate-300" size={32} />
                                    <h5 className="text-[13.5px] font-bold text-slate-700">No teachers found</h5>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-[75px]">
                            <SelectInput
                                value={teachers.per_page}
                                onChange={(e) => {
                                    router.get(route('admin.teacher-promotions.index'), { ...filters, per_page: e.target.value, page: 1 }, { preserveState: true, preserveScroll: true });
                                }}
                                showSearch={false}
                                direction="up"
                                options={[{ id: '10', name: '10' }, { id: '15', name: '15' }, { id: '30', name: '30' }, { id: '50', name: '50' }]}
                                className="[&_button]:h-[30px] [&_button]:py-0 min-w-0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                            {teachers.total > 0 ? `${teachers.from || 0} - ${teachers.to || 0} of ${teachers.total}` : '0 - 0'}
                        </span>
                        <div className="flex gap-1">
                            <Link
                                href={teachers.prev_page_url || '#'}
                                preserveState preserveScroll
                                as="button" disabled={!teachers.prev_page_url}
                                className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                            >
                                <span className="text-[14px]">‹</span>
                            </Link>
                            <Link
                                href={teachers.next_page_url || '#'}
                                preserveState preserveScroll
                                as="button" disabled={!teachers.next_page_url}
                                className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                            >
                                <span className="text-[14px]">›</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-0">
                    <div className="px-5 py-4 border-b border-[#ebebeb] bg-[#f4f6f8] flex items-center justify-between rounded-t-[8px]">
                        <h2 className="text-[16px] font-bold text-[#202223] flex items-center gap-2">
                            <Award size={18} className="text-[#008060]" />
                            Promote Teacher
                        </h2>
                    </div>

                    <div className="p-5 space-y-4">
                        {selectedTeacher && (
                            <div className="bg-[#f0f9f7] p-3 rounded-[4px] border border-[#008060]/20 mb-4">
                                <div className="text-[12px] font-bold text-[#008060] mb-1">Current Status</div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[13px] font-bold text-[#202223]">{selectedTeacher.user?.name}</div>
                                        <div className="text-[11px] text-[#6d7175]">{selectedTeacher.designation} • {selectedTeacher.department}</div>
                                    </div>
                                    <ArrowRight className="text-[#008060]/50" size={16} />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">New Designation <span className="text-red-500">*</span></label>
                            <SelectInput
                                value={data.new_designation}
                                onChange={e => setData('new_designation', e.target.value)}
                                options={designationOptions}
                                className="w-full"
                                placeholder="Select Designation..."
                            />
                            {errors.new_designation && <div className="text-[11px] text-red-500 mt-1">{errors.new_designation}</div>}
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">New Department</label>
                            <SelectInput
                                value={data.new_department}
                                onChange={e => setData('new_department', e.target.value)}
                                options={departmentOptions}
                                className="w-full"
                                placeholder="Select Department..."
                            />
                            {errors.new_department && <div className="text-[11px] text-red-500 mt-1">{errors.new_department}</div>}
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Promotion Date <span className="text-red-500">*</span></label>
                            <TextInput
                                type="date"
                                value={data.promotion_date}
                                onChange={e => setData('promotion_date', e.target.value)}
                                className="w-full"
                            />
                            {errors.promotion_date && <div className="text-[11px] text-red-500 mt-1">{errors.promotion_date}</div>}
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold text-[#202223] mb-1.5">Note / Remarks</label>
                            <textarea
                                value={data.note}
                                onChange={e => setData('note', e.target.value)}
                                className="w-full h-[80px] rounded-[4px] border-[#d1d1d1] text-[13px] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] resize-none"
                                placeholder="Reason or remarks for promotion..."
                            />
                        </div>
                    </div>

                    <div className="px-5 py-4 border-t border-[#ebebeb] bg-[#f4f6f8] flex items-center justify-end gap-2 rounded-b-[8px]">
                        <SecondaryButton onClick={closeModal} disabled={processing} className="h-[36px]">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing} className="h-[36px] bg-[#008060] hover:bg-[#006e52]">
                            {processing ? 'Processing...' : 'Confirm Promotion'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
