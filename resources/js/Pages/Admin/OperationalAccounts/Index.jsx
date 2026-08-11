import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, X } from 'lucide-react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import SelectInput from '@/Components/Form/SelectInput';

export default function OperationalAccountsIndex({ expenses, incomes, summary, expenseCategories, incomeCategories }) {
    const [showExpModal, setShowExpModal] = useState(false);
    const [showIncModal, setShowIncModal] = useState(false);

    const { data: expData, setData: setExpData, post: postExp, processing: expProcessing, reset: resetExp } = useForm({
        category: expenseCategories[0] || 'Rent',
        title: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        notes: '',
        receipt_ref: '',
    });

    const { data: incData, setData: setIncData, post: postInc, processing: incProcessing, reset: resetInc } = useForm({
        category: incomeCategories[0] || 'Other Income',
        title: '',
        amount: '',
        income_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        source: '',
        notes: '',
    });

    const handleExpenseSubmit = (e) => {
        e.preventDefault();
        postExp(route('admin.operational-accounts.expenses.store'), {
            onSuccess: () => { resetExp(); setShowExpModal(false); }
        });
    };

    const handleIncomeSubmit = (e) => {
        e.preventDefault();
        postInc(route('admin.operational-accounts.incomes.store'), {
            onSuccess: () => { resetInc(); setShowIncModal(false); }
        });
    };

    const expCategoryOptions = expenseCategories.map(c => ({ id: c, name: c }));
    const incCategoryOptions = incomeCategories.map(c => ({ id: c, name: c }));

    return (
        <AdminLayout>
            <Head title="Operational Accounts (Income & Expense)" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operational Accounts</h1>
                    <p className="text-sm text-slate-500">Track coaching daily operational income, rent, electricity, marketing & maintenance expenses.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowIncModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Add Extra Income
                    </button>
                    <button
                        onClick={() => setShowExpModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-[3px] shadow-sm transition-all cursor-pointer"
                    >
                        <Plus size={15} /> Record Expense
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Income</span>
                        <div className="text-2xl font-black text-[#16a34a] mt-1">৳ {summary.total_income.toLocaleString()}</div>
                        <span className="text-xs text-slate-500 mt-1 block">Tuition & Operational Income</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Operational Expense</span>
                        <div className="text-2xl font-black text-rose-600 mt-1">৳ {summary.total_expense.toLocaleString()}</div>
                        <span className="text-xs text-slate-500 mt-1 block">Rent, Utilities, Maintenance</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                        <TrendingDown size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Cash Balance</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">৳ {summary.net_balance.toLocaleString()}</div>
                        <span className="text-xs text-slate-500 mt-1 block">Current Center Balance</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                        <Wallet size={20} />
                    </div>
                </div>
            </div>

            {/* EXPENSES & INCOMES TABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* EXPENSES TABLE */}
                <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <ArrowDownRight className="text-rose-600" size={18} /> Operational Expenses
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                <tr>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {expenses.data.length > 0 ? (
                                    expenses.data.map((e) => (
                                        <tr key={e.id} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-bold text-rose-700">{e.category}</td>
                                            <td className="p-3">
                                                <div className="font-bold text-slate-900">{e.title}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{e.expense_no} • {e.payment_method}</div>
                                            </td>
                                            <td className="p-3 text-slate-600 font-semibold">{e.expense_date}</td>
                                            <td className="p-3 text-right font-bold text-rose-600">৳ {parseFloat(e.amount).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="p-6 text-center text-slate-400">No operational expenses recorded.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* INCOMES TABLE */}
                <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <ArrowUpRight className="text-[#16a34a]" size={18} /> Extra Operational Income
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                <tr>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {incomes.data.length > 0 ? (
                                    incomes.data.map((inc) => (
                                        <tr key={inc.id} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-bold text-[#16a34a]">{inc.category}</td>
                                            <td className="p-3">
                                                <div className="font-bold text-slate-900">{inc.title}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{inc.income_no} • {inc.payment_method}</div>
                                            </td>
                                            <td className="p-3 text-slate-600 font-semibold">{inc.income_date}</td>
                                            <td className="p-3 text-right font-bold text-[#16a34a]">৳ {parseFloat(inc.amount).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="p-6 text-center text-slate-400">No extra income recorded.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EXPENSE MODAL */}
            {showExpModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl space-y-4 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Record Operational Expense</h3>
                            <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleExpenseSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="category" value="Expense Category *" />
                                <SelectInput
                                    value={expData.category}
                                    onChange={(e) => setExpData('category', e.target ? e.target.value : e)}
                                    options={expCategoryOptions}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="title" value="Expense Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={expData.title}
                                    onChange={(e) => setExpData('title', e.target.value)}
                                    placeholder="e.g. Center Rent / Electricity Bill"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <InputLabel htmlFor="amount" value="Amount (৳) *" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        value={expData.amount}
                                        onChange={(e) => setExpData('amount', e.target.value)}
                                        placeholder="5000"
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="expense_date" value="Expense Date *" />
                                    <TextInput
                                        id="expense_date"
                                        type="date"
                                        value={expData.expense_date}
                                        onChange={(e) => setExpData('expense_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowExpModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[3px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={expProcessing}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-[3px] cursor-pointer shadow-sm"
                                >
                                    Record Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
