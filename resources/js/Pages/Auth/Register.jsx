import React, { useState } from 'react';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import Checkbox from '@/Components/Form/Checkbox';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Register() {
    const { categories, brands } = usePage().props;
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        area: '',
        post_code: '',
        password: '',
        password_confirmation: '',
        agree: false,
    });

    const validateStep = () => {
        if (step === 1) {
            return data.first_name && data.last_name && data.email && data.phone;
        }
        if (step === 2) {
            return data.address && data.city && data.area && data.post_code;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = (e) => {
        e.preventDefault();
        if (step < 3) {
            nextStep();
            return;
        }
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title="Register Account" />

            <div className="w-full bg-white min-h-[60vh]">
                {/* Breadcrumb */}
                <div className="bg-white py-4">
                    <div className="container mx-auto px-4 flex items-center gap-2 text-[13px]">
                        <Link href="/" className="text-gray-600 hover:text-[#ef4a23] px-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        </Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <Link href="#" className="text-gray-600 hover:text-[#ef4a23]">Account</Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-400">Register</span>
                    </div>
                </div>

                <div className="max-w-[600px] mx-auto px-4 pt-5 pb-10">
                    <div className="p-0">
                        <div className="mb-4">
                            <h1 className="text-[22px] font-bold text-[#081621]">Register Account</h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="pt-2">
                                        <h2 className="text-[16px] font-bold text-[#081621] mb-4">Your Personal Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="first_name" value="First Name *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="first_name"
                                                name="first_name"
                                                value={data.first_name}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                placeholder="First Name"
                                                required
                                            />
                                            <InputError message={errors.first_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="last_name" value="Last Name *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="last_name"
                                                name="last_name"
                                                value={data.last_name}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                placeholder="Last Name"
                                                required
                                            />
                                            <InputError message={errors.last_name} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="email" value="E-Mail *" className="text-[14px] font-semibold text-[#081621]" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="E-Mail"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="phone" value="Telephone *" className="text-[14px] font-semibold text-[#081621]" />
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Telephone"
                                            required
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="pt-2">
                                        <h2 className="text-[16px] font-bold text-[#081621] mb-4">Your Address</h2>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="address" value="Address *" className="text-[14px] font-semibold text-[#081621]" />
                                        <TextInput
                                            id="address"
                                            name="address"
                                            value={data.address}
                                            className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Address"
                                            required
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="city" value="City *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="city"
                                                name="city"
                                                value={data.city}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="City"
                                                required
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="post_code" value="Post Code *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="post_code"
                                                name="post_code"
                                                value={data.post_code}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('post_code', e.target.value)}
                                                placeholder="Post Code"
                                                required
                                            />
                                            <InputError message={errors.post_code} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel htmlFor="area" value="Area *" className="text-[14px] font-semibold text-[#081621]" />
                                        <TextInput
                                            id="area"
                                            name="area"
                                            value={data.area}
                                            className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                            onChange={(e) => setData('area', e.target.value)}
                                            placeholder="Area"
                                            required
                                        />
                                        <InputError message={errors.area} />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="pt-2">
                                        <h2 className="text-[16px] font-bold text-[#081621] mb-4">Your Password</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="password" value="Password *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Password"
                                                required
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="password_confirmation" value="Password Confirm *" className="text-[14px] font-semibold text-[#081621]" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full h-[45px] border-gray-200 focus:border-[#3749bb] focus:ring-0 rounded-[4px] text-[14px] placeholder-gray-300"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Password Confirm"
                                                required
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="agree"
                                            checked={data.agree}
                                            onChange={(e) => setData('agree', e.target.checked)}
                                            required
                                        />
                                        <label htmlFor="agree" className="text-[13px] text-gray-700 font-medium cursor-pointer select-none">
                                            I have read and agree to the <Link href={route('frontend.pages.show', 'privacy-policy')} className="text-emerald-600 hover:underline">Privacy Policy</Link>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-full h-[45px] border border-[#3749bb] text-[#3749bb] hover:bg-slate-50 font-bold text-[14px] rounded-[4px] transition-all uppercase"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="w-full h-[45px] bg-[#3749bb] hover:bg-[#2c3a96] text-white font-bold text-[14px] rounded-[4px] transition-colors uppercase"
                                    disabled={processing}
                                >
                                    {step === 3 ? 'Register' : 'Continue'}
                                </button>
                            </div>

                            <div className="relative py-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                                </div>
                            </div>

                            <div className="text-center text-[13px] text-gray-600 font-medium">
                                If you already have an account with us, please login at the <Link href={route('student.login')} className="text-[#ef4a23] hover:underline font-bold">login page</Link>.
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
