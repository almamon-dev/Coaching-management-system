import React from 'react';
import { Receipt, CheckCircle, AlertCircle, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import SummaryCard from '@/Components/Common/SummaryCard';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function AdmissionSummaryCard({
    data,
    setData,
    errors,
    processing,
    totalMonthlyFee,
    selectedBatches = [],
    courses = [],
    paymentMethodOptions = []
}) {
    const admissionFee = Number(data.admission_fee || 0);
    const discount = Number(data.discount || 0);
    const paidAmount = Number(data.paid_amount || 0);
    const netAdmissionPayable = Math.max(0, admissionFee - discount);
    const remainingDue = Math.max(0, netAdmissionPayable - paidAmount);

    return (
        <SummaryCard
            title="Admission Fee & Receipt"
            icon={Receipt}
            badge={
                <span className="text-[10.5px] font-bold px-2 py-0.5 bg-emerald-50 text-[#16a34a] rounded-[4px] border border-emerald-200">
                    {selectedBatches.length} Subject{selectedBatches.length !== 1 ? 's' : ''}
                </span>
            }
            className="h-auto self-start shadow-2xs"
            bodyClassName="p-4 sm:p-5 space-y-4"
        >
            {/* Quick Enrolled Subjects Preview */}
            {selectedBatches.length > 0 && (
                <div className="p-2.5 bg-slate-50/80 rounded-[4px] border border-slate-200/70">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                        <span>Selected Subjects</span>
                        <span className="text-[#16a34a] font-black">৳{totalMonthlyFee.toLocaleString()}/mo</span>
                    </div>
                    <div className="space-y-1">
                        {selectedBatches.map((b) => {
                            const c = courses.find(course => String(course.id) === String(b.course_id));
                            return (
                                <div key={b.id} className="flex items-center justify-between text-[11px] text-slate-600">
                                    <span className="truncate pr-2 font-medium">{c?.title || b.name}</span>
                                    <span className="tabular-nums font-semibold shrink-0">৳{Number(c?.fee || 0).toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Fee Collection Inputs */}
            <div className="space-y-3.5">
                <div>
                    <InputLabel htmlFor="admission_fee" value="Admission / Registration Fee (৳)" />
                    <TextInput
                        id="admission_fee"
                        type="number"
                        value={data.admission_fee}
                        onChange={(e) => setData('admission_fee', e.target.value)}
                        className="rounded-[4px] text-xs"
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
                        className="rounded-[4px] text-xs"
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
                        className="rounded-[4px] border-[#16a34a] text-[#16a34a] font-bold text-xs"
                    />
                    <InputError message={errors.paid_amount} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="payment_method" value="Payment Method *" />
                    <SelectInput
                        value={data.payment_method}
                        onChange={(e) => setData('payment_method', e.target ? e.target.value : e)}
                        options={paymentMethodOptions}
                        className="rounded-[4px]"
                        showSearch={false}
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
                            className="rounded-[4px] text-xs"
                        />
                    </div>
                )}
            </div>

            {/* Financial Calculation Breakdown Box */}
            <SummaryCard.Box variant="slate" className="rounded-[4px] space-y-1.5 mt-2">
                <SummaryCard.Row
                    label="Monthly Tuition Fee:"
                    value={`৳ ${totalMonthlyFee.toLocaleString()} / mo`}
                />
                <SummaryCard.Row
                    label="Net Admission Payable:"
                    value={`৳ ${netAdmissionPayable.toLocaleString()}`}
                />
                {discount > 0 && (
                    <SummaryCard.Row
                        label="Special Waiver / Discount:"
                        value={`-৳ ${discount.toLocaleString()}`}
                        className="text-emerald-600 font-semibold"
                    />
                )}
                <SummaryCard.Row
                    label="Paid at Admission:"
                    value={`৳ ${paidAmount.toLocaleString()}`}
                    isPaid={true}
                />
                <SummaryCard.Row
                    label="Remaining Due:"
                    value={remainingDue > 0 ? `৳ ${remainingDue.toLocaleString()}` : "৳ 0 (Fully Paid)"}
                    isDue={remainingDue > 0}
                    isPaid={remainingDue === 0}
                    className="pt-1.5 border-t border-slate-200"
                />
            </SummaryCard.Box>

            {/* Action Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={processing || selectedBatches.length === 0}
                    className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[4px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckCircle size={15} /> Confirm Admission & Generate Receipt
                </button>
                {selectedBatches.length === 0 && (
                    <p className="text-[11px] text-amber-600 font-medium text-center mt-2 flex items-center justify-center gap-1">
                        <AlertCircle size={13} /> Select at least 1 subject and batch to continue.
                    </p>
                )}
            </div>
        </SummaryCard>
    );
}

