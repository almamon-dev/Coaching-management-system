import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, Wrench, Calendar, User, Search, RefreshCw, DollarSign, 
    Clock, CheckCircle, Smartphone, Truck, ShieldAlert, Plus, Trash2, Tag, FileText 
} from 'lucide-react';

const RepairDetailsPage = ({ auth, repair, technicians, spareParts }) => {
    // --- Form for Diagnostics & Labor Service Charge ---
    const diagnosticForm = useForm({
        diagnostics_notes: repair.diagnostics_notes || "",
        service_charge: repair.service_charge || 0,
    });

    // --- Form for Adding Spare Parts ---
    const partForm = useForm({
        product_id: "",
        quantity: 1
    });

    // --- Form for Status Transition Control Board ---
    const statusForm = useForm({
        status: repair.status,
        payment_status: repair.payment_status || "unpaid",
        tracking_number: repair.tracking_number || "",
        warranty_ends_at: repair.warranty_ends_at ? repair.warranty_ends_at.substring(0, 10) : "",
    });

    // --- Form for Quick Technician Assignment ---
    const techForm = useForm({
        technician_id: repair.technician_id || "",
        counter_name: repair.counter_name || ""
    });

    // --- Form for Kiosk Walk-in Consultation Registration ---
    const registerForm = useForm({
        device_type: repair.device_type || "",
        brand: repair.brand || "",
        model_name: repair.model_name || "",
        serial_number: repair.serial_number || "",
        issue_description: repair.issue_description || "",
    });

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('admin.repairs.register', repair.id), {
            preserveScroll: true
        });
    };

    const handleCancelToken = () => {
        if (confirm('Dismiss and cancel this walk-in customer token?')) {
            router.post(route('admin.repairs.update-status', repair.id), {
                status: 'cancelled'
            }, {
                preserveScroll: true
            });
        }
    };

    const submitDiagnostics = (e) => {
        e.preventDefault();
        diagnosticForm.post(route('admin.repairs.diagnose', repair.id), {
            preserveScroll: true
        });
    };

    const submitAddPart = (e) => {
        e.preventDefault();
        if (!partForm.product_id) {
            alert('Please select a spare part first.');
            return;
        }
        partForm.post(route('admin.repairs.add-part', repair.id), {
            preserveScroll: true,
            onSuccess: () => {
                partForm.reset('product_id', 'quantity');
            }
        });
    };

    const submitRemovePart = (partId) => {
        if (confirm('Are you sure you want to remove this spare part? The item stock will be restored to your inventory.')) {
            router.delete(route('admin.repairs.remove-part', [repair.id, partId]), {
                preserveScroll: true
            });
        }
    };

    const submitStatus = (e) => {
        e.preventDefault();
        statusForm.post(route('admin.repairs.update-status', repair.id), {
            preserveScroll: true
        });
    };

    const submitTechnician = (e) => {
        e.preventDefault();
        techForm.post(route('admin.repairs.assign', repair.id), {
            preserveScroll: true
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'approved': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'diagnosing': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'awaiting_quote': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'repairing': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'testing': return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'ready': return 'bg-[#f0f9f7] text-[#008060] border-[#b3e0d5] font-bold';
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Engineer Workspace: ${repair.ticket_number}`} />

            {/* --- Back Header --- */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href={route('admin.repairs.index')}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[#008060] hover:border-[#008060] transition-colors"
                >
                    <ArrowLeft size={16} />
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Servicing Workspace: {repair.ticket_number}</h1>
                        <span className={`text-[11px] font-bold border py-0.5 px-2 rounded-full capitalize ${getStatusStyle(repair.status)}`}>
                            {repair.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Diagnose gadget faults, deduct spare parts, and verify technician reports.</p>
                </div>
            </div>

            {/* --- Split Workspace Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ================= LEFT AREA: Device Info & Diagnostics (Col 2) ================= */}
                <div className="lg:col-span-2 space-y-6">
                    {repair.status === 'pending' ? (
                        /* Walk-in Client Counter Consultation */
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                                <h2 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Smartphone size={16} className="text-[#008060]" />
                                    Walk-in Client Counter Consultation
                                </h2>
                                <div className="text-[11.5px] bg-[#f0f9f7] text-[#008060] font-bold px-2.5 py-0.5 rounded border border-[#b3e0d5]">
                                    {repair.token_number} • {repair.counter_name}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 space-y-1">
                                <p className="font-bold text-slate-800 text-[12px] uppercase tracking-wide text-slate-500 mb-1">Kiosk Checked-In Customer:</p>
                                <p>Name: <span className="font-bold text-slate-700">{repair.customer?.name}</span></p>
                                <p>Phone: <span className="font-bold text-slate-700">{repair.customer?.phone}</span></p>
                            </div>

                            <form onSubmit={submitRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Brand / Manufacturer *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Apple, Samsung, HP"
                                            value={registerForm.data.brand}
                                            onChange={e => registerForm.setData('brand', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Model Name / Number *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. iPhone 13 Pro, Zenbook"
                                            value={registerForm.data.model_name}
                                            onChange={e => registerForm.setData('model_name', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Device Type *</label>
                                        <select
                                            value={registerForm.data.device_type}
                                            onChange={e => registerForm.setData('device_type', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5 bg-white"
                                            required
                                        >
                                            <option value="">-- Select Gadget --</option>
                                            <option value="Smartphone">Smartphone</option>
                                            <option value="Laptop">Laptop</option>
                                            <option value="Desktop PC">Desktop PC</option>
                                            <option value="Tablet">Tablet</option>
                                            <option value="Smartwatch">Smartwatch</option>
                                            <option value="Console">Gaming Console</option>
                                            <option value="Other">Other Electronics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">IMEI / Serial Number (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Track specific serial"
                                            value={registerForm.data.serial_number}
                                            onChange={e => registerForm.setData('serial_number', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Fault Description / Client Complaints *</label>
                                    <textarea
                                        rows={3}
                                        placeholder="E.g. Screen glass completely shattered, touchscreen not working. Charges fine, but display is fully dark."
                                        value={registerForm.data.issue_description}
                                        onChange={e => registerForm.setData('issue_description', e.target.value)}
                                        className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelToken}
                                        className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[12px] rounded-[3px] bg-white transition-colors"
                                    >
                                        Dismiss Token (Decline Servicing)
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={registerForm.processing}
                                        className="flex-1 bg-[#008060] hover:bg-[#006e52] text-white font-bold text-[12px] py-2 px-4 rounded-[3px] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        <CheckCircle size={14} />
                                        Register Gadget & Begin Repair (Joie Repie)
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* Normal Workspace: Registered Gadget Info & Diagnostics */
                        <>
                            {/* Card 1: Device & Fault Details */}
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                                <h2 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <Smartphone size={16} className="text-[#008060]" />
                                    Device & Customer Ticket Info
                                    {repair.token_number && (
                                        <span className="text-[10px] font-bold uppercase ml-auto bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                            Token: {repair.token_number}
                                        </span>
                                    )}
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px] leading-relaxed">
                                    <div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase">Customer</p>
                                        <p className="text-slate-700 font-bold mt-0.5">{repair.customer?.name}</p>
                                        <p className="text-slate-400 text-[11px] mt-0.5">{repair.customer?.email}</p>
                                        <p className="text-slate-400 text-[11px] mt-0.5">{repair.customer?.phone || 'No phone'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase">Gadget Specs</p>
                                        <p className="text-slate-700 font-bold mt-0.5">{repair.brand} {repair.model_name}</p>
                                        <p className="text-slate-400 text-[11px] mt-0.5">{repair.device_type} {repair.serial_number && `• S/N: ${repair.serial_number}`}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase">Date Logged</p>
                                        <p className="text-slate-700 font-bold mt-0.5">
                                            {new Date(repair.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase">Pickup Method</p>
                                        <p className="text-slate-700 font-bold mt-0.5 capitalize">{repair.pickup_method.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-lg space-y-1 text-[13px]">
                                    <span className="text-slate-400 text-[11px] font-bold uppercase">Reported Fault / Problem:</span>
                                    <p className="text-slate-700 font-medium whitespace-pre-line leading-relaxed">{repair.issue_description}</p>
                                </div>

                                {repair.customer_notes && (
                                    <div className="text-[13px] text-slate-500">
                                        <span className="font-bold text-slate-700 text-[11px] uppercase block">Customer Notes / Instructions:</span>
                                        {repair.customer_notes}
                                    </div>
                                )}
                            </div>

                            {/* Card 2: Engineer Diagnostics Editor */}
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                                <h2 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <Wrench size={16} className="text-[#008060]" />
                                    Engineer Diagnostics & Labor Cost
                                </h2>

                                <form onSubmit={submitDiagnostics} className="space-y-4">
                                    <div>
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Diagnostics Findings / Troubleshooting Report *</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write a clear diagnostic summary. E.g. 'Tested battery health (67%), requires replacement. Checked motherboard for short circuits - all clear. Cleaned dust from charging port.'"
                                            value={diagnosticForm.data.diagnostics_notes}
                                            onChange={e => diagnosticForm.setData('diagnostics_notes', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-2"
                                            required
                                        />
                                        {diagnosticForm.errors.diagnostics_notes && <p className="text-red-500 text-[11px] mt-1">{diagnosticForm.errors.diagnostics_notes}</p>}
                                    </div>

                                    <div className="w-[200px]">
                                        <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5">Base Labor Service Charge (৳) *</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-[13px] font-bold">৳</span>
                                            <input
                                                type="number"
                                                value={diagnosticForm.data.service_charge}
                                                onChange={e => diagnosticForm.setData('service_charge', e.target.value)}
                                                className="pl-7 w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        {diagnosticForm.errors.service_charge && <p className="text-red-500 text-[11px] mt-1">{diagnosticForm.errors.service_charge}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={diagnosticForm.processing}
                                        className="bg-[#008060] text-white py-2 px-4 rounded-[3px] font-bold text-[12px] hover:bg-[#006e52] disabled:opacity-50 transition-colors"
                                    >
                                        {diagnosticForm.processing ? 'Saving...' : 'Save Report & Send Quote Estimate'}
                                    </button>
                                </form>
                            </div>

                            {/* Card 3: Spare Parts Utilized Cart */}
                            <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                                <h2 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <Plus size={16} className="text-[#008060]" />
                                    Spare Parts Inventory Logging
                                </h2>

                                {/* Search and add spare parts */}
                                <form onSubmit={submitAddPart} className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 border border-slate-100 rounded-lg">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Search Spare Parts Catalog</label>
                                        <select
                                            value={partForm.data.product_id}
                                            onChange={e => partForm.setData('product_id', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5 bg-white"
                                        >
                                            <option value="">-- Search by part name / SKU --</option>
                                            {spareParts.map(part => (
                                                <option key={part.id} value={part.id}>
                                                    {part.name} (SKU: {part.sku} • Stock: {part.stock} • Price: ৳{part.price})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-[100px]">
                                        <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Qty</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={partForm.data.quantity}
                                            onChange={e => partForm.setData('quantity', e.target.value)}
                                            className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5 bg-white"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={partForm.processing}
                                        className="bg-[#081621] text-white hover:bg-slate-800 font-bold text-[12px] h-[34px] px-4 rounded-[3px] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        <Plus size={14} />
                                        Add Spare Part
                                    </button>
                                </form>

                                {/* Parts Used Table */}
                                {repair.parts.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 text-[12.5px] italic">
                                        No spare parts added yet. Add items above if screen, battery, or hardware swaps were conducted.
                                    </div>
                                ) : (
                                    <div className="border border-slate-100 rounded-md overflow-hidden">
                                        <table className="w-full text-left text-[13px] border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                                    <th className="py-2.5 px-3">Spare Part Detail</th>
                                                    <th className="py-2.5 px-3 text-center">Quantity</th>
                                                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                                                    <th className="py-2.5 px-3 text-right">Total</th>
                                                    <th className="py-2.5 px-3 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                                {repair.parts.map(part => (
                                                    <tr key={part.id} className="hover:bg-slate-50/20">
                                                        <td className="py-3 px-3">
                                                            <span className="font-bold text-slate-800">{part.product?.name || 'Unknown Part'}</span>
                                                            <span className="block text-[10px] text-slate-400 mt-0.5">SKU: {part.product?.sku || 'N/A'}</span>
                                                        </td>
                                                        <td className="py-3 px-3 text-center">{part.quantity}</td>
                                                        <td className="py-3 px-3 text-right font-medium">৳ {Number(part.unit_price).toLocaleString()}</td>
                                                        <td className="py-3 px-3 text-right font-bold text-slate-900">৳ {Number(part.total_price).toLocaleString()}</td>
                                                        <td className="py-3 px-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => submitRemovePart(part.id)}
                                                                className="text-rose-500 hover:text-rose-700 w-8 h-8 rounded-full hover:bg-rose-50 inline-flex items-center justify-center transition-colors"
                                                                title="Delete Part & Restore Stock"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* ================= RIGHT AREA: Control Console & Billing (Col 1) ================= */}
                <div className="space-y-6">
                    {/* Card 4: Staff Assignee */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                        <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Staff Assignment</h2>
                        
                        <form onSubmit={submitTechnician} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Technician Assignee *</label>
                                <select
                                    value={techForm.data.technician_id}
                                    onChange={e => techForm.setData('technician_id', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5 bg-white"
                                    required
                                >
                                    <option value="">-- Choose Staff Engineer --</option>
                                    {technicians.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Queue Serving Counter (Optional)</label>
                                <select
                                    value={techForm.data.counter_name}
                                    onChange={e => techForm.setData('counter_name', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5 bg-white"
                                >
                                    <option value="">-- Auto-Assign Round-Robin --</option>
                                    <option value="Counter 1">Counter 1</option>
                                    <option value="Counter 2">Counter 2</option>
                                    <option value="Counter 3">Counter 3</option>
                                    <option value="Counter 4">Counter 4</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={techForm.processing}
                                className="w-full bg-[#081621] hover:bg-slate-800 text-white font-bold text-[12px] py-1.5 rounded-[3px] transition-colors disabled:opacity-50"
                            >
                                Assign & Set Counter
                            </button>
                        </form>
                    </div>

                    {/* Card 5: Pipeline & Status Transitions Console */}
                    <div className="bg-white rounded-[4px] border border-[#ebebeb] p-5 shadow-sm space-y-4">
                        <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Pipeline Status Control</h2>

                        <form onSubmit={submitStatus} className="space-y-4 text-[13px]">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Servicing Progress Status</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={e => statusForm.setData('status', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                >
                                    <option value="pending">Pending Approval</option>
                                    <option value="approved">Device Received</option>
                                    <option value="diagnosing">In Diagnostics</option>
                                    <option value="awaiting_quote">Awaiting Quote</option>
                                    <option value="repairing">Repairing</option>
                                    <option value="testing">Testing QC</option>
                                    <option value="ready">Ready for Collection</option>
                                    <option value="completed">Completed & Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Payment Invoice Status</label>
                                <select
                                    value={statusForm.data.payment_status}
                                    onChange={e => statusForm.setData('payment_status', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Fully Paid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Courier Tracking ID (If shipped)</label>
                                <input
                                    type="text"
                                    placeholder="Enter courier shipping track number"
                                    value={statusForm.data.tracking_number}
                                    onChange={e => statusForm.setData('tracking_number', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Repaired Parts Warranty Expiration</label>
                                <input
                                    type="date"
                                    value={statusForm.data.warranty_ends_at}
                                    onChange={e => statusForm.setData('warranty_ends_at', e.target.value)}
                                    className="w-full text-[13px] border-slate-200 rounded-[3px] focus:border-[#008060] focus:ring-[#008060] py-1.5"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="w-full bg-[#008060] text-white py-2 px-4 rounded-[3px] font-bold text-[12.5px] hover:bg-[#006e52] disabled:opacity-50 transition-colors"
                            >
                                Update Console Status
                            </button>
                        </form>
                    </div>

                    {/* Card 6: Aggregate Billing & Invoice widget */}
                    <div className="bg-[#081621] rounded-[4px] border border-slate-800 p-5 text-white space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-[12.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#008060]">
                                <FileText size={16} />
                                Service Billing
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                repair.is_paid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                                {repair.payment_status}
                            </span>
                        </div>

                        <div className="space-y-2 text-[12.5px]">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Base Labor Fee:</span>
                                <span className="font-bold text-slate-100">৳ {Number(repair.service_charge).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Spare Parts Cost:</span>
                                <span className="font-bold text-slate-100">৳ {Number(repair.parts_cost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[14.5px] border-t border-slate-800/80 pt-3">
                                <span className="font-bold text-slate-300">Total Invoice Sum:</span>
                                <span className="font-extrabold text-[#008060] text-[16px]">৳ {Number(repair.total_cost).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RepairDetailsPage;
