import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, CreditCard, User, AlertCircle, Calendar, Receipt, ChevronRight } from 'lucide-react';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';
import PrimaryButton from '@/Components/Button/PrimaryButton';

export default function Index({ auth, invoices, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.fee-collections.index'), { search }, { preserveState: true });
        setSelectedInvoice(null);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        fee_invoice_id: '',
        amount_paid: '',
        fine_paid: '0',
        payment_method: 'Cash',
        transaction_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        const pending = parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount) - parseFloat(invoice.discount_amount);
        setData({
            fee_invoice_id: invoice.id,
            amount_paid: pending > 0 ? pending.toFixed(2) : '0',
            fine_paid: '0',
            payment_method: 'Cash',
            transaction_id: '',
            payment_date: new Date().toISOString().split('T')[0],
            note: ''
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('admin.fee-collections.store'), {
            onSuccess: () => {
                reset();
                setSelectedInvoice(null);
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-[18px] font-bold text-[#202223] tracking-tight">Fee Collection POS</h2>
                    <p className="text-[12px] text-[#6d7175] font-medium mt-0.5">Collect payments and manage student accounts.</p>
                </div>
            }
        >
            <Head title="Fee Collection" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
                {/* Left Side: Search & Invoices List */}
                <div className="lg:col-span-7 flex flex-col h-full bg-white rounded-[4px] shadow-sm border border-[#ebebeb] overflow-hidden">
                    {/* Search Header */}
                    <div className="p-4 border-b border-[#ebebeb] bg-white">
                        <form onSubmit={handleSearch}>
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 text-[#6d7175]" size={15} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by Student ID, Name or Invoice No..."
                                    className="h-[36px] pl-9 pr-[70px] w-full text-[13px] border-[#d1d1d1] focus:border-[#008060] focus:ring-[#008060] rounded-[3px] placeholder:text-[#6d7175] shadow-sm"
                                />
                                <button type="submit" className="absolute right-1.5 h-[26px] px-3 bg-[#202223] text-white text-[11px] font-bold rounded-[2px] hover:bg-[#111213] transition-colors">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Results Header */}
                    <div className="px-4 py-2 border-b border-[#ebebeb] bg-[#f4f6f8] flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#6d7175] uppercase tracking-wider">
                            {search ? `Search Results` : 'Recent Pending Invoices'}
                        </span>
                        <span className="text-[11px] font-bold text-[#6d7175]">{invoices.length} Found</span>
                    </div>

                    {/* Invoice List */}
                    <div className="overflow-y-auto flex-1 p-3 bg-[#fdfdfd] custom-scrollbar">
                        {invoices.length > 0 ? (
                            invoices.map(invoice => {
                                const pending = parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount) - (parseFloat(invoice.discount_amount) || 0);
                                const isSelected = selectedInvoice?.id === invoice.id;
                                
                                return (
                                    <div 
                                        key={invoice.id}
                                        onClick={() => selectInvoice(invoice)}
                                        className={`p-3 mb-2 rounded-[4px] border cursor-pointer transition-all flex items-center justify-between group
                                            ${isSelected 
                                                ? 'bg-[#f0fdf4] border-[#008060] shadow-sm ring-1 ring-[#008060]' 
                                                : 'bg-white border-[#ebebeb] hover:border-[#008060] hover:shadow-sm'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#008060] text-white' : 'bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e6f4ef] group-hover:text-[#008060]'}`}>
                                                <Receipt size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[13px] font-bold text-[#202223]">{invoice.invoice_number}</span>
                                                    <span className={`px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider ${invoice.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[#202223] font-medium mb-0.5">
                                                    {invoice.student?.name} <span className="text-[#6d7175] font-normal">#{invoice.student?.student_profile?.student_id}</span>
                                                </div>
                                                <div className="text-[11px] text-[#6d7175] flex items-center gap-1.5">
                                                    {invoice.title} <span className="w-1 h-1 rounded-full bg-[#d1d1d1]" /> Due: {invoice.due_date}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-[#6d7175] font-bold uppercase tracking-wider mb-0.5">Pending</div>
                                            <div className={`text-[15px] font-black ${isSelected ? 'text-[#008060]' : 'text-[#202223]'}`}>৳ {pending.toFixed(2)}</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 rounded-full bg-[#f1f1f1] flex items-center justify-center mx-auto mb-3">
                                    <Search className="text-[#6d7175]" size={20} />
                                </div>
                                <h4 className="text-[14px] font-bold text-[#202223]">No Invoices Found</h4>
                                <p className="text-[12px] text-[#6d7175] mt-1">Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-[4px] shadow-sm border border-[#ebebeb] overflow-hidden">
                    <div className="p-4 border-b border-[#ebebeb] bg-white flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-[#202223] flex items-center gap-2">
                            <CreditCard size={16} className="text-[#008060]" /> Process Payment
                        </h3>
                    </div>
                    
                    <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                        {selectedInvoice ? (
                            <form onSubmit={submitPayment} className="flex flex-col h-full">
                                <div className="flex-1 space-y-4">
                                    {/* Invoice Summary */}
                                    <div className="bg-[#f9fafb] border border-[#ebebeb] rounded-[4px] p-3 shadow-sm">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[11px] text-[#6d7175] font-medium">Invoice No.</span>
                                            <span className="text-[12px] font-bold text-[#202223]">{selectedInvoice.invoice_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[11px] text-[#6d7175] font-medium">Student Name</span>
                                            <span className="text-[12px] font-bold text-[#008060]">{selectedInvoice.student?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1.5 border-t border-[#ebebeb]">
                                            <span className="text-[11px] text-[#6d7175] font-bold">Total Pending</span>
                                            <span className="text-[13px] font-black text-[#e32c2b]">৳ {(parseFloat(selectedInvoice.total_amount) - parseFloat(selectedInvoice.paid_amount) - (parseFloat(selectedInvoice.discount_amount) || 0)).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Amount to Pay <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    value={data.amount_paid}
                                                    onChange={e => setData('amount_paid', e.target.value)}
                                                    className="w-full h-[32px] font-bold text-[13px] pr-6 shadow-none"
                                                />
                                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#6d7175]">৳</span>
                                            </div>
                                            {errors.amount_paid && <p className="text-[11px] text-red-500 mt-1">{errors.amount_paid}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Late Fine <span className="text-[#6d7175] font-normal">(Optional)</span></label>
                                            <div className="relative">
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.fine_paid}
                                                    onChange={e => setData('fine_paid', e.target.value)}
                                                    className="w-full h-[32px] text-[13px] pr-6 shadow-none"
                                                />
                                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#6d7175]">৳</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Payment Method <span className="text-red-500">*</span></label>
                                        <SelectInput
                                            value={data.payment_method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                            options={[
                                                { id: 'Cash', name: 'Cash' },
                                                { id: 'Bank Transfer', name: 'Bank Transfer' },
                                                { id: 'Mobile Banking (bKash/Nagad)', name: 'Mobile Banking (bKash/Nagad)' },
                                                { id: 'Card', name: 'Credit/Debit Card' },
                                            ]}
                                            className="w-full h-[32px] text-[12px] shadow-none"
                                            showSearch={false}
                                        />
                                    </div>

                                    {data.payment_method !== 'Cash' && (
                                        <div>
                                            <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Transaction ID / Ref</label>
                                            <TextInput
                                                value={data.transaction_id}
                                                onChange={e => setData('transaction_id', e.target.value)}
                                                className="w-full h-[32px] text-[12px] shadow-none"
                                                placeholder="e.g. TRX8932409"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Payment Date <span className="text-red-500">*</span></label>
                                            <TextInput
                                                type="date"
                                                value={data.payment_date}
                                                onChange={e => setData('payment_date', e.target.value)}
                                                className="w-full h-[32px] text-[12px] shadow-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-[#202223] mb-1.5">Remarks <span className="text-[#6d7175] font-normal">(Optional)</span></label>
                                        <TextInput
                                            value={data.note}
                                            onChange={e => setData('note', e.target.value)}
                                            className="w-full h-[32px] text-[12px] shadow-none"
                                            placeholder="Any additional notes..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-[36px] bg-[#008060] hover:bg-[#006e52] text-white font-bold text-[13px] rounded-[3px] transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Complete Payment'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[#6d7175] py-12">
                                <div className="w-16 h-16 rounded-full bg-[#f4f6f8] flex items-center justify-center mb-3">
                                    <CreditCard size={28} className="text-[#a6aab0]" />
                                </div>
                                <h4 className="text-[14px] font-bold text-[#202223] mb-1">No Invoice Selected</h4>
                                <p className="text-[12px] font-medium text-center max-w-[220px]">
                                    Select an invoice from the list to process a payment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
