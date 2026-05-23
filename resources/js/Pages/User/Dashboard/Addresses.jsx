import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import AddressCard from './Partials/AddressCard';
import AddressModal from './Partials/AddressModal';
import AddressEmptyState from './Partials/AddressEmptyState';

const Addresses = ({ auth, addresses }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        type: 'Home',
        name: '',
        address: '',
        city: '',
        area: '',
        post_code: '',
        is_primary: false,
    });

    const openEditModal = (addr) => {
        setEditingAddress(addr);
        setData({
            type: addr.type,
            name: addr.name,
            address: addr.address,
            city: addr.city,
            area: addr.area || '',
            post_code: addr.post_code || '',
            is_primary: !!addr.is_primary,
        });
        clearErrors();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            patch(route('user.addresses.update', editingAddress.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this address?')) {
            destroy(route('user.addresses.destroy', id));
        }
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="My Addresses" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white p-5 rounded-[1px] border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">My Addresses</h1>
                        <p className="text-slate-400 text-[11px] font-medium mt-1 uppercase tracking-wider">Manage your delivery addresses</p>
                    </div>
                </div>

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(addresses.data || []).map((addr) => (
                        <AddressCard 
                            key={addr.id} 
                            addr={addr} 
                            onEdit={openEditModal} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
                
                {/* Empty State */}
                {(addresses.data || []).length === 0 && <AddressEmptyState />}
            </div>

            <AddressModal 
                show={showModal} 
                onClose={closeModal} 
                data={data} 
                setData={setData} 
                errors={errors} 
                processing={processing} 
                onSubmit={submit} 
            />
        </UserLayout>
    );
};

export default Addresses;
