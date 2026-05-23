import React, { useState, useEffect } from 'react';
import { X, Upload, Download, FileText, CheckCircle2, ChevronRight, AlertCircle, Loader2, Info } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

const ImportModal = ({ show, onClose }) => {
    const [step, setStep] = useState(1); // 1: Instructions, 2: Upload, 3: Mapping
    const [fileHeaders, setFileHeaders] = useState([]);
    const [isParsing, setIsParsing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        zip: null,
        mapping: {}
    });

    const targetFields = [
        // 1. General
        { key: 'name', label: 'Product Name', required: true },
        { key: 'slug', label: 'Custom Slug', required: false },
        { key: 'sku', label: 'SKU', required: true },
        { key: 'status', label: 'Status (1:InStock, 2:Out, 3:Pre, 4:Up)', required: false },
        { key: 'stock', label: 'Total Stock Level', required: false },
        { key: 'warehouse_stocks', label: 'Warehouse Stocks (ID:Qty:LowStock)', required: false },
        { key: 'warranty', label: 'Warranty Info', required: false },
        { key: 'is_featured', label: 'Is Featured (0/1)', required: false },

        // 2. Brand & Category (Classification)
        { key: 'brand_id', label: 'Brand ID', required: false },
        { key: 'category_id', label: 'Category ID', required: true },
        { key: 'sub_category_id', label: 'Sub-Category ID', required: false },
        { key: 'sub_sub_category_id', label: 'Sub-Sub-Category ID', required: false },

        // 3. Pricing
        { key: 'price', label: 'Main Price', required: true },
        { key: 'discount_price', label: 'Discount Price', required: false },
        { key: 'has_emi', label: 'Has EMI (0/1)', required: false },
        { key: 'emi_monthly', label: 'EMI Monthly Amt', required: false },
        { key: 'emi_duration', label: 'EMI Duration (mo)', required: false },

        // 4. Description (Content)
        { key: 'description', label: 'Main Description', required: false },
        { key: 'features', label: 'Key Features (comma separated)', required: false },

        // 5. Images / Media
        { key: 'primary_image', label: 'Primary Image URL/Path', required: false },
        { key: 'gallery_images', label: 'Gallery Image URLs (comma separated)', required: false },

        // 6. Attributes
        { key: 'attributes', label: 'Attributes (Name:Value)', required: false },

        // 7. Specifications
        { key: 'tech_specs', label: 'Tech Specs (Key:Value)', required: false },

        // 8. SEO & Tags
        { key: 'meta_title', label: 'SEO: Meta Title', required: false },
        { key: 'meta_description', label: 'SEO: Meta Description', required: false },
        { key: 'tags', label: 'Tags (comma separated)', required: false },
    ];

    const [dragActive, setDragActive] = useState(false);
    const [zipDragActive, setZipDragActive] = useState(false);

    useEffect(() => {
        if (!show) {
            setStep(1);
            setFileHeaders([]);
            reset();
        }
    }, [show]);

    const handleFileSelection = (file, type) => {
        setData(type, file);
        if (type === 'file') parseFileHeaders(file);
    };

    const parseFileHeaders = async (file) => {
        setIsParsing(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(route('admin.products.parse-import'), formData);
            setFileHeaders(response.data.headers);
            const initialMapping = {};
            targetFields.forEach(field => {
                const match = response.data.headers.find(h =>
                    h.toLowerCase().replace(/[^a-z0-9]/g, '') === field.key.toLowerCase().replace(/[^a-z0-9]/g, '')
                );
                if (match) initialMapping[field.key] = match;
            });
            setData('mapping', initialMapping);
        } catch (error) { console.error(error); } finally { setIsParsing(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.import'), { onSuccess: () => { reset(); onClose(); } });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className={`bg-white rounded-[4px] shadow-2xl w-full max-w-[600px] overflow-hidden relative animate-in zoom-in-95 duration-200 border transition-colors duration-300 ${data.file ? 'border-green-600' : 'border-slate-200'}`}>
                {/* Header */}
                <div className={`px-6 py-4 transition-all duration-300 flex items-center justify-between ${data.file ? 'bg-green-600' : 'bg-slate-50/50 border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        {data.file && (
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="text-white" size={12} strokeWidth={3} />
                            </div>
                        )}
                        <h3 className={`text-[15px] font-bold truncate ${data.file ? 'text-white' : 'text-[#081621]'}`}>
                            {data.file ? `Target File: ${data.file.name}` : 'Product Bulk Import Wizard'}
                        </h3>
                    </div>
                    <button onClick={onClose} className={`transition-colors shrink-0 ${data.file ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Stepper */}
                    <div className="flex items-center gap-3 mb-6">
                        {[
                            { id: 1, label: 'Guide' },
                            { id: 2, label: 'Upload' },
                            { id: 3, label: 'Mapping' }
                        ].map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight ${step === s.id ? 'text-[#008060]' : step > s.id ? 'text-green-600' : 'text-slate-400'}`}>
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${step === s.id ? 'border-[#008060]' : step > s.id ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300'}`}>
                                        {step > s.id ? <CheckCircle2 size={10} strokeWidth={3} /> : s.id}
                                    </span>
                                    {s.label}
                                </div>
                                {idx < 2 && <div className={`h-px flex-1 transition-colors ${step > s.id ? 'bg-green-600' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                                        <Info className="text-blue-500 shrink-0" size={18} />
                                        <div className="space-y-2">
                                            <h4 className="text-[13px] font-bold text-blue-900 leading-tight">Follow these steps for a successful import:</h4>
                                            <ul className="text-[12px] text-blue-800 space-y-1.5 opacity-90">
                                                <li>• Prepare your CSV or Excel file with clear headers.</li>
                                                <li>• If you have images, name them exactly as the product SKU.</li>
                                                <li>• Put all images into a single ZIP file (no subfolders).</li>
                                                <li>• You will be able to map your columns in the final step.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 border border-slate-200 rounded-[4px] bg-[#f8f9fa]">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended</span>
                                            <p className="text-[12px] text-[#081621] font-medium mt-1">Use our template for auto-mapping.</p>
                                            <a href={route('admin.products.download-template')} className="inline-flex items-center gap-1.5 text-[11px] text-[#008060] font-bold mt-2 hover:underline">
                                                <Download size={12} /> Get Template
                                            </a>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-[4px] bg-[#f8f9fa] flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Required IDs</span>
                                                <p className="text-[12px] text-[#081621] font-medium mt-1 text-pretty">Download the guide to find Category & Brand IDs.</p>
                                            </div>
                                            <a href={route('admin.products.download-reference')} className="inline-flex items-center gap-1.5 text-[11px] text-[#008060] font-bold mt-2 hover:underline">
                                                <Download size={12} /> ID Reference Sheet
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="h-[36px] px-8 bg-[#008060] text-white font-bold rounded-[4px] text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2"
                                    >
                                        I'm Ready, Let's Start <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`border border-dashed rounded-sm p-5 flex flex-col items-center justify-center transition-all min-h-[140px] relative ${dragActive ? 'bg-slate-50 border-[#008060]' : 'bg-[#f8f9fa] border-slate-200 hover:border-slate-300'}`}
                                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0], 'file'); }}
                                    >
                                        <input type="file" id="file-upload" className="hidden" accept=".csv,.xlsx,.xls" onChange={(e) => handleFileSelection(e.target.files[0], 'file')} />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-center">
                                            {data.file ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="text-green-500" size={24} strokeWidth={3} />
                                                    <span className="text-[12px] font-bold text-[#081621] truncate max-w-[120px]">{data.file.name}</span>
                                                    {isParsing && <Loader2 size={12} className="animate-spin text-blue-500 mt-1" />}
                                                </div>
                                            ) : (
                                                <>
                                                    <FileText className="text-slate-300 mb-2" size={24} />
                                                    <span className="text-[13px] font-bold text-[#081621]">CSV / Excel</span>
                                                    <span className="text-[11px] text-slate-500 mt-0.5">Click or Drag File</span>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <div
                                        className={`border border-dashed rounded-sm p-5 flex flex-col items-center justify-center transition-all min-h-[140px] relative ${zipDragActive ? 'bg-slate-50 border-[#008060]' : 'bg-[#f8f9fa] border-slate-200 hover:border-slate-300'}`}
                                        onDragOver={(e) => { e.preventDefault(); setZipDragActive(true); }}
                                        onDragLeave={() => setZipDragActive(false)}
                                        onDrop={(e) => { e.preventDefault(); setZipDragActive(false); if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0], 'zip'); }}
                                    >
                                        <input type="file" id="zip-upload" className="hidden" accept=".zip" onChange={(e) => handleFileSelection(e.target.files[0], 'zip')} />
                                        <label htmlFor="zip-upload" className="cursor-pointer flex flex-col items-center text-center">
                                            {data.zip ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="text-blue-500" size={24} strokeWidth={3} />
                                                    <span className="text-[12px] font-bold text-[#081621] truncate max-w-[120px]">{data.zip.name}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="text-slate-300 mb-2" size={24} />
                                                    <span className="text-[13px] font-bold text-[#081621]">Images (ZIP)</span>
                                                    <span className="text-[11px] text-slate-500 mt-0.5">Optional</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setStep(1)} className="text-[12px] text-slate-500 font-bold hover:text-slate-800 transition-colors">Back to Guide</button>
                                    <button
                                        type="button"
                                        disabled={!data.file || isParsing}
                                        onClick={() => setStep(3)}
                                        className="h-[36px] px-8 bg-[#008060] text-white font-bold rounded-[4px] text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Next Step <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 flex items-center gap-3">
                                    <Info className="text-slate-400" size={16} />
                                    <span className="text-[12px] text-[#081621] font-medium italic">Map your file columns to the product database fields below:</span>
                                </div>

                                <div className="max-h-[260px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-x-8 gap-y-4">
                                    {targetFields.map((field) => (
                                        <div key={field.key} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#666] uppercase tracking-tight flex items-center gap-1.5">
                                                {field.label} {field.required && <span className="text-[#008060]">*</span>}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className={`h-[36px] w-full px-3 bg-white border text-[12px] rounded-[4px] focus:ring-1 focus:ring-[#008060] outline-none transition-all shadow-sm ${errors[`mapping.${field.key}`] ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                                                    value={data.mapping[field.key] || ''}
                                                    onChange={(e) => {
                                                        setData('mapping', { ...data.mapping, [field.key]: e.target.value });
                                                        if (errors[`mapping.${field.key}`]) delete errors[`mapping.${field.key}`];
                                                    }}
                                                >
                                                    <option value="">-- Ignore Field --</option>
                                                    {fileHeaders.map((header, idx) => (
                                                        <option key={idx} value={header}>{header}</option>
                                                    ))}
                                                </select>
                                                {errors[`mapping.${field.key}`] && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <AlertCircle size={10} />
                                                        <span className="text-[10px] font-bold">{errors[`mapping.${field.key}`]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                    <button type="button" onClick={() => setStep(2)} className="text-[12px] text-slate-500 font-bold hover:text-slate-800 transition-colors underline underline-offset-4">Back to Upload</button>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={onClose} className="text-[12px] text-slate-400 font-bold hover:text-slate-600 transition-colors">Cancel</button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="h-[36px] px-10 bg-[#008060] text-white font-bold rounded-[4px] text-[12px] hover:bg-[#006e52] transition-all flex items-center gap-2 shadow-lg shadow-[#008060]/20"
                                        >
                                            {processing ? <Loader2 size={16} className="animate-spin" /> : 'Start Final Import'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
