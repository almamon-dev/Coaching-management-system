import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import DataTable from '@/Components/Table/DataTable';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import InputError from '@/Components/Form/InputError';

export default function FeeIndex({ invoices, feeTypes, students, filters }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showCollectModal, setShowCollectModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [search, setSearch] = useState('');

    const { data: invData, setData: setInvData, post: postInv, processing: invProcessing, reset: resetInv, errors: invErrors } = useForm({
        student_id: students[0]?.id || '',
        fee_type_id: feeTypes[0]?.id || '',
        title: 'Monthly Tuition Fee',
        amount: 2500,
        discount: 0,
        due_date: new Date().toISOString().split('T')[0],
    });

    const { data: payData, setData: setPayData, post: postPay, processing: payProcessing, reset: resetPay } = useForm({
        invoice_id: '',
        paid_amount: 0,
        payment_method: 'bKash',
        remarks: '',
    });

    const openCollectModal = (invoice) => {
        setSelectedInvoice(invoice);
        setPayData({
            invoice_id: invoice.id,
            paid_amount: invoice.due_amount,
            payment_method: 'bKash',
            remarks: '',
        });
        setShowCollectModal(true);
    };

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        postInv(route('admin.fees.invoices.store'), {
            onSuccess: () => { resetInv(); setShowInvoiceModal(false); }
        });
    };

    const handleCollectPayment = (e) => {
        e.preventDefault();
        postPay(route('admin.fees.collect'), {
            onSuccess: () => { resetPay(); setShowCollectModal(false); }
        });
    };

    const studentOptions = students.map(st => ({
        id: st.id,
        name: `${st.name} (${st.student_id})`
    }));

    const methodOptions = [
        { id: 'Cash', name: 'Cash Collection' },
        { id: 'bKash', name: 'bKash Mobile Wallet' },
        { id: 'Nagad', name: 'Nagad Mobile Wallet' },
        { id: 'Bank', name: 'Bank Deposit / Transfer' },
    ];

    const columns = [
        {
            header: "Invoice No",
            accessor: "invoice_no",
            className: "w-[120px]",
            cell: (row) => <span className="font-bold text-[#16a34a] text-xs">{row.invoice_no}</span>
        },
        {
            header: "Student",
            accessor: "student",
            cell: (row) => (
                <div>
                    <div className="font-bold text-slate-900 text-xs">{row.student?.name}</div>
                    <div className="text-[11px] text-slate-500">{row.student?.student_id}</div>
                </div>
            )
        },
        {
            header: "Fee Title",
            accessor: "title",
            cell: (row) => <span className="font-semibold text-slate-700 text-xs">{row.title}</span>
        },
        {
            header: "Total Amount",
            accessor: "net_amount",
            cell: (row) => <span className="font-bold text-slate-900 text-xs">৳ {parseFloat(row.net_amount).toLocaleString()}</span>
        },
        {
            header: "Paid",
            accessor: "paid_amount",
            cell: (row) => <span className="font-bold text-[#16a34a] text-xs">৳ {parseFloat(row.paid_amount).toLocaleString()}</span>
        },
        {
            header: "Remaining Due",
            accessor: "due_amount",
            cell: (row) => <span className="font-bold text-rose-600 text-xs">৳ {parseFloat(row.due_amount).toLocaleString()}</span>
        },
        {
            header: "Status",
            accessor: "status",
            className: "w-[110px]",
            cell: (row) => (
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                    row.status === 'paid' ? 'bg-emerald-50 text-[#16a34a] border border-emerald-200' :
                    row.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-[160px]",
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    {row.due_amount > 0 && (
                        <button
                            onClick={() => openCollectModal(row)}
                            className="px-2.5 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-[3px] shadow-xs cursor-pointer"
                        >
                            Collect
                        </button>
                    )}
                    {row.payments?.length > 0 && (
                        <Link
                            href={route('admin.fees.receipt', row.payments[0].id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[3px]"
                        >
                            Receipt
                        </Link>
                    )}
                </div>
            )
        }
    ];

    const filteredInvoices = invoices.data.filter(inv => {
        const studentName = inv.student?.name || '';
        const studentId = inv.student?.student_id || '';
        const invNo = inv.invoice_no || '';
        const query = search.toLowerCase();
        return studentName.toLowerCase().includes(query) || studentId.toLowerCase().includes(query) || invNo.toLowerCase().includes(query);
    });

    return (
        <AdminLayout>
            <Head title="Fee Collection & Due Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Collection & Due Management</h1>
                    <p className="text-sm text-slate-500">Collect tuition, admission & exam fees, apply discounts and track student dues.</p>
                </div>
                <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                >
                    <Plus size={16} /> Create Fee Invoice
                </button>
            </div>

            {/* MODULAR DATATABLE */}
            <DataTable
                columns={columns}
                data={filteredInvoices}
                pagination={invoices}
                selectable={true}
                itemNoun="invoices"
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search student name, student ID, invoice no..."
            />

            {/* CREATE INVOICE MODAL */}
            {showInvoiceModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Create Fee Invoice</h3>
                            <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateInvoice} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="student_id" value="Select Student *" />
                                <SelectInput
                                    value={invData.student_id}
                                    onChange={(e) => setInvData('student_id', e.target ? e.target.value : e)}
                                    options={studentOptions}
                                />
                                <InputError message={invErrors.student_id} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="title" value="Invoice Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={invData.title}
                                    onChange={(e) => setInvData('title', e.target.value)}
                                    placeholder="Monthly Tuition Fee"
                                    required
                                />
                                <InputError message={invErrors.title} className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="amount" value="Amount (৳) *" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        value={invData.amount}
                                        onChange={(e) => setInvData('amount', e.target.value)}
                                        placeholder="2500"
                                        required
                                    />
                                    <InputError message={invErrors.amount} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="discount" value="Discount (৳)" />
                                    <TextInput
                                        id="discount"
                                        type="number"
                                        value={invData.discount}
                                        onChange={(e) => setInvData('discount', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={invProcessing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* COLLECT PAYMENT MODAL */}
            {showCollectModal && selectedInvoice && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Collect Payment</h3>
                            <button onClick={() => setShowCollectModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCollectPayment} className="space-y-4">
                            <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg text-xs space-y-1.5">
                                <div className="flex justify-between text-slate-700"><span>Student:</span><b className="text-slate-900">{selectedInvoice.student?.name}</b></div>
                                <div className="flex justify-between text-slate-700"><span>Invoice No:</span><b className="text-[#16a34a]">{selectedInvoice.invoice_no}</b></div>
                                <div className="flex justify-between text-slate-700 border-t border-emerald-100/60 pt-1"><span>Total Remaining Due:</span><b className="text-rose-600 text-sm">৳ {selectedInvoice.due_amount}</b></div>
                            </div>
                            <div>
                                <InputLabel htmlFor="paid_amount" value="Payment Amount (৳) *" />
                                <TextInput
                                    id="paid_amount"
                                    type="number"
                                    value={payData.paid_amount}
                                    onChange={(e) => setPayData('paid_amount', e.target.value)}
                                    max={selectedInvoice.due_amount}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="payment_method" value="Payment Method *" />
                                <SelectInput
                                    value={payData.payment_method}
                                    onChange={(e) => setPayData('payment_method', e.target ? e.target.value : e)}
                                    options={methodOptions}
                                />
                            </div>
                            {payData.payment_method !== 'Cash' && (
                                <div>
                                    <InputLabel
                                        htmlFor="remarks"
                                        value={
                                            payData.payment_method === 'bKash' ? 'bKash Transaction ID (TrxID) *' :
                                            payData.payment_method === 'Nagad' ? 'Nagad Transaction ID (TrxID) *' :
                                            payData.payment_method === 'Bank' ? 'Bank Deposit / Slip Ref *' :
                                            `${payData.payment_method} Transaction ID / Ref *`
                                        }
                                    />
                                    <TextInput
                                        id="remarks"
                                        type="text"
                                        value={payData.remarks}
                                        onChange={(e) => setPayData('remarks', e.target.value)}
                                        placeholder={
                                            payData.payment_method === 'bKash' ? 'e.g. 9X8Y7Z1A (bKash TrxID)' :
                                            payData.payment_method === 'Nagad' ? 'e.g. 7A8B9C2D (Nagad TrxID)' :
                                            payData.payment_method === 'Bank' ? 'e.g. Bank Slip #10492 / Ref' :
                                            `Enter ${payData.payment_method} reference code...`
                                        }
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCollectModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={payProcessing}
                                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm"
                                >
                                    Submit & Print Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
