import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft, User, Phone, Mail, MapPin, School, GraduationCap,
    BookOpen, Layers, CheckCircle, Receipt, Clock, Calendar, AlertCircle, Plus, Trash2
} from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function CreateAdmission({ courses = [], batches = [], feeTypes = [] }) {
    // Map initial batch selection if available
    const initialBatchId = batches[0]?.id || '';
    const initialCourseId = batches[0]?.course_id || courses[0]?.id || '';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        gender: 'male',
        dob: '',
        phone: '',
        email: '',
        guardian_name: '',
        guardian_phone: '',
        school_college: '',
        address: '',
        batch_ids: initialBatchId ? [initialBatchId] : [],
        course_id: initialCourseId,
        batch_id: initialBatchId,
        admission_fee: 1000,
        discount: 0,
        paid_amount: 1000,
        payment_method: 'Cash',
        remarks: '',
    });

    // Helper: find all batches selected
    const selectedBatches = batches.filter(b => data.batch_ids.includes(b.id));

    // Calculate total monthly fee of all selected subjects
    const totalMonthlyFee = selectedBatches.reduce((sum, b) => {
        const c = courses.find(course => String(course.id) === String(b.course_id));
        return sum + Number(c?.fee || 0);
    }, 0);

    // Toggle or change batch for a course
    const handleCourseBatchToggle = (courseId, batchId) => {
        let currentBatchIds = [...data.batch_ids];

        // Find existing batch for this course if any
        const existingBatchForCourse = batches.find(
            b => String(b.course_id) === String(courseId) && currentBatchIds.includes(b.id)
        );

        if (batchId === '' || batchId === null) {
            // Remove batch for this course
            if (existingBatchForCourse) {
                currentBatchIds = currentBatchIds.filter(id => id !== existingBatchForCourse.id);
            }
        } else {
            // If already had a batch for this course, replace it
            if (existingBatchForCourse) {
                currentBatchIds = currentBatchIds.filter(id => id !== existingBatchForCourse.id);
            }
            // Add new batch id
            currentBatchIds.push(Number(batchId));
        }

        const primaryBatch = batches.find(b => b.id === currentBatchIds[0]);

        setData(prev => ({
            ...prev,
            batch_ids: currentBatchIds,
            batch_id: primaryBatch?.id || '',
            course_id: primaryBatch?.course_id || '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.admissions.store'));
    };

    const genderOptions = [
        { id: 'male', name: 'Male' },
        { id: 'female', name: 'Female' },
        { id: 'other', name: 'Other' },
    ];

    const paymentMethodOptions = [
        { id: 'Cash', name: 'Cash Collection' },
        { id: 'bKash', name: 'bKash Mobile Wallet' },
        { id: 'Nagad', name: 'Nagad Mobile Wallet' },
        { id: 'Bank', name: 'Bank Deposit / Transfer' },
        { id: 'Online', name: 'Online Gateway' },
    ];

    return (
        <AdminLayout>
            <Head title="New Student Admission (Multi-Subject)" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Student Admission</h1>
                    <p className="text-sm text-slate-500">
                        Enroll student in one or multiple subjects/batches, setup guardian info & collect admission fee.
                    </p>
                </div>
                <Link
                    href={route('admin.students.index')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-[3px] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Students
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* LEFT & CENTER: STUDENT INFO + MULTI-SUBJECT ENROLLMENT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. PERSONAL INFORMATION */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
                        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <GraduationCap className="text-emerald-600" size={20} /> Student & Academic Details
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Student Full Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Arafat Hassan"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="gender" value="Gender *" />
                                <SelectInput
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target ? e.target.value : e)}
                                    options={genderOptions}
                                />
                                <InputError message={errors.gender} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="dob" value="Date of Birth" />
                                <TextInput
                                    id="dob"
                                    type="date"
                                    value={data.dob}
                                    onChange={(e) => setData('dob', e.target.value)}
                                />
                                <InputError message={errors.dob} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Student Mobile Phone" />
                                <TextInput
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="017XXXXXXXX"
                                />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="school_college" value="School / College" />
                                <TextInput
                                    id="school_college"
                                    type="text"
                                    value={data.school_college}
                                    onChange={(e) => setData('school_college', e.target.value)}
                                    placeholder="e.g. Dhaka City College"
                                />
                                <InputError message={errors.school_college} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email Address" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>
                        </div>

                        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 pt-3">
                            Guardian Contact Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="guardian_name" value="Guardian Name *" />
                                <TextInput
                                    id="guardian_name"
                                    type="text"
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                    placeholder="e.g. Kamrul Hassan"
                                    required
                                />
                                <InputError message={errors.guardian_name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="guardian_phone" value="Guardian Mobile Phone *" />
                                <TextInput
                                    id="guardian_phone"
                                    type="text"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                    placeholder="018XXXXXXXX"
                                    required
                                />
                                <InputError message={errors.guardian_phone} className="mt-1" />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="address" value="Present Address" />
                                <TextArea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                    placeholder="House, Road, Area, City"
                                />
                                <InputError message={errors.address} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* 2. MULTI-SUBJECT & MULTI-BATCH ASSIGNMENT */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <BookOpen className="text-emerald-600" size={20} />
                                    Subject & Batch Selection (Multi-Subject)
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Select all subjects and batches this student will attend.
                                </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 self-start sm:self-auto">
                                {data.batch_ids.length} Subject{data.batch_ids.length === 1 ? '' : 's'} Selected
                            </span>
                        </div>

                        <InputError message={errors.batch_ids} className="mt-1" />

                        {/* Subject Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map((course) => {
                                const courseBatches = batches.filter(
                                    b => String(b.course_id) === String(course.id)
                                );
                                const activeBatchForCourse = courseBatches.find(
                                    b => data.batch_ids.includes(b.id)
                                );
                                const isEnrolled = Boolean(activeBatchForCourse);

                                return (
                                    <div
                                        key={course.id}
                                        className={`p-4 rounded-xl border transition-all ${
                                            isEnrolled
                                                ? 'border-emerald-500 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/20'
                                                : 'border-slate-200/80 bg-slate-50/30 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    id={`course_check_${course.id}`}
                                                    checked={isEnrolled}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            const defaultBatch = courseBatches[0];
                                                            if (defaultBatch) {
                                                                handleCourseBatchToggle(course.id, defaultBatch.id);
                                                            }
                                                        } else {
                                                            handleCourseBatchToggle(course.id, '');
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a] border-slate-300 cursor-pointer"
                                                />
                                                <label
                                                    htmlFor={`course_check_${course.id}`}
                                                    className="font-bold text-slate-900 text-sm cursor-pointer select-none"
                                                >
                                                    {course.title}
                                                </label>
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
                                                ৳{Number(course.fee || 0).toLocaleString()}/mo
                                            </span>
                                        </div>

                                        {course.category && (
                                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mb-3">
                                                {course.category}
                                            </span>
                                        )}

                                        {isEnrolled && (
                                            <div className="mt-2 pt-2 border-t border-emerald-100/80">
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                    Assign Batch:
                                                </label>
                                                {courseBatches.length > 0 ? (
                                                    <select
                                                        value={activeBatchForCourse?.id || ''}
                                                        onChange={(e) => handleCourseBatchToggle(course.id, e.target.value)}
                                                        className="w-full text-xs font-semibold rounded-[4px] border-slate-200 bg-white text-slate-800 py-1.5 px-2.5 focus:border-[#16a34a] focus:ring-0 outline-none"
                                                    >
                                                        {courseBatches.map((b) => (
                                                            <option key={b.id} value={b.id}>
                                                                {b.name} ({b.class_time || 'Schedule'})
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p className="text-[11px] text-amber-600 font-medium">
                                                        No active batch created for this course yet.
                                                    </p>
                                                )}
                                                {activeBatchForCourse?.class_days && (
                                                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                                        <Calendar size={11} className="text-slate-400" />
                                                        {activeBatchForCourse.class_days}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Enrolled Batches Summary */}
                        {selectedBatches.length > 0 && (
                            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                                    Enrolled Subjects Summary ({selectedBatches.length})
                                </h4>
                                <div className="space-y-1.5">
                                    {selectedBatches.map((b) => {
                                        const c = courses.find(course => String(course.id) === String(b.course_id));
                                        return (
                                            <div key={b.id} className="flex items-center justify-between text-xs py-1 border-b border-emerald-100/60 last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">{c?.title || b.name}</span>
                                                    <span className="text-[11px] text-slate-500">({b.name} • {b.class_time || 'Schedule'})</span>
                                                </div>
                                                <span className="font-bold text-emerald-700">৳{Number(c?.fee || 0).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-emerald-200 text-xs font-bold text-slate-900">
                                    <span>Total Monthly Tuition Fee:</span>
                                    <span className="text-sm text-[#16a34a]">৳{totalMonthlyFee.toLocaleString()} / month</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: ADMISSION FEE & PAYMENT RECEIPT GENERATOR */}
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm h-auto self-start space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                            <Receipt className="text-emerald-600" size={22} />
                            <h3 className="text-base font-bold text-slate-900">Admission Fee & Receipt</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="admission_fee" value="Admission / Registration Fee (৳)" />
                                <TextInput
                                    id="admission_fee"
                                    type="number"
                                    value={data.admission_fee}
                                    onChange={(e) => setData('admission_fee', e.target.value)}
                                />
                                <InputError message={errors.admission_fee} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="discount" value="Waiver / Discount (৳)" />
                                <TextInput
                                    id="discount"
                                    type="number"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
                                />
                                <InputError message={errors.discount} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="paid_amount" value="Paid Amount (৳) *" />
                                <TextInput
                                    id="paid_amount"
                                    type="number"
                                    value={data.paid_amount}
                                    onChange={(e) => setData('paid_amount', e.target.value)}
                                    className="border-[#16a34a] text-[#16a34a] font-bold"
                                />
                                <InputError message={errors.paid_amount} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="payment_method" value="Payment Method *" />
                                <SelectInput
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target ? e.target.value : e)}
                                    options={paymentMethodOptions}
                                />
                                <InputError message={errors.payment_method} className="mt-1" />
                            </div>

                            {data.payment_method !== 'Cash' && (
                                <div>
                                    <InputLabel
                                        htmlFor="remarks"
                                        value={
                                            data.payment_method === 'bKash' ? 'bKash Transaction ID (TrxID) *' :
                                            data.payment_method === 'Nagad' ? 'Nagad Transaction ID (TrxID) *' :
                                            data.payment_method === 'Bank' ? 'Bank Deposit / Slip Ref *' :
                                            `${data.payment_method} Transaction ID / Ref *`
                                        }
                                    />
                                    <TextInput
                                        id="remarks"
                                        type="text"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        placeholder={
                                            data.payment_method === 'bKash' ? 'e.g. 9X8Y7Z1A (8-10 digit bKash TrxID)' :
                                            data.payment_method === 'Nagad' ? 'e.g. 7A8B9C2D (Nagad TrxID)' :
                                            data.payment_method === 'Bank' ? 'e.g. Bank Slip #10492 / Ref' :
                                            `Enter ${data.payment_method} reference code...`
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200/60 space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Monthly Tuition Fee:</span>
                                <span className="font-bold text-slate-900">৳ {totalMonthlyFee.toLocaleString()} / mo</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Net Admission Payable:</span>
                                <span className="font-bold text-slate-900">
                                    ৳ {Math.max(0, Number(data.admission_fee || 0) - Number(data.discount || 0)).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium pt-1.5 border-t border-slate-200">
                                <span>Remaining Due:</span>
                                <span className="font-bold text-rose-600">
                                    ৳ {Math.max(0, (Number(data.admission_fee || 0) - Number(data.discount || 0)) - Number(data.paid_amount || 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || data.batch_ids.length === 0}
                        className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle size={16} /> Confirm Admission & Generate Receipt
                    </button>
                    {data.batch_ids.length === 0 && (
                        <p className="text-[11px] text-amber-600 font-medium text-center">
                            Please select at least 1 subject and batch to continue.
                        </p>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}
