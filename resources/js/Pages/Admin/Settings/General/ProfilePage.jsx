import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import { router, useForm } from '@inertiajs/react';
import { Camera, Contact, Mail, Phone, User } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import SettingsLayout from '../Layouts/SettingsLayout';

export default function Profile({ user }) {
    const fileInputRef = useRef();

    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        designation: user?.designation || '',
        bio: user?.bio || '',
        profile_picture: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        post(route('admin.settings.general.profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                setData('profile_picture', null);
            },
            onError: () => toast.error('Failed to update profile.'),
        });
    };

    const removePicture = () => {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            router.post(route('admin.settings.general.profile.remove-picture'), {}, {
                onSuccess: () => toast.success('Profile picture removed.'),
            });
        }
    };

    return (
        <SettingsLayout
            title="Profile Settings"
            subtitle="Update your personal information and public profile details."
            processing={processing}
            onSave={handleSubmit}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Contact size={16} className="text-slate-400" />
                            <h3 className="text-[13px] font-bold text-slate-700">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <InputLabel value="Full Name" />
                                <TextInput
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel value="Email Address" />
                                <div className="relative">
                                    <TextInput
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`pl-9 ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                    />
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel value="Phone Number" />
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className={`pl-9 ${errors.phone_number ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                    />
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                                <InputError message={errors.phone_number} className="mt-1" />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel value="Designation" />
                                <TextInput
                                    type="text"
                                    value={data.designation}
                                    onChange={e => setData('designation', e.target.value)}
                                    className={errors.designation ? 'border-red-500 ring-1 ring-red-500' : ''}
                                />
                                <InputError message={errors.designation} className="mt-1" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <InputLabel value="Biography" />
                            <TextArea
                                rows="3"
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                placeholder="Write a short bio about yourself..."
                                className={errors.bio ? 'border-red-500 ring-1 ring-red-500' : ''}
                            />
                            <InputError message={errors.bio} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Avatar Section */}
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50/50 rounded-[4px] border border-slate-100 flex flex-col items-center text-center space-y-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                                {data.profile_picture ? (
                                    <img src={URL.createObjectURL(data.profile_picture)} alt="Preview" className="w-full h-full object-cover" />
                                ) : user.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-white text-[#008060] rounded-full flex items-center justify-center shadow-md border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-slate-700">Profile Photo</h4>
                            <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or GIF. Max 2MB.</p>
                            <div className="flex justify-center gap-3 mt-3">
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="text-[12px] font-bold text-[#008060] hover:underline"
                                >
                                    Upload new
                                </button>
                                {(user.profile_picture || data.profile_picture) && (
                                    <button
                                        type="button"
                                        onClick={removePicture}
                                        className="text-[12px] font-bold text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {errors.profile_picture && <p className="text-red-500 text-[11px] mt-1">{errors.profile_picture}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
