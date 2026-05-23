import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Building2, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const WarehouseModal = ({ isOpen, onClose, warehouse = null }) => {
    const isEdit = !!warehouse;
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        name: '',
        address: '',
        phone: '',
        is_active: true,
    });

    useEffect(() => {
        if (warehouse) {
            setData({
                name: warehouse.name || '',
                address: warehouse.address || '',
                phone: warehouse.phone || '',
                is_active: warehouse.is_active ?? true,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [warehouse, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('admin.warehouses.update', warehouse.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('admin.warehouses.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#202223]/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="bg-white w-full max-w-[500px] rounded-[12px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#ebebeb] flex items-center justify-between bg-[#fbfcfd]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e4f1ef] flex items-center justify-center text-[#008060]">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-bold text-[#202223]">
                                {isEdit ? 'Edit Warehouse' : 'Create New Warehouse'}
                            </h3>
                            <p className="text-[12px] text-[#6d7175]">Configure your storage location details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#f1f1f1] rounded-full transition-colors">
                        <X size={20} className="text-[#6d7175]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="name" value="Warehouse Name" className="text-[11px] font-bold text-[#6d7175] mb-1.5 uppercase tracking-wider" />
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bababa] z-10" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full h-[40px] pl-10 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[4px] text-[13px] shadow-sm"
                                    placeholder="e.g. Central Warehouse, New York Hub"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Phone */}
                        <div>
                            <InputLabel htmlFor="phone" value="Contact Phone" className="text-[11px] font-bold text-[#6d7175] mb-1.5 uppercase tracking-wider" />
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bababa] z-10" />
                                <TextInput
                                    id="phone"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full h-[40px] pl-10 border-[#d1d1d1] focus:border-[#008060] focus:ring-0 rounded-[4px] text-[13px] shadow-sm"
                                    placeholder="Contact number"
                                />
                            </div>
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        {/* Address */}
                        <div>
                            <InputLabel htmlFor="address" value="Location / Address" className="text-[11px] font-bold text-[#6d7175] mb-1.5 uppercase tracking-wider" />
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3 text-[#bababa] z-10" />
                                <TextArea
                                    id="address"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="w-full min-h-[100px] pl-10 pr-3 py-2 border-[#d1d1d1] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] rounded-[4px] text-[13px] outline-none shadow-sm"
                                    placeholder="Full physical address"
                                />
                            </div>
                            <InputError message={errors.address} className="mt-1" />
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between p-4 bg-[#fbfcfd] border border-[#ebebeb] rounded-[8px] gap-4">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-[#202223]">Warehouse Status</span>
                                <span className="text-[11px] text-[#6d7175] leading-tight mt-0.5">Toggle warehouse visibility and stock operations</span>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group shrink-0">
                                <div
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`w-10 h-5 rounded-full transition-all relative ${data.is_active ? 'bg-[#008060]' : 'bg-slate-200'}`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm`}
                                        style={{ left: data.is_active ? '22px' : '2px' }}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-[#f6f6f7] border-t border-[#ebebeb] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[13px] font-bold text-[#202223] hover:bg-[#ebebeb] rounded-[4px] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-[#008060] text-white text-[13px] font-bold rounded-[4px] hover:bg-[#006e52] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {processing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isEdit ? 'Update Warehouse' : 'Create Warehouse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarehouseModal;
