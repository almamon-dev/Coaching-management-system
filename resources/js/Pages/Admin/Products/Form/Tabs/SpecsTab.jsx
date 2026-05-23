import React from 'react';
import { Plus, Trash2, ListChecks, Info, Settings2 } from 'lucide-react';
import TextInput from '@/Components/TextInput';

const SpecsTab = ({ data, setData, addSpecification, removeSpecification }) => {
    return (
        <div className="space-y-6 ">
            <div className="flex items-center justify-between border-b border-[#f6f6f7] pb-3">
                <div>
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Technical Specifications</h3>
                    <p className="text-[12px] text-[#6d7175]">Add detailed technical parameters to help customers understand the product better.</p>
                </div>
                <button
                    type="button"
                    onClick={addSpecification}
                    className="text-[#008060] hover:underline flex items-center gap-1 text-[12px] font-bold group"
                >
                    <Plus size={14} /> Add New Row
                </button>
            </div>

            {/* Specs Grid */}
            <div className="space-y-3 pt-2">
                {/* Table Header Labels */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-2">
                    <div className="md:col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spec Name</div>
                    <div className="md:col-span-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</div>
                    <div className="md:col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center"></div>
                </div>

                <div className="space-y-2">
                    {data.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 group">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <TextInput
                                    type="text"
                                    value={spec.key}
                                    onChange={e => { const s = [...data.specifications]; s[idx].key = e.target.value; setData('specifications', s); }}
                                    className="w-full"
                                    placeholder="Spec Name"
                                />
                                <TextInput
                                    type="text"
                                    value={spec.value}
                                    onChange={e => { const s = [...data.specifications]; s[idx].value = e.target.value; setData('specifications', s); }}
                                    className="w-full"
                                    placeholder="Spec Details"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSpecification(idx)}
                                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-[4px] transition-all flex-shrink-0"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {data.specifications.length === 0 && (
                    <div className="py-16 bg-[#fbfbfb] border border-[#ebebeb] rounded-[4px] flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                            <ListChecks size={24} className="text-slate-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">No Specifications Added</p>
                            <p className="text-[11px] text-slate-400 mt-1">Start adding technical details to this product.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="h-[36px] px-6 bg-[#081621] text-white rounded-[4px] text-[11px] font-bold hover:bg-[#081621]/90 transition-all uppercase tracking-wider shadow-sm"
                        >
                            + Add First Spec
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecsTab;
