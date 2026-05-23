import React from 'react';
import { X } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import SelectInput from '@/Components/SelectInput';

const AddressModal = ({ 
    show, 
    onClose, 
    data, 
    setData, 
    errors, 
    processing, 
    onSubmit 
}) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-2xl w-full max-w-[600px] overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <div className="p-7">
                    <h2 className="text-[16px] font-bold text-[#202223] mb-6 border-b border-[#f1f1f1] pb-4">
                        Update Address
                    </h2>

                    {/* Modal Body */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="type" value="Address Type *" className="text-[12px] font-bold text-slate-700" />
                                <SelectInput
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    options={[
                                        { id: 'Home', name: 'Home' },
                                        { id: 'Office', name: 'Office' },
                                        { id: 'Other', name: 'Other' },
                                    ]}
                                    placeholder="Select Type"
                                    required
                                />
                                <InputError message={errors.type} />
                            </div>
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="name" value="Full Name *" className="text-[12px] font-bold text-slate-700" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="address" value="Street Address *" className="text-[12px] font-bold text-slate-700" />
                            <TextInput
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="House no, street name, block, etc."
                                required
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="city" value="City *" className="text-[12px] font-bold text-slate-700" />
                                <TextInput
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Enter city"
                                    required
                                />
                                <InputError message={errors.city} />
                            </div>
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="post_code" value="Post Code" className="text-[12px] font-bold text-slate-700" />
                                <TextInput
                                    id="post_code"
                                    value={data.post_code}
                                    onChange={(e) => setData('post_code', e.target.value)}
                                    placeholder="Enter post code"
                                />
                                <InputError message={errors.post_code} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="area" value="Area / Landmark" className="text-[12px] font-bold text-slate-700" />
                            <TextInput
                                id="area"
                                value={data.area}
                                onChange={(e) => setData('area', e.target.value)}
                                placeholder="E.g. Near Star Park"
                            />
                            <InputError message={errors.area} />
                        </div>

                        <div className="flex items-center gap-2 pt-2 pb-4">
                            <Checkbox 
                                id="is_primary"
                                checked={data.is_primary}
                                onChange={(e) => setData('is_primary', e.target.checked)}
                            />
                            <label htmlFor="is_primary" className="text-[12.5px] font-bold text-[#202223] cursor-pointer selection:bg-transparent">
                                Set as my primary address
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-5 flex items-center gap-3 border-t border-[#f1f1f1] mt-2">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-[38px] border border-[#d1d1d1] text-[#202223] text-[12px] font-bold rounded-[3px] hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="flex-1 h-[38px] bg-[#008060] hover:bg-[#006e52] text-white text-[12px] font-bold rounded-[3px] transition-all shadow-sm disabled:opacity-50 active:scale-95"
                            >
                                {processing ? 'Updating...' : 'Update Address'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
