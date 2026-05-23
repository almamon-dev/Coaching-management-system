import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Plus,
    ArrowLeft,
    Upload,
    Save,
    X,
    ShieldCheck,
    CheckCircle2,
    ImageIcon,
    Send,
    Briefcase
} from "lucide-react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Notify from '@/Utils/Notify';
 
export default function Create({ auth, brands }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        email: "",
        phone: "",
        address: "",
        status: true,
        logo: null,
        brand_ids: [],
    });
 
    const [preview, setPreview] = useState(null);
 
    // Auto-generate slug from name
    useEffect(() => {
        const slug = data.name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
        setData("slug", slug);
    }, [data.name]);
 
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };
 
    const toggleBrand = (id) => {
        const newBrandIds = data.brand_ids.includes(id)
            ? data.brand_ids.filter(bid => bid !== id)
            : [...data.brand_ids, id];
        setData('brand_ids', newBrandIds);
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.suppliers.store"), {
            onSuccess: () => Notify.success('Supplier added!', 'The new supplier has been created successfully.'),
            onError: () => Notify.error('Form Error', 'Please check the required fields.'),
        });
    };
 
    return (
        <AdminLayout user={auth.user}>
            <Head title="Add New Supplier" />
 
            <div className="min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#081621]">Add New Supplier</h1>
                        <p className="text-[#666666] text-sm mt-1 font-medium">Create a new vendor profile and assign their brands.</p>
                    </div>
                    <Link
                        href={route("admin.suppliers.index")}
                        className="h-[38px] px-5 bg-white border border-slate-200 rounded-[3px] text-[#666666] font-bold text-[12px] flex items-center gap-2 hover:border-[#ef4a23] hover:text-[#ef4a23] transition-all shadow-sm"
                    >
                        <ArrowLeft size={16} /> Back to Suppliers
                    </Link>
                </div>
 
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#ef4a23]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Basic Information</h3>
                            </div>
 
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <InputLabel value="Supplier Name" />
                                        <TextInput
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className="w-full"
                                            placeholder="e.g. HP Global, Dell India"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
 
                                    <div className="space-y-1">
                                        <InputLabel value="URL Slug" />
                                        <TextInput
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                            className="w-full bg-slate-50/50"
                                            placeholder="supplier-slug"
                                        />
                                        <InputError message={errors.slug} />
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        {/* Contact Info */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#ef4a23]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Contact Details</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <InputLabel value="Email Address" />
                                        <TextInput
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full"
                                            placeholder="contact@supplier.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel value="Phone Number" />
                                        <TextInput
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            className="w-full"
                                            placeholder="+880 1XXX XXXXXX"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <InputLabel value="Physical Address" />
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            className="w-full min-h-[80px] p-3 bg-white border border-slate-200 rounded-[2px] text-[13px] font-medium focus:border-[#ef4a23] outline-none transition-all placeholder:text-slate-300"
                                            placeholder="Enter full business address..."
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        {/* Brand Assignment */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <Briefcase size={16} className="text-[#ef4a23]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Assigned Brands</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-[11px] text-slate-500 font-medium mb-4">Select the brands this supplier provides (e.g. HP, Dell, Asus).</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {brands.map(brand => (
                                        <div 
                                            key={brand.id}
                                            onClick={() => toggleBrand(brand.id)}
                                            className={`p-3 border rounded-[2px] cursor-pointer transition-all flex items-center justify-between group ${
                                                data.brand_ids.includes(brand.id)
                                                    ? 'border-[#ef4a23] bg-orange-50/50'
                                                    : 'border-slate-100 bg-slate-50/30 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className={`text-[12px] font-bold transition-colors ${
                                                data.brand_ids.includes(brand.id) ? 'text-[#ef4a23]' : 'text-[#081621]'
                                            }`}>
                                                {brand.name}
                                            </span>
                                            {data.brand_ids.includes(brand.id) && (
                                                <CheckCircle2 size={14} className="text-[#ef4a23]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.brand_ids} className="mt-2" />
                            </div>
                        </div>
                    </div>
 
                    <div className="lg:col-span-4 space-y-6">
                        {/* Logo Upload */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#ef4a23]" />
                                <h3 className="text-[12px] font-bold text-[#081621] uppercase tracking-wider">Supplier Logo</h3>
                            </div>
                            <div className="p-6">
                                <div className="w-full h-[200px] bg-slate-50 rounded-[1px] border border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#ef4a23] transition-all">
                                    {preview ? (
                                        <div className="relative w-full h-full p-4">
                                            <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setData('logo', null) }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 border border-slate-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-6 text-center">
                                            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-300 mb-3 group-hover:scale-105 group-hover:text-[#ef4a23] transition-all border border-slate-100">
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-[12px] font-bold text-[#081621]">Upload Logo</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                        </label>
                                    )}
                                </div>
                                <InputError message={errors.logo} className="mt-2 text-center" />
                            </div>
                        </div>
 
                        {/* Status & Actions */}
                        <div className="bg-white rounded-[1px] border border-slate-200 shadow-sm p-6 space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[2px] border border-slate-100">
                                <span className="text-[12px] font-bold text-[#081621]">Supplier Status</span>
                                <div
                                    onClick={() => setData('status', !data.status)}
                                    className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${data.status ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${data.status ? 'left-5.5' : 'left-0.5'}`} style={{ left: data.status ? '22px' : '2px' }} />
                                </div>
                            </div>
 
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-[42px] bg-[#ef4a23] text-white rounded-[1.5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#d83a1a] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing ? <Plus className="animate-spin" size={16} /> : <Send size={16} />}
                                Save Supplier
                            </button>
                            <Link
                                href={route('admin.suppliers.index')}
                                className="w-full h-[42px] bg-white border border-slate-200 text-[#2f3344] rounded-[1.5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
