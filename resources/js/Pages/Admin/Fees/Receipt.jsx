import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

function numberToWords(num) {
    if (!num || isNaN(num)) return 'Zero Taka Only';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
        return n.toString();
    }
    return `${inWords(Math.floor(num))} Taka Only`;
}

export default function Receipt({ payment, settings }) {
    const handlePrint = () => {
        window.print();
    };

    const paidAmount = parseFloat(payment?.paid_amount || 0);
    const dueAmount = parseFloat(payment?.remaining_due || 0);

    return (
        <div className="min-h-screen print:min-h-0 print:h-auto bg-slate-100/60 p-4 md:p-6 font-sans text-slate-800 print:bg-white print:p-0 print:m-0">
            <Head title={`Receipt - ${payment?.receipt_no}`} />

            {/* STRICT SINGLE PAGE PRINT CSS (HIDES FLOATING BUTTONS & PREVENTS PAGE BREAK) */}
            <style>{`
                @media print {
                    @page {
                        margin: 0 !important;
                        size: portrait;
                    }
                    html, body {
                        height: auto !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        background: white !important;
                        color: black !important;
                        overflow: hidden !important;
                    }
                    .no-print, button, nav, header, footer, [style*="position: fixed"], [style*="position:fixed"] {
                        display: none !important;
                    }
                    #printable-receipt-card {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 auto !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
            `}</style>

            {/* TOP ACTION BAR */}
            <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between no-print print:hidden">
                <Link
                    href={route('admin.fees.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Fees
                </Link>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-xs transition-all cursor-pointer"
                >
                    <Printer size={14} /> Print Receipt
                </button>
            </div>

            {/* PRINTABLE RECEIPT CARD */}
            <div id="printable-receipt-card" className="max-w-2xl mx-auto bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-4">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{settings?.center_name || 'Apex Coaching Center'}</h1>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{settings?.address || 'Banani, Dhaka'} • Phone: {settings?.phone || '+880 1700-000000'}</p>
                    </div>

                    <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">
                            Official Receipt
                        </span>
                        <div className="text-xs font-mono font-bold text-[#16a34a] mt-1">#{payment?.receipt_no}</div>
                        <div className="text-[10.5px] text-slate-500">{payment?.payment_date}</div>
                    </div>
                </div>

                {/* STUDENT & ACADEMIC INFO GRID */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div className="space-y-1">
                        <div>
                            <span className="text-slate-500 text-[11px] font-medium block">Student Name</span>
                            <span className="font-bold text-slate-900 text-xs">{payment?.student?.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[11px] font-medium block">Student ID</span>
                            <span className="font-mono font-bold text-slate-700">{payment?.student?.student_id}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[11px] font-medium block">Guardian Phone</span>
                            <span className="font-medium text-slate-700">{payment?.student?.guardian_phone || payment?.student?.phone || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-1 text-right sm:text-left">
                        <div>
                            <span className="text-slate-500 text-[11px] font-medium block">Subject & Batch</span>
                            <span className="font-semibold text-slate-900">{payment?.student?.course?.title || 'Subject'} ({payment?.student?.batch?.name || 'Batch'})</span>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[11px] font-medium block">Payment Method</span>
                            <span className="font-semibold text-slate-800">{payment?.payment_method || 'Cash'} {payment?.remarks ? `(${payment.remarks})` : ''}</span>
                        </div>
                    </div>
                </div>

                {/* PAYMENT LINE ITEMS */}
                <div className="border-t border-b border-slate-200 py-2.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{payment?.invoice ? payment.invoice.title : 'Tuition Fee Collection'}</span>
                        <span className="font-mono">৳ {paidAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Amount in words:</span>
                        <span className="font-semibold text-slate-900 capitalize text-right">{numberToWords(paidAmount)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                        <span className="text-slate-800">Total Paid Amount</span>
                        <span className="text-[#16a34a] font-mono text-base">৳ {paidAmount.toLocaleString()}</span>
                    </div>

                    {dueAmount > 0 ? (
                        <div className="flex items-center justify-between text-xs text-rose-600 font-semibold pt-0.5">
                            <span>Remaining Due Balance</span>
                            <span className="font-mono font-bold">৳ {dueAmount.toLocaleString()}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-0.5">
                            <CheckCircle2 size={13} /> Full Payment Cleared
                        </div>
                    )}
                </div>

                {/* SIGNATURE LINES WITH ADEQUATE TOP SPACING */}
                <div className="grid grid-cols-2 gap-6 pt-12 mt-4 text-xs text-slate-500 border-t border-slate-100 print:pt-10">
                    <div>
                        <div className="w-40 border-b border-slate-400 mb-1.5"></div>
                        <span className="font-semibold text-slate-700 block text-[11px]">Student / Guardian Signature</span>
                    </div>

                    <div className="text-right">
                        <div className="w-40 border-b border-slate-400 mb-1.5 ml-auto"></div>
                        <span className="font-semibold text-slate-700 block text-[11px]">Authorized Signature</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
