import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Send, Upload, X, FileText, ShoppingBag, CreditCard,
    ShieldCheck, HelpCircle, Check, ArrowRight, ArrowLeft, Info
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import RichTextEditor from '@/Components/RichTextEditor';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { cn } from '@/lib/utils';

/**
 * Component: TicketForm
 * 
 * High-Density Compact version of the 4-Stage Support Ticket Wizard.
 * Optimizes vertical/horizontal space, typography, and bento department grid cards.
 */
export default function TicketForm({
    data,
    setData,
    processing,
    errors,
    currentStep,
    setCurrentStep,
    selectDepartment,
    goToNextStep,
    goToPrevStep,
    isStepValid,
    filePreviews,
    handleFileChange,
    removeFile,
    handleSubmit
}) {
    const steps = [
        { num: 1, name: 'Department' },
        { num: 2, name: 'Info' },
        { num: 3, name: 'Details' },
        { num: 4, name: 'Confirm' }
    ];

    const departments = [
        {
            id: 'Order Issue',
            name: 'Sales & Orders',
            badge: 'Order & Shipping',
            desc: 'Help with checkout, delivery delays, tracking, or cancellation requests.',
            icon: ShoppingBag,
            color: 'text-[#008060] bg-[#008060]/5 border-[#008060]/10 hover:border-[#008060]/30'
        },
        {
            id: 'Refund',
            name: 'Billing & Refunds',
            badge: 'Financial',
            desc: 'Double charges, invoices, gateway payment issues, or refunds.',
            icon: CreditCard,
            color: 'text-blue-600 bg-blue-50/50 border-blue-100 hover:border-blue-300'
        },
        {
            id: 'Technical',
            name: 'Technical Support',
            badge: 'System Assistance',
            desc: 'Issues with account logins, website errors, cart failures, or settings.',
            icon: ShieldCheck,
            color: 'text-amber-700 bg-amber-50/50 border-amber-100 hover:border-amber-300'
        },
        {
            id: 'Other',
            name: 'General Query',
            badge: 'General',
            desc: 'Bulk purchase orders, business partnerships, feedback, or other inquiries.',
            icon: HelpCircle,
            color: 'text-slate-700 bg-slate-50/50 border-slate-200 hover:border-slate-400'
        }
    ];

    const activeDept = departments.find(d => d.id === data.category);

    const getApplicableTemplates = () => {
        switch (data.category) {
            case 'Order Issue':
                return [
                    {
                        name: 'Damaged Item Received 📦',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Product Name:</strong> </p><p><strong>Problem Description:</strong> [e.g. Broken screen on arrival]</p><p><strong>Requested Resolution:</strong> [Replacement / Refund]</p>`
                    },
                    {
                        name: 'Wrong / Missing Item 🔄',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Incorrect or Missing Item:</strong> </p><p><strong>Problem Description:</strong> [e.g. Received white color instead of black]</p>`
                    },
                    {
                        name: 'Cancel / Change Order 🚫',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Change Details:</strong> [e.g. Please change shipping address to ... / Please cancel my order before it ships]</p>`
                    },
                    {
                        name: 'Delivery Delay 🚚',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Tracking Number (if any):</strong> </p><p><strong>Details:</strong> [e.g. Tracking status is stuck / delivery is delayed by 3 days]</p>`
                    }
                ];
            case 'Refund':
                return [
                    {
                        name: 'Double Charged 💳',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Transaction ID:</strong> </p><p><strong>Payment Gateway/Method:</strong> [bKash/Nagad/Card]</p><p><strong>Details:</strong> [e.g. Payment success but order says failed]</p>`
                    },
                    {
                        name: 'Refund Request 💰',
                        content: `<p><strong>Order Number:</strong> #</p><p><strong>Reason for Refund:</strong> </p><p><strong>Details:</strong> </p>`
                    },
                    {
                        name: 'Payment Failed but Charged 💸',
                        content: `<p><strong>Transaction ID:</strong> </p><p><strong>Amount Deducted:</strong> </p><p><strong>Details:</strong> [e.g. Paid successfully but website showed checkout error]</p>`
                    },
                    {
                        name: 'Coupon Code Issue 🎟️',
                        content: `<p><strong>Coupon Code:</strong> </p><p><strong>Order/Cart Details:</strong> </p><p><strong>Details:</strong> [e.g. Valid coupon gave "expired" error during checkout]</p>`
                    }
                ];
            case 'Technical':
                return [
                    {
                        name: 'Website Glitch 💻',
                        content: `<p><strong>Device & Browser:</strong> [e.g. Windows Chrome / iPhone Safari]</p><p><strong>Page URL:</strong> </p><p><strong>Error Details:</strong> [e.g. Button is unresponsive / received server 500 error]</p>`
                    },
                    {
                        name: 'Account/Login issue 🔑',
                        content: `<p><strong>Registered Email:</strong> </p><p><strong>Problem Details:</strong> [e.g. OTP not receiving / Password reset link expired]</p>`
                    },
                    {
                        name: 'Gateway Checkout Error 🛑',
                        content: `<p><strong>Browser Used:</strong> </p><p><strong>Error Message:</strong> [e.g. Gateway loading spinner stuck infinitely]</p>`
                    }
                ];
            default:
                return [
                    {
                        name: 'Bulk Purchase Inquiry 🤝',
                        content: `<p><strong>Product wanted:</strong> </p><p><strong>Quantity needed:</strong> </p><p><strong>Company name (if any):</strong> </p>`
                    },
                    {
                        name: 'Product Stock Query 📦',
                        content: `<p><strong>Product Name / URL:</strong> </p><p><strong>Query:</strong> [e.g. When will this be back in stock?]</p>`
                    },
                    {
                        name: 'General Query / Feedback 💬',
                        content: `<p><strong>Subject:</strong> </p><p><strong>Your Inquiry:</strong> </p>`
                    }
                ];
        }
    };

    return (
        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] relative">

            {/* --- Compact Stepper Indicator Header --- */}
            <div className="bg-slate-50/60 border-b border-[#ebebeb] py-3.5 px-5 rounded-t-[4px]">
                <div className="max-w-md mx-auto flex items-center justify-between relative">
                    {/* Background connection line */}
                    <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />

                    {/* Active highlight connection line */}
                    <div
                        className="absolute top-[14px] left-0 h-[2px] bg-[#008060] -translate-y-1/2 z-0 transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {steps.map((s) => {
                        const isCompleted = currentStep > s.num;
                        const isActive = currentStep === s.num;
                        return (
                            <div key={s.num} className="relative z-10 flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => isStepValid(s.num - 1) || s.num === 1 ? setCurrentStep(s.num) : null}
                                    disabled={s.num > 1 && !isStepValid(s.num - 1) && currentStep < s.num}
                                    className={cn(
                                        "w-7 h-7 rounded-full border flex items-center justify-center font-bold text-[11px] transition-all bg-white",
                                        isCompleted
                                            ? "bg-[#008060] border-[#008060] text-white"
                                            : isActive
                                                ? "bg-white border-[#008060] text-[#008060] ring-4 ring-[#008060]/10"
                                                : "bg-white border-slate-200 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? <Check size={11} /> : s.num}
                                </button>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-wider mt-1.5",
                                    isActive ? "text-[#008060]" : isCompleted ? "text-slate-700" : "text-slate-400"
                                )}>
                                    {s.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Stepper Body Views --- */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5 flex flex-col justify-between">

                <div className="space-y-4">
                    {/* ================= STEP 1: CHOOSE DEPARTMENT ================= */}
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="bg-[#008060]/5 border border-[#008060]/10 p-3 rounded-[3px] flex gap-2.5">
                                <Info size={16} className="text-[#008060] shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[11.5px] font-bold text-[#008060] uppercase tracking-wide">Choose Support Department</h4>
                                    <p className="text-[10.5px] text-slate-600 mt-0.5 font-medium leading-relaxed">
                                        Please select a department that best fits your concern. Routing your request to the right department avoids delays.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {departments.map((dept) => {
                                    const DeptIcon = dept.icon;
                                    const isSelected = data.category === dept.id;
                                    return (
                                        <button
                                            key={dept.id}
                                            type="button"
                                            onClick={() => selectDepartment(dept.id)}
                                            className={cn(
                                                "p-3.5 rounded-[3px] border text-left transition-all active:scale-[0.98] group flex gap-3 h-full relative overflow-hidden",
                                                isSelected
                                                    ? "bg-[#008060]/5 border-[#008060] ring-1 ring-[#008060]/10"
                                                    : "bg-white border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {/* Department Specific Icon */}
                                            <div className={cn(
                                                "w-9 h-9 rounded-[3px] flex items-center justify-center shrink-0 border",
                                                dept.color.split(" ")[0], dept.color.split(" ")[1], dept.color.split(" ")[2]
                                            )}>
                                                <DeptIcon size={16} />
                                            </div>

                                            {/* Text descriptions */}
                                            <div className="space-y-0.5 pr-2">
                                                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#008060] block transition-colors">
                                                    {dept.badge}
                                                </span>
                                                <h4 className="text-[12.5px] font-bold text-[#202223] leading-tight">
                                                    {dept.name}
                                                </h4>
                                                <p className="text-[10px] text-[#6d7175] font-medium leading-snug">
                                                    {dept.desc}
                                                </p>
                                            </div>

                                            {/* Top corner active checkmark */}
                                            {isSelected && (
                                                <div className="absolute right-2 top-2 w-4 h-4 rounded-full bg-[#008060] flex items-center justify-center text-white">
                                                    <Check size={8} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.category} />
                        </div>
                    )}

                    {/* ================= STEP 2: TICKET INFORMATION ================= */}
                    {currentStep === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            {/* Selected Department Display */}
                            {activeDept && (
                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[3px] flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#202223]">
                                        <span className="text-slate-400 font-medium">Selected Department:</span>
                                        <span className="text-[#008060]">{activeDept.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-[10px] font-bold text-[#008060] hover:underline"
                                    >
                                        Change Department
                                    </button>
                                </div>
                            )}

                            {/* Subject */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="subject" value="Subject / Brief Summary *" className="text-[12px] font-bold text-[#202223]" />
                                <TextInput
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Describe your issue in a few words (e.g. Received incorrect item color)"
                                    className="w-full text-[13px] h-[34px]"
                                    required
                                />
                                <span className="text-[9.5px] text-slate-400 font-medium block">Must be at least 4 characters long.</span>
                                <InputError message={errors.subject} />
                            </div>

                            {/* Urgency */}
                            <div className="space-y-1">
                                <InputLabel htmlFor="priority" value="Urgency Level / Priority *" className="text-[12px] font-bold text-[#202223]" />
                                <SelectInput
                                    id="priority"
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value)}
                                    options={[
                                        { id: 'low', name: 'Low (General Inquiry)' },
                                        { id: 'medium', name: 'Medium (Standard Issue)' },
                                        { id: 'high', name: 'High (Important Priority)' },
                                        { id: 'urgent', name: 'Urgent (Critical Blocker)' },
                                    ]}
                                    required
                                    showSearch={false}
                                    className="text-[12px]"
                                />
                                <InputError message={errors.priority} />
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 3: TICKET DETAILS ================= */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            {/* Tips */}
                            <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded-[3px] flex gap-2">
                                <span className="text-amber-700 font-bold text-[11px] shrink-0">💡 Quick Tip:</span>
                                <p className="text-[10.5px] text-slate-600 font-medium leading-normal">
                                    To help us resolve your ticket faster, please describe your issue in detail. If applicable, mention the **Order Number**, product names, or serial numbers.
                                </p>
                            </div>

                            {/* Detailed Description */}
                            <div className="space-y-1.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <InputLabel htmlFor="message" value="Detailed Message / Explain Here *" className="text-[12px] font-bold text-[#202223]" />

                                    {/* Template Selection Dropdown */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Use Template:</span>
                                        <select
                                            onChange={(e) => {
                                                const selected = getApplicableTemplates().find(t => t.name === e.target.value);
                                                if (selected) setData('message', selected.content);
                                            }}
                                            value=""
                                            className="h-6 py-0 pl-2 pr-7 text-[10.5px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-[#008060] focus:ring-0 cursor-pointer transition-all hover:bg-slate-100"
                                        >
                                            <option value="" disabled>-- Select Template --</option>
                                            {getApplicableTemplates().map((t, idx) => (
                                                <option key={idx} value={t.name}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <RichTextEditor
                                    value={data.message}
                                    onChange={val => setData('message', val)}
                                    placeholder="Provide a step-by-step detail of what happened..."
                                />
                                <InputError message={errors.message} />
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 4: ADDITIONAL INFO / CONFIRM ================= */}
                    {currentStep === 4 && (
                        <div className="space-y-4 animate-fadeIn">
                            {/* File Attachments */}
                            <div className="space-y-1">
                                <InputLabel value="Attach Screenshots / PDFs (Optional)" className="text-[12px] font-bold text-[#202223]" />
                                <div className="relative border border-dashed border-slate-200 hover:border-[#008060] rounded-[4px] py-7 px-4 text-center cursor-pointer transition-all duration-200 group bg-slate-50/30 hover:bg-[#008060]/[0.02] w-full">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={data.attachments.length >= 3}
                                    />
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#008060]/10 group-hover:text-[#008060] transition-all duration-200 mx-auto mb-2.5">
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[12px] font-bold text-[#202223] block leading-tight">
                                        Click or Drag files here to upload
                                    </span>
                                    <span className="text-[10px] text-[#6d7175] font-medium block mt-1.5 leading-normal">
                                        Supports PDF, JPEG, PNG, GIF files up to 5MB each (Max 3 files)
                                    </span>
                                </div>

                                {/* File Previews List */}
                                {filePreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {filePreviews.map((file, index) => (
                                            <div key={index} className="border border-[#ebebeb] p-2 rounded-[3px] flex items-center justify-between gap-2 relative bg-slate-50">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    {file.url ? (
                                                        <img src={file.url} className="w-8 h-8 rounded-[1px] object-cover border border-[#ebebeb] shrink-0" alt="preview" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-[1px] border border-[#ebebeb] bg-white flex items-center justify-center text-slate-400 shrink-0">
                                                            <FileText size={14} />
                                                        </div>
                                                    )}
                                                    <div className="overflow-hidden">
                                                        <span className="text-[11px] font-bold text-[#202223] block truncate leading-tight">{file.name}</span>
                                                        <span className="text-[9.5px] text-slate-400 block mt-0.5">{file.size}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="w-4.5 h-4.5 rounded-full bg-slate-200 hover:bg-[#4f46e5] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Terms Confirmation Checkbox */}
                            <div className="pt-3 border-t border-slate-100">
                                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.agreeTerms}
                                        onChange={e => setData('agreeTerms', e.target.checked)}
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#008060] focus:ring-[#008060] mt-0.5"
                                    />
                                    <div className="text-[11px] font-medium text-slate-600 leading-normal">
                                        I verify that all support information provided is accurate, and I agree to receive notification responses concerning this inquiry.
                                    </div>
                                </label>
                                <InputError message={errors.agreeTerms} />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Form Footer Stepper Navigation --- */}
                <div className="bg-slate-50/50 border-t border-[#ebebeb] -mx-5 -mb-5 px-5 py-3.5 flex items-center justify-end gap-2.5 rounded-b-[4px]">

                    {/* Left side actions */}
                    {currentStep === 1 ? (
                        <Link
                            href={route('dashboard.tickets.index')}
                            className="h-[34px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[3px] font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-1.5 active:scale-95"
                        >
                            Cancel
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={goToPrevStep}
                            className="h-[34px] px-3.5 bg-white border border-[#d1d1d1] text-slate-600 rounded-[3px] font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-1 active:scale-95"
                        >
                            <ArrowLeft size={12} />
                            Back
                        </button>
                    )}

                    {/* Right side actions */}
                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={goToNextStep}
                            disabled={!isStepValid(currentStep)}
                            className="h-[34px] px-4 bg-[#008060] text-white rounded-[3px] font-bold text-[11px] hover:bg-[#006e52] disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm active:scale-95"
                        >
                            Continue
                            <ArrowRight size={12} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={processing || !isStepValid(4)}
                            className="h-[34px] px-5 bg-[#008060] text-white rounded-[3px] font-bold text-[11px] hover:bg-[#006e52] disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm active:scale-95"
                        >
                            {processing ? "Submitting..." : "Submit Ticket"}
                            <Send size={11} />
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}
