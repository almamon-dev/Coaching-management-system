import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { GraduationCap, ArrowLeft, CheckCircle, Receipt } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import TextArea from '@/Components/Form/TextArea';
import InputError from '@/Components/Form/InputError';

export default function AdmissionCreate({ courses, batches, feeTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        dob: '',
        gender: 'male',
        phone: '',
        email: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        school_college: '',
        course_id: courses[0]?.id || '',
        batch_id: batches[0]?.id || '',
        admission_fee: 3000,
        discount: 0,
        paid_amount: 3000,
        payment_method: 'Cash',
        remarks: '',
    });

    const handleCourseChange = (courseId) => {
        setData('course_id', courseId);
        const selectedCourse = courses.find(c => c.id == courseId);
        if (selectedCourse) {
            setData('admission_fee', selectedCourse.fee || 3000);
            setData('paid_amount', selectedCourse.fee || 3000);
        }
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

    const courseOptions = courses.map(c => ({
        id: c.id,
        name: `${c.title} (৳${c.fee})`
    }));

    const batchOptions = batches.map(b => ({
        id: b.id,
        name: `${b.name} (${b.class_time})`
    }));

    const paymentMethodOptions = [
        { id: 'Cash', name: 'Cash Collection' },
        { id: 'bKash', name: 'bKash Mobile Wallet' },
        { id: 'Nagad', name: 'Nagad Mobile Wallet' },
        { id: 'Bank', name: 'Bank Deposit / Transfer' },
        { id: 'Online', name: 'Online Gateway' },
    ];

    return (
        <AdminLayout>
            <Head title="New Student Admission" />

            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Student Admission</h1>
                    <p className="text-sm text-slate-500">Complete student enrollment, assign batch & collect initial admission fee.</p>
                </div>
                <Link
                    href={route('admin.students.index')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-[3px] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Students
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* LEFT: STUDENT & GUARDIAN DETAILS */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
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
                            <InputLabel htmlFor="school_college" value="School / College Name" />
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

                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 pt-3">Guardian Contact Information</h2>
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

                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 pt-3">Subject & Batch Assignment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="course_id" value="Select Subject *" />
                            <SelectInput
                                value={data.course_id}
                                onChange={(e) => handleCourseChange(e.target ? e.target.value : e)}
                                options={courseOptions}
                            />
                            <InputError message={errors.course_id} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="batch_id" value="Assign Batch *" />
                            <SelectInput
                                value={data.batch_id}
                                onChange={(e) => setData('batch_id', e.target ? e.target.value : e)}
                                options={batchOptions}
                            />
                            <InputError message={errors.batch_id} className="mt-1" />
                        </div>
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
                                <InputLabel htmlFor="admission_fee" value="Admission Fee (৳)" />
                                <TextInput
                                    id="admission_fee"
                                    type="number"
                                    value={data.admission_fee}
                                    onChange={(e) => setData('admission_fee', e.target.value)}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="discount" value="Waiver / Discount (৳)" />
                                <TextInput
                                    id="discount"
                                    type="number"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
                                />
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
                            </div>

                            <div>
                                <InputLabel htmlFor="payment_method" value="Payment Method *" />
                                <SelectInput
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target ? e.target.value : e)}
                                    options={paymentMethodOptions}
                                />
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

                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200/60">
                            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                                <span>Net Payable:</span>
                                <span className="font-bold text-slate-900">৳ {Math.max(0, data.admission_fee - data.discount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Remaining Due:</span>
                                <span className="font-bold text-rose-600">৳ {Math.max(0, (data.admission_fee - data.discount) - data.paid_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <CheckCircle size={16} /> Confirm Admission & Generate Receipt
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
