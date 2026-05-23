import React, { useState, useEffect } from 'react';
import { X, Upload, Download, FileText, CheckCircle2, ChevronRight, AlertCircle, Loader2, Info } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
 
const SupplierImportModal = ({ show, onClose }) => {
    const [step, setStep] = useState(1); // 1: Guide, 2: Upload, 3: Mapping
    const [fileHeaders, setFileHeaders] = useState([]);
    const [isParsing, setIsParsing] = useState(false);
 
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        zip: null,
        mapping: {}
    });
 
    const targetFields = [
        { key: 'name', label: 'Supplier Name', required: true },
        { key: 'email', label: 'Email Address', required: false },
        { key: 'phone', label: 'Phone Number', required: false },
        { key: 'address', label: 'Office Address', required: false },
        { key: 'brands', label: 'Brand IDs (Comma separated)', required: false },
        { key: 'status', label: 'Status (1:Active, 0:Inactive)', required: false },
        { key: 'slug', label: 'Custom Slug', required: false },
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
            const response = await axios.post(route('admin.suppliers.parse-import'), formData);
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
        post(route('admin.suppliers.import'), { onSuccess: () => { reset(); onClose(); } });
    };
 
    if (!show) return null;
 
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className={`bg-white rounded-[2px] shadow-2xl w-full max-w-[600px] overflow-hidden relative animate-in zoom-in-95 duration-200 border transition-colors duration-300 ${data.file ? 'border-green-600' : 'border-slate-200'}`}>
                {/* Header */}
                <div className={`px-6 py-4 transition-all duration-300 flex items-center justify-between ${data.file ? 'bg-green-600' : 'bg-slate-50/50 border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        {data.file && (
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="text-white" size={12} strokeWidth={3} />
                            </div>
                        )}
                        <h3 className={`text-[15px] font-bold truncate ${data.file ? 'text-white' : 'text-[#081621]'}`}>
                            {data.file ? `Target File: ${data.file.name}` : 'Supplier Bulk Import Wizard'}
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
                                <div className={`flex items-center gap-2 text-[11px] font-bold tracking-tight ${step === s.id ? 'text-[#ef4a23]' : step > s.id ? 'text-green-600' : 'text-slate-400'}`}>
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${step === s.id ? 'border-[#ef4a23]' : step > s.id ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300'}`}>
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
                                                <li>• If you have logos, name them after the supplier slug or name.</li>
                                                <li>• Put all logos into a single ZIP file (no subfolders).</li>
                                                <li>• Brands should be provided as comma-separated ID lists.</li>
                                            </ul>
                                        </div>
                                    </div>
 
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 border border-slate-200 rounded-sm bg-[#f8f9fa]">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended</span>
                                            <p className="text-[12px] text-[#081621] font-medium mt-1">Use our template for auto-mapping.</p>
                                            <a href={route('admin.suppliers.download-template')} className="inline-flex items-center gap-1.5 text-[11px] text-[#ef4a23] font-bold mt-2 hover:underline">
                                                <Download size={12} /> Get Template
                                            </a>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-sm bg-[#f8f9fa] flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Supported Files</span>
                                                <p className="text-[12px] text-[#081621] font-medium mt-1">CSV and Excel (.xlsx) files are supported.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
 
                                <div className="pt-4 flex justify-end border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="h-[38px] px-8 bg-[#ef4a23] text-white font-bold rounded-sm text-[12px] hover:bg-[#ef4a23]/90 transition-all flex items-center gap-2"
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
                                        className={`border border-dashed rounded-sm p-5 flex flex-col items-center justify-center transition-all min-h-[140px] relative ${dragActive ? 'bg-slate-50 border-[#ef4a23]' : 'bg-[#f8f9fa] border-slate-200 hover:border-slate-300'}`}
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
                                        className={`border border-dashed rounded-sm p-5 flex flex-col items-center justify-center transition-all min-h-[140px] relative ${zipDragActive ? 'bg-slate-50 border-[#3749bb]' : 'bg-[#f8f9fa] border-slate-200 hover:border-slate-300'}`}
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
                                                    <span className="text-[13px] font-bold text-[#081621]">Logos (ZIP)</span>
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
                                        className="h-[38px] px-8 bg-[#ef4a23] text-white font-bold rounded-sm text-[12px] hover:bg-[#ef4a23]/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Next Step <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
 
                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-[#f8f9fa] border border-slate-200 rounded-sm p-4 flex items-center gap-3">
                                    <AlertCircle className="text-[#ef4a23]" size={16} />
                                    <span className="text-[12px] text-[#081621] font-medium italic">Make sure each supplier field below is correctly matched to a column from your file.</span>
                                </div>
 
                                <div className="max-h-[260px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-x-8 gap-y-4">
                                    {targetFields.map((field) => (
                                        <div key={field.key} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-[#666] tracking-tight flex items-center gap-1.5">
                                                {field.label} {field.required && <span className="text-[#ef4a23]">*</span>}
                                            </label>
                                            <select
                                                className="h-[36px] w-full px-3 bg-white border border-slate-200 text-[12px] rounded-sm focus:ring-1 focus:ring-[#ef4a23] outline-none transition-all shadow-sm"
                                                value={data.mapping[field.key] || ''}
                                                onChange={(e) => setData('mapping', { ...data.mapping, [field.key]: e.target.value })}
                                            >
                                                <option value="">-- Ignore Field --</option>
                                                {fileHeaders.map((header, idx) => (
                                                    <option key={idx} value={header}>{header}</option>
                                                ))}
                                            </select>
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
                                            className="h-[40px] px-10 bg-[#3749bb] text-white font-bold rounded-sm text-[13px] hover:bg-[#2e3d9e] transition-all flex items-center gap-2 shadow-lg shadow-[#3749bb]/20"
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
 
export default SupplierImportModal;
