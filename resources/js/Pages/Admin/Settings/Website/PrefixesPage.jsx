import React from 'react';
import SettingsLayout from '../Layouts/SettingsLayout';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/Form/TextInput';
import { 
    Hash, 
    ShoppingCart, 
    FileText, 
    CreditCard, 
    Package, 
    Users,
    Info
} from 'lucide-react';

export default function Prefixes({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        order_prefix: settings.order_prefix || 'ORD-',
        invoice_prefix: settings.invoice_prefix || 'INV-',
        transaction_prefix: settings.transaction_prefix || 'TXN-',
        product_sku_prefix: settings.product_sku_prefix || 'SKU-',
        customer_prefix: settings.customer_prefix || 'CUS-',
    });

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    const prefixInputs = [
        { id: 'order_prefix', label: 'Order ID Prefix', icon: ShoppingCart, placeholder: 'ORD-' },
        { id: 'invoice_prefix', label: 'Invoice ID Prefix', icon: FileText, placeholder: 'INV-' },
        { id: 'transaction_prefix', label: 'Transaction ID Prefix', icon: CreditCard, placeholder: 'TXN-' },
        { id: 'product_sku_prefix', label: 'Product SKU Prefix', icon: Package, placeholder: 'SKU-' },
        { id: 'customer_prefix', label: 'Customer ID Prefix', icon: Users, placeholder: 'CUS-' },
    ];

    return (
        <SettingsLayout
            title="System Prefixes"
            subtitle="Define custom prefixes for unique identifiers across the system."
            processing={processing}
            onSave={handleSubmit}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Prefix Settings */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#008060]">
                                <Hash size={18} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-slate-900">Identifier Prefixes</h2>
                                <p className="text-[12px] text-slate-500 font-medium">Customize how your system codes appear to users.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                            {prefixInputs.map((input) => (
                                <div key={input.id} className="space-y-1.5 p-3 bg-slate-50/50 rounded-[4px] border border-slate-100 transition-all hover:border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <input.icon size={14} className="text-slate-400" />
                                        <label className="text-[12px] font-bold text-slate-700">{input.label}</label>
                                    </div>
                                    <TextInput
                                        value={data[input.id]}
                                        onChange={e => setData(input.id, e.target.value.toUpperCase())}
                                        placeholder={input.placeholder}
                                        className="h-[32px] rounded-[4px] text-[12px] font-bold uppercase tracking-wider"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Example: <span className="text-[#008060]">{data[input.id]}2026001</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Information */}
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-50/30 rounded-[4px] border border-emerald-100 space-y-3">
                        <div className="flex items-center gap-2 text-[#008060]">
                            <Info size={16} />
                            <h3 className="text-[13px] font-bold">Why use prefixes?</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                Prefixes help you distinguish between different types of records at a glance and prevent identifier collisions if you integrate with external systems.
                            </p>
                            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4">
                                <li>Better organization of invoices</li>
                                <li>Professional branding on orders</li>
                                <li>Easy filtering in accounting</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-[4px] border border-slate-100">
                        <h3 className="text-[12px] font-bold text-slate-700 mb-2">Live Preview</h3>
                        <div className="bg-white p-3 rounded border border-slate-200 shadow-sm font-mono text-[11px] text-slate-600 space-y-1">
                            <div>Order: <span className="text-emerald-600 font-bold">{data.order_prefix}1001</span></div>
                            <div>Invoice: <span className="text-emerald-600 font-bold">{data.invoice_prefix}5502</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
