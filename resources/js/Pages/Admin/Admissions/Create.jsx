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
import AdmissionSummaryCard from './Partials/AdmissionSummaryCard';

export default function CreateAdmission({ courses = [], batches = [], feeTypes = [] }) {
    const courseList = courses && courses.length > 0 ? courses : batches;
    const batchList = batches && batches.length > 0 ? batches : [];

    // Map initial batch selection if available
    const initialBatch = batchList[0];
    const initialBatchId = initialBatch?.id || '';
    const initialCourseId = initialBatch?.course_id || courseList[0]?.id || '';

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
        paid_amount: 0,
        payment_method: 'Cash',
        remarks: '',
    });

    // Helper: find all batches selected
    const selectedBatches = batchList.filter(b => data.batch_ids.includes(b.id));

    // Calculate total monthly fee of all selected subjects
    const totalMonthlyFee = selectedBatches.reduce((sum, b) => {
        const c = b.course || courseList.find(course => String(course.id) === String(b.course_id));
        return sum + Number(c?.fee || 0);
    }, 0);

    // Toggle or change batch for a course
    const handleCourseBatchToggle = (courseId, batchId) => {
        let currentBatchIds = [...data.batch_ids];

        // Find existing batch for this course if any
        const existingBatchForCourse = batchList.find(
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

        const primaryBatch = batchList.find(b => b.id === currentBatchIds[0]);

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
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-[4px] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Students
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* LEFT & CENTER: STUDENT INFO + MULTI-SUBJECT ENROLLMENT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. PERSONAL INFORMATION */}
                    <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <GraduationCap className="text-emerald-600" size={18} /> Student & Academic Details
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
                    <div className="bg-white p-5 rounded-[4px] border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <BookOpen className="text-emerald-600" size={17} />
                                    Subject & Batch Selection (Multi-Subject)
                                </h2>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Select all subjects and batches this student will attend.
                                </p>
                            </div>
                            <span className="text-[10.5px] font-bold px-2.5 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200 self-start sm:self-auto">
                                {data.batch_ids.length} Subject{data.batch_ids.length === 1 ? '' : 's'} Selected
                            </span>
                        </div>

                        <InputError message={errors.batch_ids} className="mt-1" />

                        {/* Subject Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courseList.map((course) => {
                                const courseBatches = course.batches && course.batches.length > 0
                                    ? course.batches
                                    : batchList.filter(b => String(b.course_id) === String(course.id));
                                const activeBatchForCourse = courseBatches.find(
                                    b => data.batch_ids.includes(b.id)
                                );
                                const isEnrolled = Boolean(activeBatchForCourse);

                                return (
                                    <div
                                        key={course.id}
                                        className={`p-3 sm:p-3.5 rounded-[4px] border transition-all ${isEnrolled
                                                ? 'border-[#16a34a] bg-emerald-50/25 shadow-2xs'
                                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2.5">
                                            <div className="flex items-start gap-2 min-w-0 flex-1">
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
                                                    className="w-3.5 h-3.5 rounded-[3px] text-[#16a34a] focus:ring-0 border-slate-300 cursor-pointer mt-0.5 shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <label
                                                        htmlFor={`course_check_${course.id}`}
                                                        className="font-bold text-slate-900 text-xs cursor-pointer select-none leading-snug break-words block"
                                                    >
                                                        {course.title}
                                                    </label>
                                                    {course.category && (
                                                        <span className="text-[9.5px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-[2px] border border-slate-200/60 inline-block mt-1">
                                                            {course.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-[4px] tabular-nums shrink-0">
                                                ৳{Number(course.fee || 0).toLocaleString()}/mo
                                            </span>
                                        </div>

                                        {isEnrolled && (
                                            <div className="mt-2.5 pt-2 border-t border-emerald-100">
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                                    Assign Batch:
                                                </label>
                                                {courseBatches.length > 0 ? (
                                                    <SelectInput
                                                        value={activeBatchForCourse?.id || ''}
                                                        onChange={(e) => {
                                                            const val = e?.target ? e.target.value : e;
                                                            handleCourseBatchToggle(course.id, val);
                                                        }}
                                                        options={courseBatches.map((b) => ({
                                                            id: b.id,
                                                            name: `${b.name} (${b.class_time || 'Schedule'})`
                                                        }))}
                                                        placeholder="Select Batch..."
                                                        showSearch={false}
                                                        className="w-full text-[11px]"
                                                    />
                                                ) : (
                                                    <p className="text-[10.5px] text-amber-600 font-medium">
                                                        No active batch created for this course yet.
                                                    </p>
                                                )}
                                                {activeBatchForCourse?.class_days && (
                                                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                                        <Calendar size={11} className="text-[#16a34a]" />
                                                        <span>{activeBatchForCourse.class_days}</span>
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
                            <div className="p-3.5 bg-emerald-50/50 rounded-[4px] border border-emerald-200/80">
                                <h4 className="text-[10.5px] font-bold text-emerald-900 uppercase tracking-wider mb-2">
                                    Enrolled Subjects Summary ({selectedBatches.length})
                                </h4>
                                <div className="space-y-1">
                                    {selectedBatches.map((b) => {
                                        const c = b.course || courseList.find(course => String(course.id) === String(b.course_id));
                                        return (
                                            <div key={b.id} className="flex items-center justify-between text-[11px] py-1 border-b border-emerald-100/60 last:border-0">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="font-bold text-slate-800 break-words">{c?.title || b.name}</span>
                                                    <span className="text-[10px] text-slate-500">({b.name} • {b.class_time || 'Schedule'})</span>
                                                </div>
                                                <span className="font-bold text-emerald-700 shrink-0">৳{Number(c?.fee || 0).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-emerald-200 text-[11.5px] font-bold text-slate-900">
                                    <span>Total Monthly Tuition Fee:</span>
                                    <span className="text-xs text-[#16a34a] font-black">৳{totalMonthlyFee.toLocaleString()} / month</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: ADMISSION FEE & PAYMENT RECEIPT GENERATOR (SUMMARY CARD) */}
                <AdmissionSummaryCard
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    totalMonthlyFee={totalMonthlyFee}
                    selectedBatches={selectedBatches}
                    batches={batchList}
                    courses={courseList}
                    paymentMethodOptions={paymentMethodOptions}
                />
            </form>
        </AdminLayout>
    );
}
